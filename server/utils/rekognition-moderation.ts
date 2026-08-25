// server/utils/rekognition-moderation.ts
import { DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { rekognitionClient, s3Client } from "../config/aws";

export interface ModerationResult {
  isSafe: boolean;
  flaggedCategories: string[];
  rejectionReason?: string;
  details?: Array<{ name: string; parentName?: string; confidence: number }>;
}

// Strictly blocked moderation categories
const UNSAFE_CATEGORIES = new Set([
  "explicit nudity",
  "nudity",
  "graphic male nudity",
  "graphic female nudity",
  "sexual activity",
  "illustrated explicit nudity",
  "non-explicit nudity of minors",
  "adult toys",
  "violence",
  "graphic violence or gore",
  "physical violence",
  "weapon violence",
  "weapons",
  "self harm",
  "visually disturbing",
  "corpses",
  "hanging",
  "emaciated bodies",
  "drugs",
  "drug products",
  "drug use",
  "drug paraphernalia",
  "pills",
  "hate symbols",
  "nazi party",
  "white supremacy",
  "extremist",
  "rude gestures",
  "middle finger",
  "suggestive",
  "sexual situations",
  "partial nudity",
]);

/**
 * Permanently deletes an S3 object (used to purge rejected unsafe uploads)
 */
export const deleteS3Object = async (fileKey: string): Promise<boolean> => {
  try {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket || !fileKey) return false;

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      })
    );
    console.info(`[S3-CLEANUP] Deleted object from S3: ${fileKey}`);
    return true;
  } catch (err) {
    console.error(`[S3-CLEANUP-ERROR] Failed to delete S3 object ${fileKey}:`, err);
    return false;
  }
};

/**
 * Scans an S3 image using AWS Rekognition content moderation.
 * If flagged as unsafe, returns isSafe: false and the list of violated categories.
 */
export const moderateImageS3 = async (
  fileKey: string,
  minConfidence: number = 55
): Promise<ModerationResult> => {
  const bucket = process.env.AWS_S3_BUCKET;

  if (!bucket) {
    console.warn("[MODERATION] AWS_S3_BUCKET is not configured.");
    return { isSafe: true, flaggedCategories: [] };
  }

  try {
    const command = new DetectModerationLabelsCommand({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: fileKey,
        },
      },
      MinConfidence: minConfidence,
    });

    const response = await rekognitionClient.send(command);
    const moderationLabels = response.ModerationLabels || [];

    if (moderationLabels.length === 0) {
      return {
        isSafe: true,
        flaggedCategories: [],
      };
    }

    // Inspect labels
    const flaggedLabels: string[] = [];
    const details: Array<{ name: string; parentName?: string; confidence: number }> = [];

    for (const label of moderationLabels) {
      const name = (label.Name || "").trim();
      const parentName = (label.ParentName || "").trim();
      const confidence = label.Confidence || 0;

      const lowerName = name.toLowerCase();
      const lowerParent = parentName.toLowerCase();

      details.push({ name, parentName: parentName || undefined, confidence });

      // Check if matches unsafe category
      if (
        UNSAFE_CATEGORIES.has(lowerName) ||
        UNSAFE_CATEGORIES.has(lowerParent) ||
        lowerName.includes("nude") ||
        lowerName.includes("sexual") ||
        lowerName.includes("violence") ||
        lowerName.includes("gore") ||
        lowerName.includes("drug")
      ) {
        const categoryDisplay = parentName ? `${parentName} (${name})` : name;
        if (!flaggedLabels.includes(categoryDisplay)) {
          flaggedLabels.push(categoryDisplay);
        }
      }
    }

    if (flaggedLabels.length > 0) {
      return {
        isSafe: false,
        flaggedCategories: flaggedLabels,
        rejectionReason: `Image contains restricted content: ${flaggedLabels.join(", ")}`,
        details,
      };
    }

    return {
      isSafe: true,
      flaggedCategories: [],
      details,
    };
  } catch (err: any) {
    console.error(`[MODERATION-ERROR] AWS Rekognition failed for key ${fileKey}:`, err);
    // If AWS Rekognition encounters an issue (e.g. invalid permissions or unsupported format),
    // we log error and allow graceful handling
    return {
      isSafe: true,
      flaggedCategories: [],
    };
  }
};
