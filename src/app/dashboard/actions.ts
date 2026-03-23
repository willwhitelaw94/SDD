"use server";

import fs from "fs";
import path from "path";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const CONTENT_DIR = path.join(process.cwd(), "content/initiatives");

export async function claimBounty(
  initiativeSlug: string,
  epicSlug: string,
  claimedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const metaPath = path.join(
      CONTENT_DIR,
      initiativeSlug,
      epicSlug,
      "meta.yaml"
    );

    if (!fs.existsSync(metaPath)) {
      return { success: false, error: "Epic not found" };
    }

    let content = fs.readFileSync(metaPath, "utf-8");

    // Remove existing claim fields if present
    content = content.replace(/^bounty_claimed_by:.*\n?/m, "");
    content = content.replace(/^bounty_claimed_date:.*\n?/m, "");

    // Add claim fields before the first blank line or at the end
    const today = new Date().toISOString().split("T")[0];
    const claimLines = `bounty_claimed_by: ${claimedBy}\nbounty_claimed_date: ${today}\n`;

    // Insert after the last simple key-value line before gates/phases/stories
    const insertBefore = content.search(/\n(gates|phases|stories|$)/m);
    if (insertBefore > 0) {
      content =
        content.slice(0, insertBefore) +
        "\n" +
        claimLines +
        content.slice(insertBefore);
    } else {
      content = content.trimEnd() + "\n" + claimLines;
    }

    fs.writeFileSync(metaPath, content, "utf-8");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function unclaimBounty(
  initiativeSlug: string,
  epicSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const metaPath = path.join(
      CONTENT_DIR,
      initiativeSlug,
      epicSlug,
      "meta.yaml"
    );

    if (!fs.existsSync(metaPath)) {
      return { success: false, error: "Epic not found" };
    }

    let content = fs.readFileSync(metaPath, "utf-8");
    content = content.replace(/^bounty_claimed_by:.*\n?/m, "");
    content = content.replace(/^bounty_claimed_date:.*\n?/m, "");

    fs.writeFileSync(metaPath, content, "utf-8");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function generateEpicSummary(
  initiativeSlug: string,
  epicTitle: string,
  epicStatus: string,
  artifactContent: Record<string, string>
): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    const artifactText = Object.entries(artifactContent)
      .map(([name, content]) => `## ${name}\n${content.slice(0, 3000)}`)
      .join("\n\n---\n\n");

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5-20250514"),
      // Using direct Anthropic provider with API key — not routed through AI Gateway
      prompt: `You are a project analyst. Generate a concise status summary for this epic.

Epic: ${epicTitle}
Initiative: ${initiativeSlug.replace(/-/g, " ")}
Current Status: ${epicStatus}

Artifacts:
${artifactText}

Write a 2-3 paragraph summary covering:
1. What this epic is about (one sentence)
2. Current progress and what's been completed
3. What remains to be done or any blockers

Keep it factual and concise. No markdown headers — just plain paragraphs.`,
    });

    return { success: true, summary: text };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
