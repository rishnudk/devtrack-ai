import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// PATCH /api/topics/:topicId/notes/:noteId
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string; noteId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await params;
    const body = await request.json();
    const { title, content } = body;

    const updated = await db
      .update(notes)
      .set({
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        updatedAt: new Date(),
      })
      .where(
        and(eq(notes.id, noteId), eq(notes.userId, session.user.id))
      )
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/topics/:id/notes/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/topics/:topicId/notes/:noteId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ topicId: string; noteId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await params;

    const deleted = await db
      .delete(notes)
      .where(
        and(eq(notes.id, noteId), eq(notes.userId, session.user.id))
      )
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/topics/:id/notes/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}