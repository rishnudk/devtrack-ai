import { NextRequest, NextResponse } from "next/server";
import { getSessionWithRole, isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { subtopic_notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// DELETE /api/catalog/:categoryId/subtopics/:subtopicId/concepts/:conceptId — Delete a concept (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string; subtopicId: string; conceptId: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { conceptId } = await params;

    const deleted = await db
      .delete(subtopic_notes)
      .where(eq(subtopic_notes.id, conceptId))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Concept not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/catalog/.../concepts/:conceptId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
