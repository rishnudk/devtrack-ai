import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSelectedTopics } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/user-topics/:selectedTopicId — Get a single selected topic
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ selectedTopicId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedTopicId } = await params;

    const result = await db
      .select()
      .from(userSelectedTopics)
      .where(
        and(
          eq(userSelectedTopics.id, selectedTopicId),
          eq(userSelectedTopics.userId, session.user.id)
        )
      )
      .limit(1);

    if (!result.length) {
      return NextResponse.json(
        { error: "Selected topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET /api/user-topics/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/user-topics/:selectedTopicId — Update progress/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ selectedTopicId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedTopicId } = await params;
    const body = await request.json();
    const { status, progress } = body;

    const updated = await db
      .update(userSelectedTopics)
      .set({
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userSelectedTopics.id, selectedTopicId),
          eq(userSelectedTopics.userId, session.user.id)
        )
      )
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { error: "Selected topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/user-topics/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user-topics/:selectedTopicId — Remove from personal list
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ selectedTopicId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedTopicId } = await params;

    const deleted = await db
      .delete(userSelectedTopics)
      .where(
        and(
          eq(userSelectedTopics.id, selectedTopicId),
          eq(userSelectedTopics.userId, session.user.id)
        )
      )
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Selected topic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/user-topics/:id error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
