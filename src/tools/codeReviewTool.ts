import { Tool } from "@langchain/core/tools";

import { reviewCode } from "./reviewer";
import { formatReviewResult } from "../utils/formatter";
import type { CodeReviewInput, CodeReviewResult } from "../types/review";

export class CodeReviewTool extends Tool {
  name = "code-reviewer";

  description =
    "Reviews code and provides detailed feedback including bugs, security issues, performance problems, and suggestions. Input should be a JSON string with fields: code (the code to review), language (e.g. typescript, python, javascript), and optional focus (bugs, performance, security, style, or all)";

  async _call(input: string): Promise<string> {
    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(input);
      } catch {
        return "Invalid input. Expected a JSON string with fields: code, language, and optional focus.";
      }

      const reviewInput = parsed as CodeReviewInput;

      if (!reviewInput?.code || typeof reviewInput.code !== "string") {
        return "Invalid input: 'code' must be provided as a string.";
      }
      if (!reviewInput?.language || typeof reviewInput.language !== "string") {
        return "Invalid input: 'language' must be provided as a string.";
      }

      const result: CodeReviewResult = await reviewCode(reviewInput);
      return formatReviewResult(result);
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : String(err);
      return `Code review failed: ${msg}`;
    }
  }
}

