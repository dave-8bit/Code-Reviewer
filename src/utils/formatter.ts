import type { CodeIssue, CodeReviewResult } from "../types/review";

export function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case "critical":
      return "🔴";
    case "warning":
      return "🟡";
    case "suggestion":
      return "🟢";
    default:
      return "❓";
  }
}

export function formatIssue(issue: CodeIssue): string {
  const severity = issue.severity.toUpperCase();
  const linePart =
    issue.line === null || issue.line === undefined ? "" : `:${issue.line}`;

  const confidencePart = `- Confidence: ${issue.confidence}/100\n`;
  const fixedCodePart =
    issue.fixedCode !== null && issue.fixedCode !== undefined
      ? `- Fixed code: ${issue.fixedCode}`
      : `- Fixed code: (not provided)`;

  return (
    `${getSeverityEmoji(issue.severity)} ${severity} [${issue.category}]${linePart}\n` +
    `- Message: ${issue.message}\n` +
    `- Suggestion: ${issue.suggestion}\n` +
    confidencePart +
    fixedCodePart
  );
}

export function formatReviewResult(result: CodeReviewResult): string {
  const timestamp =
    result.timestamp instanceof Date
      ? result.timestamp.toISOString()
      : new Date(result.timestamp).toISOString();

  const issuesSection = result.issues.length
    ? result.issues.map((i) => formatIssue(i)).join("\n\n")
    : "(No issues found.)";

  const strengthsSection = result.strengths.length
    ? result.strengths.map((s) => `- ${s}`).join("\n")
    : "(No strengths listed.)";

  return [
    `Code Review Report`,
    `Language: ${result.language}`,
    `Quality Score: ${result.qualityScore}/10`,
    ``,
    `Summary:`,
    `${result.summary}`,
    ``,
    `Issues (${result.issues.length}):`,
    issuesSection,
    ``,
    `Strengths:`,
    strengthsSection,
    ``,
    `Timestamp: ${timestamp}`,
  ].join("\n");
}

