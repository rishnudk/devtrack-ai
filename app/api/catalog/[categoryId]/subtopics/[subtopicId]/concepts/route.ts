import { NextRequest, NextResponse } from "next/server";
import { getSessionWithRole, isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { subtopic_notes, subtopics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

// POST /api/catalog/:categoryId/subtopics/:subtopicId/concepts — Add a concept (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string; subtopicId: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { subtopicId } = await params;

    // Verify the subtopic exists
    const subtopic = await db
      .select()
      .from(subtopics)
      .where(eq(subtopics.id, subtopicId))
      .limit(1);

    if (!subtopic.length) {
      return NextResponse.json(
        { error: "Subtopic not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newConcept = await db
      .insert(subtopic_notes)
      .values({
        id: generateId(),
        subtopicId,
        name: name.trim(),
        description: description?.trim() || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(newConcept[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/catalog/.../concepts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
