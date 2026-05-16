import { CodeReviewTool } from "../src/index";

async function main() {
  try {
    const tool = new CodeReviewTool();

    const buggyCode = `function divide(a, b) {
  return a / b;
}

// BUG: b may be undefined
console.log(divide(10));`;

    const input = JSON.stringify({
      code: buggyCode,
      language: "javascript",
      focus: "all",
    });

    const result = await tool.call(input);
    console.log(result);
  } catch (err) {
    console.error("Failed to run basic usage example:", err);
  }
}

main();

