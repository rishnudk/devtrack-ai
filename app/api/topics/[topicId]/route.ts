import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { topics } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/topics/:topicId
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

    const topic = await db
      .select()
      .from(topics)
      .where(and(eq(topics.id, topicId), eq(topics.userId, session.user.id)))
      .limit(1);

    if (!topic.length) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic[0]);
  } catch (error) {
    console.error("GET /api/topics/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/topics/:topicId
export async function PATCH(
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
    const { name, description, status, progress } = body;

    const updated = await db
      .update(topics)
      .set({
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        updatedAt: new Date(),
      })
      .where(and(eq(topics.id, topicId), eq(topics.userId, session.user.id)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/topics/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/topics/:topicId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await params;

    const deleted = await db
      .delete(topics)
      .where(and(eq(topics.id, topicId), eq(topics.userId, session.user.id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/topics/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}