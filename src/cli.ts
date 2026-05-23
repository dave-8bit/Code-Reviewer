#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";

import { CodeReviewTool } from "./tools/codeReviewTool";

function detectLanguageFromExtension(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".ts":
      return "typescript";
    case ".js":
      return "javascript";
    case ".py":
      return "python";
    case ".rs":
      return "rust";
    case ".go":
      return "go";
    case ".java":
      return "java";
    default:
      return "auto";
  }
}

function startSpinner(message: string) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  let stopped = false;

  process.stdout.write(message);
  const timer = setInterval(() => {
    if (stopped) return;
    const frame = frames[i % frames.length];
    i++;
    process.stdout.write(`\r${frame} ${message}`);
  }, 80);

  return {
    stop(finalMessage?: string) {
      stopped = true;
      clearInterval(timer);
      process.stdout.write(`\r${finalMessage ?? ""}`.trimEnd() + "\n");
    },
  };
}

const program = new Command();
program
  .name("coderev")
  .version("2.0.0")
  .description("AI-powered code reviewer");

program
  .command("review")
  .argument("file", "Path to file to review")
  .option(
    "--language <lang>",
    "Language to review (defaults to auto-detect from extension)",
  )
  .option("--focus <focus>", "Review focus: bugs, performance, security, style, or all", "all")
  .option("--json", "Output raw JSON")
  .action(async (file: string, options: any) => {
    const absPath = path.resolve(process.cwd(), file);

    if (!fs.existsSync(absPath)) {
      console.error(`File not found: ${absPath}`);
      process.exitCode = 1;
      return;
    }

    const spinner = startSpinner("Reviewing code...");
    try {
      const content = fs.readFileSync(absPath, "utf8");

      const detected = detectLanguageFromExtension(absPath);
      const language = options.language ?? (detected === "auto" ? path.extname(absPath).slice(1) : detected);

      const tool = new CodeReviewTool();

      const payload = {
        code: content,
        language,
        focus: options.focus,
        outputFormat: options.json ? "json" : "text",
      };

      const input = JSON.stringify(payload);
      const result = await tool.invoke(input);

      spinner.stop("Done");
      process.stdout.write(String(result));
    } catch (err: any) {
      spinner.stop("Failed");
      console.error(err?.message ? String(err.message) : String(err));
      process.exitCode = 1;
    }
  });

program.parse();

