# LangChain Code Reviewer

AI-powered code review tool that works as a **LangChain Tool**, powered by **Groq (free, no paid API needed)**.

## Features

- Detects **bugs**
- Flags **security issues**
- Highlights **performance problems**
- Provides a **quality score (1-10)**
- Returns **human-readable feedback** with issues and suggestions
- Supports multiple languages (e.g., **JavaScript, TypeScript, Python**, etc.)
- Works as a **LangChain Tool** (`CodeReviewTool`)

## Installation

```bash
npm install langchain-code-reviewer
```

## Setup

1. Create a Groq API key.
2. Set the environment variable:

### Windows (PowerShell)

```powershell
$env:GROQ_API_KEY="your_groq_api_key"
```

### macOS / Linux

```bash
export GROQ_API_KEY="your_groq_api_key"
```

## Quick Start

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

  const review = await tool.call(input);
  console.log(review);
}

main();
```

## Supported Languages

- JavaScript
- TypeScript
- Python
- And other languages supported by passing the appropriate `language` string

## Built With

- TypeScript
- Groq AI
- LLaMA 3 (via Groq)
- LangChain

## License

MIT

