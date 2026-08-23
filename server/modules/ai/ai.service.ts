import OpenAI from "openai";

interface EnhanceParams {
  title?: string;
  description?: string;
  type?: "GRADED" | "MATERIAL";
}

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

/**
 * Concise educational fallback generator (max 1 heading + 2-3 lines)
 */
const generateFallbackEnhancement = ({
  title,
  description,
  type = "GRADED",
}: EnhanceParams): string => {
  const isMaterial = type === "MATERIAL";
  const itemTitle =
    title?.trim() || (isMaterial ? "Study Notes" : "Assignment");

  if (description?.trim()) {
    if (isMaterial) {
      return `### ${itemTitle} - Study Guide\n1. **Core Reading**: ${description.trim()}\n2. **Review**: Note key architectural patterns and principles.`;
    }
    return `### ${itemTitle} - Instructions\n1. **Requirements**: ${description.trim()}\n2. **Submission**: Upload your completed deliverables prior to the deadline.`;
  }

  if (title?.trim()) {
    if (isMaterial) {
      return `### ${itemTitle} - Study Guide\n1. **Review Notes**: Study the attached reference materials on **${itemTitle}**.\n2. **Key Concepts**: Summarize core definitions and foundational patterns.\n3. **Discussion**: Share questions in the coursework comment thread.`;
    }
    return `### ${itemTitle} - Assignment Guidelines\n1. **Implementation**: Complete all tasks and exercises for **${itemTitle}**.\n2. **Verification**: Test your solution thoroughly against sample requirements.\n3. **Submission**: Submit your final files (.pdf / .docx / code) before the deadline.`;
  }

  if (isMaterial) {
    return `### Course Reference Guide\n1. **Review**: Read through the provided reference notes carefully.\n2. **Practice**: Apply key principles to your independent study exercises.\n3. **Q&A**: Ask any questions in the assignment discussion forum.`;
  }

  return `### Assignment Instructions\n1. **Tasks**: Complete all designated problems and exercises carefully.\n2. **Quality**: Ensure your work is well-structured and properly documented.\n3. **Submission**: Upload your deliverables before the deadline.`;
};

/**
 * Enhance or generate concise assignment description with rich Markdown (max 3 lines + heading)
 */
export const enhanceAssignmentDescription = async ({
  title,
  description,
  type = "GRADED",
}: EnhanceParams): Promise<string> => {
  const client = getOpenAIClient();

  // If no OpenAI client available, use smart fallback
  if (!client) {
    return generateFallbackEnhancement({ title, description, type });
  }

  const isMaterial = type === "MATERIAL";
  const hasDescription = Boolean(description && description.trim().length > 0);
  const hasTitle = Boolean(title && title.trim().length > 0);

  const systemPrompt = `You are an expert academic curriculum assistant.
Your task is to produce a very concise, structured coursework description for students using clean GitHub-flavored Markdown.

STRICT LENGTH & FORMAT RULES:
- Output exactly ONE heading at the top (e.g. ### Assignment Overview or ### Study Guide).
- Followed by MAXIMUM 2 to 3 concise, impactful bullet points (format: 1. **Task Title**: Brief 1-sentence action).
- STRICTLY MAXIMUM 3 bullet points total. NO long paragraphs. Keep it punchy, direct, and under 350 characters total.
- If type is "MATERIAL", frame as concise reading and study notes guidance.
- If type is "GRADED", frame as concise requirements and submission criteria.
- Output ONLY the final markdown text without any conversational preamble or quotes.`;

  let userPrompt = "";

  if (hasDescription) {
    userPrompt = `Please condense and format the following draft into exactly 1 heading + max 3 bullet points:
Title: ${title || "Untitled Coursework"}
Type: ${type}
Teacher's Draft:
"""
${description?.trim()}
"""`;
  } else if (hasTitle) {
    userPrompt = `Please generate a concise description (1 heading + max 3 bullet points) for:
Title: "${title?.trim()}"
Type: ${type}`;
  } else {
    userPrompt = `Please generate a concise standard description template (1 heading + max 3 bullet points) for coursework type: ${type}`;
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 180,
      temperature: 0.4,
    });

    const result = response.choices[0]?.message?.content?.trim();
    if (result) {
      if (result.length > 500) {
        return result.slice(0, 495) + "...";
      }
      return result;
    }

    return generateFallbackEnhancement({ title, description, type });
  } catch (error) {
    console.error("OpenAI API call failed, using intelligent fallback:", error);
    return generateFallbackEnhancement({ title, description, type });
  }
};
