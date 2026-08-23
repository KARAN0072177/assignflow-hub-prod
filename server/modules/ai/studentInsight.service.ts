import { Types } from "mongoose";
import OpenAI from "openai";
import { Grade } from "../../models/grade.model";
import {
  StudentPerformanceInsight,
  InsightSentiment,
} from "../../models/studentInsight.model";

let openaiClient: OpenAI | null = null;

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};

export interface StudentInsightResponse {
  hasData: boolean;
  advice: string;
  focusArea: string;
  sentiment: InsightSentiment;
  averageScore: number;
  gradesCount: number;
  lastGradeEvaluatedAt?: Date | null;
  generatedAt: Date;
  isCached: boolean;
}

/**
 * Deterministic rule-based fallback when OpenAI is unavailable or in fallback mode
 */
const generateFallbackInsight = (
  averageScore: number,
  lowestScoreAssignment?: { title: string; score: number }
): { advice: string; focusArea: string; sentiment: InsightSentiment } => {
  if (averageScore >= 90) {
    return {
      advice:
        "Outstanding consistency and high mastery across your assignments! Keep challenging yourself with advanced problem sets and maintaining this top academic standard.",
      focusArea: "Advanced Mastery",
      sentiment: InsightSentiment.EXCELLING,
    };
  }

  if (averageScore >= 80) {
    const focus = lowestScoreAssignment
      ? `Reviewing concepts in "${lowestScoreAssignment.title}" will help push your overall scores into top honors.`
      : "Focus on fine-tuning details in lower-scoring assignments to push your average into top honors.";
    return {
      advice: `Strong grasp of key coursework concepts with solid performance. ${focus}`,
      focusArea: lowestScoreAssignment ? lowestScoreAssignment.title : "Concept Refinement",
      sentiment: InsightSentiment.GOOD,
    };
  }

  if (averageScore >= 65) {
    const focus = lowestScoreAssignment
      ? `Focus on strengthening fundamentals in "${lowestScoreAssignment.title}" and applying instructor feedback before submitting.`
      : "Spend extra time practicing hands-on coursework and reviewing instructor feedback before submitting.";
    return {
      advice: `Solid foundational progress with noticeable growth opportunities. ${focus}`,
      focusArea: lowestScoreAssignment ? lowestScoreAssignment.title : "Core Practice & Review",
      sentiment: InsightSentiment.NEEDS_IMPROVEMENT,
    };
  }

  return {
    advice:
      "Focus on revisiting foundational coursework topics and clarifying doubts with your instructor early. Establishing a structured daily study routine will boost upcoming scores.",
    focusArea: "Foundational Review",
    sentiment: InsightSentiment.NEEDS_ATTENTION,
  };
};

/**
 * Retrieve cached student performance insight or compute fresh AI advice if new grades exist
 */
export const getOrGenerateStudentPerformanceInsight = async (
  studentId: Types.ObjectId
): Promise<StudentInsightResponse> => {
  // 1. Query all published grades for the student
  const publishedGrades = await Grade.find({
    studentId,
    published: true,
  })
    .populate("assignmentId", "title type")
    .sort({ updatedAt: -1, createdAt: -1 });

  // If student has no graded coursework yet
  if (publishedGrades.length === 0) {
    return {
      hasData: false,
      advice:
        "No graded coursework available yet. Complete and submit assignments to unlock your personalized AI academic coaching.",
      focusArea: "Getting Started",
      sentiment: InsightSentiment.GOOD,
      averageScore: 0,
      gradesCount: 0,
      lastGradeEvaluatedAt: null,
      generatedAt: new Date(),
      isCached: true,
    };
  }

  // 2. Compute current metrics snapshot
  const gradesCount = publishedGrades.length;
  const latestGrade = publishedGrades[0];
  const latestGradeTimestamp = latestGrade.updatedAt || latestGrade.createdAt;
  const scores = publishedGrades.map((g) => g.score);
  const averageScore = Number(
    (scores.reduce((a, b) => a + b, 0) / gradesCount).toFixed(1)
  );

  // 3. Check for cached AI insight
  const cached = await StudentPerformanceInsight.findOne({ studentId });

  if (
    cached &&
    cached.gradesCountEvaluated === gradesCount &&
    cached.lastGradeEvaluatedAt &&
    new Date(cached.lastGradeEvaluatedAt).getTime() ===
      new Date(latestGradeTimestamp).getTime()
  ) {
    // 🎯 CACHE HIT: 0 OpenAI API calls, 0 cost, instant return!
    return {
      hasData: true,
      advice: cached.advice,
      focusArea: cached.focusArea,
      sentiment: cached.sentiment,
      averageScore: cached.averageScoreEvaluated,
      gradesCount: cached.gradesCountEvaluated,
      lastGradeEvaluatedAt: cached.lastGradeEvaluatedAt,
      generatedAt: cached.generatedAt,
      isCached: true,
    };
  }

  // 4. CACHE MISS: Compute fresh AI advice (Triggered only on first visit or when new grade is generated)
  let sentiment: InsightSentiment;
  if (averageScore >= 88) sentiment = InsightSentiment.EXCELLING;
  else if (averageScore >= 75) sentiment = InsightSentiment.GOOD;
  else if (averageScore >= 60) sentiment = InsightSentiment.NEEDS_IMPROVEMENT;
  else sentiment = InsightSentiment.NEEDS_ATTENTION;

  // Identify lowest scoring assignment to guide focus
  const sortedByScore = [...publishedGrades].sort((a, b) => a.score - b.score);
  const lowestGraded = sortedByScore[0];
  const lowestAssignmentTitle =
    (lowestGraded.assignmentId as any)?.title || "Coursework";

  let advice = "";
  let focusArea = "";

  const openai = getOpenAIClient();

  if (openai) {
    try {
      const gradesSummary = publishedGrades
        .slice(0, 10) // Limit to 10 most recent to keep prompt tiny
        .map((g) => {
          const title = (g.assignmentId as any)?.title || "Assignment";
          const feedbackSnippet = g.feedback
            ? ` (Teacher Feedback: "${g.feedback.slice(0, 80)}")`
            : "";
          return `- ${title}: ${g.score}/100${feedbackSnippet}`;
        })
        .join("\n");

      const prompt = `You are a supportive academic advisor AI. Analyze this student's coursework record:
Overall Average Score: ${averageScore}/100 across ${gradesCount} assignment(s).
Recent Grades:
${gradesSummary}

Instructions:
1. Provide exactly 2 short, constructive, and highly actionable sentences advising the student where to focus and how to excel. Max 40 words total.
2. Identify a 2-4 word "focusArea" (e.g. "${lowestAssignmentTitle}", "Core Concept Revision", "Advanced Problem Solving").
3. Return STRICT JSON with keys: "advice" (string) and "focusArea" (string).`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an encouraging academic AI advisor. Output strictly valid JSON with keys: advice, focusArea. Max 2 concise sentences for advice.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 120,
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.advice && parsed.focusArea) {
          advice = parsed.advice.trim();
          focusArea = parsed.focusArea.trim();
        }
      }
    } catch (openaiErr) {
      console.warn(
        "OpenAI student insight generation failed, using educational fallback:",
        openaiErr
      );
    }
  }

  // If OpenAI was skipped or failed, use rule-based educational generator
  if (!advice || !focusArea) {
    const fallback = generateFallbackInsight(averageScore, {
      title: lowestAssignmentTitle,
      score: lowestGraded.score,
    });
    advice = fallback.advice;
    focusArea = fallback.focusArea;
  }

  // 5. Upsert into database cache
  const savedInsight = await StudentPerformanceInsight.findOneAndUpdate(
    { studentId },
    {
      advice,
      focusArea,
      sentiment,
      gradesCountEvaluated: gradesCount,
      lastGradeEvaluatedAt: latestGradeTimestamp,
      averageScoreEvaluated: averageScore,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return {
    hasData: true,
    advice: savedInsight.advice,
    focusArea: savedInsight.focusArea,
    sentiment: savedInsight.sentiment,
    averageScore: savedInsight.averageScoreEvaluated,
    gradesCount: savedInsight.gradesCountEvaluated,
    lastGradeEvaluatedAt: savedInsight.lastGradeEvaluatedAt,
    generatedAt: savedInsight.generatedAt,
    isCached: false,
  };
};
