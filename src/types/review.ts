export type CodeReviewFocus = "bugs" | "performance" | "security" | "style" | "all";

/**
 * Supported languages: javascript, typescript, python, rust, go, java, cpp, csharp, php, ruby
 */
export interface CodeReviewInput {
  code: string;
  language: string;
  focus?: CodeReviewFocus;
  /**
   * Allows choosing between formatted text output or raw JSON output.
   * Default: "text".
   */
  outputFormat?: "text" | "json";
}

export type CodeIssueSeverity = "critical" | "warning" | "suggestion";

export interface CodeIssue {
  line: number | null;
  severity: CodeIssueSeverity;
  category: string;
  message: string;
  suggestion: string;
  /** Confidence in this issue being correct, expressed as a percentage (0-100). */
  confidence: number;
  /** If available, contains the actual corrected code snippet for that specific issue. */
  fixedCode: string | null;
}

export interface CodeReviewResult {
  language: string;
  qualityScore: number; // Expected range: 1-10
  summary: string;
  issues: CodeIssue[];
  strengths: string[];
  timestamp: Date;
}

export interface CodeReviewError {
  message: string;
  code: string;
}

