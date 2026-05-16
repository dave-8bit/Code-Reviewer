export type CodeReviewFocus = "bugs" | "performance" | "security" | "style" | "all";

export interface CodeReviewInput {
  code: string;
  language: string;
  focus?: CodeReviewFocus;
}

export type CodeIssueSeverity = "critical" | "warning" | "suggestion";

export interface CodeIssue {
  line: number | null;
  severity: CodeIssueSeverity;
  category: string;
  message: string;
  suggestion: string;
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

