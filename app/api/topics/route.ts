import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { topics } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/topics
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.userId, session.user.id))
      .orderBy(topics.createdAt);

    return NextResponse.json(userTopics);
  } catch (error) {
    console.error("GET /api/topics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/topics
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Topic name is required" },
        { status: 400 }
      );
    }

    const newTopic = await db
      .insert(topics)
      .values({
        id: generateId(),
        userId: session.user.id,
        name: name.trim(),
        description: description?.trim() || null,
        status: "not_started",
        progress: 0,
      })
      .returning();

    return NextResponse.json(newTopic[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/topics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}