# LangChain Code Reviewer

[![npm version](https://img.shields.io/npm/v/langchain-code-reviewer.svg)](https://www.npmjs.com/package/langchain-code-reviewer)
[![npm downloads](https://img.shields.io/npm/dm/langchain-code-reviewer.svg)](https://www.npmjs.com/package/langchain-code-reviewer)
[![license](https://img.shields.io/npm/l/langchain-code-reviewer.svg)](https://github.com/dave-8bit/Code-Reviewer/blob/main/LICENSE)

**AI-powered code review for developers and AI agents.** Powered by **Groq** + **LLaMA 3**, with a fast, developer-friendly output format—**free, no paid API**.

---

## Three Ways to Use It

### 1) As a CLI
Review a file directly from your terminal:

```bash
coderev review src/App.tsx --focus all --language javascript
```

Add `--json` to get raw JSON output.

---

### 2) As a Node / TypeScript Import
Use the LangChain tool programmatically:

```ts
import { CodeReviewTool } from "langchain-code-reviewer";

async function main() {
  const tool = new CodeReviewTool();

  const code = `function divide(a, b) {
  return a / b;
}

// BUG: b may be undefined
console.log(divide(10));`;

  const input = JSON.stringify({
    code,
    language: "javascript",
    focus: "all",
  });

  const review = await tool.invoke(input);
  console.log(review);
}

main();
```

---

### 3) As a LangChain Tool (for AI Agents)
Plug the tool into an agent workflow:

```ts
import { CodeReviewTool } from "langchain-code-reviewer";

const tool = new CodeReviewTool();

// Provide the tool with a JSON string input
// { code, language, focus?, outputFormat? }
// Then let your agent call the tool as needed.
```

---

## Installation

### Install (library)
```bash
npm install langchain-code-reviewer
```

### Install (CLI)
```bash
npm install -g langchain-code-reviewer
```

---

## Setup (Groq API key)

1. Get a **Groq API key** from the Groq dashboard.
2. Set the environment variable `GROQ_API_KEY`.

### Windows (PowerShell)
```powershell
$env:GROQ_API_KEY="your_groq_api_key"
```

### macOS / Linux (bash/zsh)
```bash
export GROQ_API_KEY="your_groq_api_key"
```

---

## Features

- **Bugs detection**
- **Security issue** identification
- **Performance** improvements
- **Style** suggestions
- **Confidence scores** for each issue (0–100)
- **Fixed code suggestions** when available
- **Quality score** (1–10)
- Supports multiple languages (JS/TS/Python/Go/Rust/Java and more)

---

## CLI Commands

```bash
coderev --help
coderev review --help
```

Example:

```bash
coderev review src/App.tsx --focus bugs
coderev review src/App.tsx --json --focus all
```

Language is auto-detected from the file extension when you don’t pass `--language`.

---

## Output Example

```text
Code Review Report
Language: typescript
Quality Score: 7/10

Summary:
Overall summary here

Issues (2):
🔴 CRITICAL [bug]:12
- Message: ...
- Confidence: 85%
- Suggestion: How to fix it
- Fixed Code:
```...```

Strengths:
- ...

Timestamp: 2026-01-01T00:00:00.000Z
```

---

## Built With

- TypeScript
- Groq AI
- LLaMA 3.3
- LangChain
- Commander.js

---

## License

MIT

