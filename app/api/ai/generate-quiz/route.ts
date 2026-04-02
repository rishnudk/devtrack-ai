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
    const { topicName, notes } = body;

    if (!topicName) {
      return NextResponse.json(
        { error: "Topic name is required" },
        { status: 400 }
      );
    }

    const context = notes?.length
      ? `Based on these notes:\n${notes.map((n: { title: string; content: string }) => `${n.title}: ${n.content}`).join("\n\n")}`
      : `Based on the topic: ${topicName}`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a developer educator creating quiz questions.
Return ONLY a valid JSON array, no markdown, no explanation.
Format: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "..."}]`,
      prompt: `Generate 5 multiple choice quiz questions for a developer learning ${topicName}. ${context}`,
    });

    const clean = text.replace(/```json|```/g, "").trim();
    const quiz = JSON.parse(clean);

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("AI generate-quiz error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}