import mongoose from "mongoose";
import OpenAI from "openai";
import TeacherInsight from "../../models/teacherInsight.model";
import { getTeacherStudentsAnalytics } from "../grades/grade.service";

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

export const getTeacherAiInsights = async (
  teacherId: string,
  page: number = 1,
  limit: number = 5
) => {
  const tId = new mongoose.Types.ObjectId(teacherId);
  const skip = (Math.max(1, page) - 1) * limit;

  const [totalCount, rawInsights] = await Promise.all([
    TeacherInsight.countDocuments({ teacherId: tId }),
    TeacherInsight.find({ teacherId: tId })
      .sort({ isPinned: -1, pinnedAt: -1, generatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const insights = rawInsights.map((item: any) => ({
    _id: item._id,
    summary: item.summary || item.insights || "Performance summary generated.",
    actionItems: Array.isArray(item.actionItems) ? item.actionItems : [],
    metrics: item.metrics && typeof item.metrics === "object" ? item.metrics : {},
    isPinned: Boolean(item.isPinned),
    pinnedAt: item.pinnedAt || null,
    generatedAt: item.generatedAt || item.createdAt || new Date(),
  }));

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    insights,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

export const deleteTeacherAiInsight = async (teacherId: string, insightId: string) => {
  const result = await TeacherInsight.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(insightId),
    teacherId: new mongoose.Types.ObjectId(teacherId),
  });

  if (!result) {
    throw new Error("Insight not found or you do not have permission to delete it");
  }

  return { message: "Insight deleted successfully", id: insightId };
};

export const togglePinTeacherAiInsight = async (teacherId: string, insightId: string) => {
  const tId = new mongoose.Types.ObjectId(teacherId);
  const insId = new mongoose.Types.ObjectId(insightId);

  const insight = await TeacherInsight.findOne({ _id: insId, teacherId: tId });

  if (!insight) {
    throw new Error("Insight not found");
  }

  // If we are pinning it, ensure there are not already 3 pinned items
  if (!insight.isPinned) {
    const currentPinnedCount = await TeacherInsight.countDocuments({
      teacherId: tId,
      isPinned: true,
    });

    if (currentPinnedCount >= 3) {
      throw new Error("You can only pin up to 3 insights at a time. Please unpin another insight first.");
    }

    insight.isPinned = true;
    insight.pinnedAt = new Date();
  } else {
    insight.isPinned = false;
    insight.pinnedAt = undefined;
  }

  await insight.save();

  return {
    _id: insight._id,
    isPinned: insight.isPinned,
    pinnedAt: insight.pinnedAt || null,
    message: insight.isPinned ? "Insight pinned to top" : "Insight unpinned",
  };
};

export const generateTeacherAiInsights = async (teacherId: string) => {
  try {
    const analyticsData = await getTeacherStudentsAnalytics(new mongoose.Types.ObjectId(teacherId));
    
    // Construct the data string for AI
    const dataSummary = `
      Total Classrooms: ${analyticsData.summary.totalClassrooms}
      Total Unique Students: ${analyticsData.summary.totalUniqueStudents}
      Overall Class Average: ${analyticsData.summary.overallAverageScore !== null ? analyticsData.summary.overallAverageScore + '%' : 'N/A'}
      High Achievers: ${analyticsData.summary.highAchieversCount}
      Needs Support: ${analyticsData.summary.needsSupportCount}
      
      Grade Tier Distribution:
      ${analyticsData.gradeDistribution.map(g => `- ${g.tier}: ${g.count} students (${g.percentage}%)`).join("\n")}
    `;

    const aiClient = getOpenAIClient();
    
    let structuredData = {
      summary: "With " + analyticsData.summary.totalUniqueStudents + " students, the overall average is " + (analyticsData.summary.overallAverageScore || 0) + "%.",
      actionItems: [
        "Consider scheduling extra support for the " + analyticsData.summary.needsSupportCount + " students in the lower percentiles.",
        "Continue monitoring the distribution to ensure balanced grading across the " + analyticsData.summary.totalClassrooms + " classes."
      ],
      metrics: {
        "Total Students": analyticsData.summary.totalUniqueStudents.toString(),
        "Class Average": (analyticsData.summary.overallAverageScore || "N/A") + "%",
        "High Achievers": analyticsData.summary.highAchieversCount.toString(),
        "Needs Support": analyticsData.summary.needsSupportCount.toString()
      }
    };

    if (aiClient) {
      try {
        const response = await aiClient.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an expert educational consultant. Analyze the provided teacher's class-wide grade analytics.
You MUST respond in JSON format matching this structure:
{
  "summary": "A brief 1-2 sentence overview of the current performance state.",
  "actionItems": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "metrics": {
    "Key Metric 1": "Value",
    "Key Metric 2": "Value"
  }
}
Keep action items concise and practical. Provide exactly 3 action items. metrics should have 3-4 key-value pairs that highlight interesting stats (e.g., "At Risk": "5 students", "Top Tier": "15%").`,
            },
            {
              role: "user",
              content: `Here is the analytics data for my classes:\n${dataSummary}\nProvide structured insights.`,
            },
          ],
          max_tokens: 400,
          temperature: 0.5,
        });

        const content = response.choices[0]?.message?.content?.trim();
        if (content) {
          try {
            const parsed = JSON.parse(content);
            if (parsed.summary && parsed.actionItems && parsed.metrics) {
              structuredData = parsed;
            }
          } catch(e) {
            console.error("Failed to parse OpenAI JSON response", e);
          }
        }
      } catch (err) {
        console.error("OpenAI Teacher Insight generation failed:", err);
      }
    }

    // Ensure legacy unique index teacherId_1 is dropped if it still exists in the database
    try {
      const indexes = await TeacherInsight.collection.indexes();
      const legacyUniqueIndex = indexes.find(
        (idx) => idx.name === "teacherId_1" && (idx as any).unique
      );
      if (legacyUniqueIndex) {
        await TeacherInsight.collection.dropIndex("teacherId_1");
        await TeacherInsight.syncIndexes();
      }
    } catch {
      // Safe to ignore if index does not exist or collection is uninitialized
    }

    // Append new historical record to DB
    const insight = await TeacherInsight.create({
      teacherId: new mongoose.Types.ObjectId(teacherId),
      summary: structuredData.summary,
      actionItems: structuredData.actionItems,
      metrics: structuredData.metrics,
      generatedAt: new Date()
    });

    return insight;

  } catch (error) {
    console.error("Failed to generate teacher AI insights:", error);
    throw error;
  }
};
