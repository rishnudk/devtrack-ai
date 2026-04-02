import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { groq } from "@/lib/ai";
import { generateText } from "ai";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topicName, subtopic } = body;

    if (!topicName) {
      return NextResponse.json(
        { error: "Topic name is required" },
        { status: 400 }
      );
    }

    const prompt = subtopic
      ? `Generate clear, structured developer notes about "${subtopic}" within the context of ${topicName}.`
      : `Generate clear, structured developer notes about ${topicName}.`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are an expert developer educator. Generate concise, practical notes for developers learning a new topic.

Format your response as follows:
- Start with a brief 1-2 sentence overview
- Use clear sections with headers (##)
- Include code examples where relevant using markdown code blocks
- Add key concepts as bullet points
- Keep it practical and actionable
- Maximum 400 words`,
      prompt,
    });

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("AI generate-notes error:", error);
    return NextResponse.json(
      { error: "Failed to generate notes" },
      { status: 500 }
    );
  }
}