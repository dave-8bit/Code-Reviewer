import Groq from "groq-sdk";

import type {
  CodeIssue,
  CodeReviewInput,
  CodeReviewResult,
} from "../types/review";

function normalizeParsedReview(raw: any, language: string): CodeReviewResult {
  const issues: CodeIssue[] = Array.isArray(raw?.issues)
    ? raw.issues.map((i: any) => {
        const confidence = typeof i?.confidence === "number" ? i.confidence : 0;
        const fixedCode = typeof i?.fixedCode === "string" ? i.fixedCode : null;

        return {
          line: i?.line ?? null,
          severity: i?.severity,
          category: i?.category,
          message: i?.message,
          suggestion: i?.suggestion,
          confidence: Number.isFinite(confidence) ? confidence : 0,
          fixedCode,
        };
      })
    : [];

  const strengths: string[] = Array.isArray(raw?.strengths) ? raw.strengths : [];

  const qualityScore = Number(raw?.qualityScore);

  return {
    language,
    qualityScore: Number.isFinite(qualityScore) ? qualityScore : 0,
    summary: String(raw?.summary ?? ""),
    issues,
    strengths: strengths.map(String),
    timestamp: new Date(),
  };
}

export async function reviewCode(input: CodeReviewInput): Promise<CodeReviewResult> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing environment variable GROQ_API_KEY. Set it to your Groq API key.",
      );
    }

    const client = new Groq({ apiKey });

    const focus = input.focus ?? "all";
    const outputFormat = input.outputFormat ?? "text";

    const prompt = [
      "You are an expert software engineer and code reviewer.",
      `Review the following code for ${focus}.`,
      "Return ONLY valid JSON matching this exact shape:",
      "json{",
      '  "qualityScore": 8,',
      '  "summary": "Overall summary here",',
      '  "issues": [',
      "    {",
      '      "line": 12,',
      '      "severity": "critical",',
      '      "category": "bug",',
      '      "message": "Issue description",',
      '      "suggestion": "How to fix it",',
      '      "confidence": 95,',
      '      "fixedCode": "const x = value ?? defaultValue;"',
      "    }",
      "  ],",
      '  "strengths": ["strength 1", "strength 2"]',
      "}",
      "Instructions:",
      "- Add confidence as a number from 0 to 100 indicating how confident you are about each issue.",
      "- Add fixedCode as the actual corrected code snippet for that specific issue, or null if no fix applies.",
      "- Keep everything else the same.",
      "Code:",
      "```",
      input.code,
      "```",
      `Language: ${input.language}`,
      "Focus: " + focus,
      `Output format preference: ${outputFormat}`,
    ].join("\n");

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response?.choices?.[0]?.message?.content ?? "";

    // Extract JSON if the model includes extra text.
    const jsonMatch = String(text).match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error(
        `Failed to parse Groq response as JSON. Response was: ${text}`,
      );
    }

    const result = normalizeParsedReview(parsed, input.language);

    // Clamp confidence to 0-100 if the model provides out-of-range values.
    result.issues = result.issues.map((issue) => {
      const confidence = Number.isFinite(issue.confidence)
        ? Math.min(100, Math.max(0, issue.confidence))
        : 0;
      return { ...issue, confidence };
    });

    // Clamp quality score to 1-10 if the model provides out-of-range values.
    if (Number.isFinite(result.qualityScore)) {
      result.qualityScore = Math.min(10, Math.max(1, result.qualityScore));
    }

    return result;
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    throw new Error(`reviewCode failed: ${msg}`);
  }
}

