import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/topics/:topicId/notes
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await params;

    const topicNotes = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.topicId, topicId),
          eq(notes.userId, session.user.id)
        )
      )
      .orderBy(notes.createdAt);

    return NextResponse.json(topicNotes);
  } catch (error) {
    console.error("GET /api/topics/:id/notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/topics/:topicId/notes
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await params;
    const body = await request.json();
    const { title, content, isAiGenerated } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newNote = await db
      .insert(notes)
      .values({
        id: generateId(),
        topicId,
        userId: session.user.id,
        title: title.trim(),
        content: content.trim(),
        isAiGenerated: isAiGenerated ? "true" : "false",
      })
      .returning();

    return NextResponse.json(newNote[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/topics/:id/notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}