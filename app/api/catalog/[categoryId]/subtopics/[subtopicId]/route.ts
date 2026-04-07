import { NextRequest, NextResponse } from "next/server";
import { getSessionWithRole, isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { subtopics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// DELETE /api/catalog/:categoryId/subtopics/:subtopicId — Delete a subtopic (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string; subtopicId: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { subtopicId } = await params;

    const deleted = await db
      .delete(subtopics)
      .where(eq(subtopics.id, subtopicId))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Subtopic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/catalog/.../subtopics/:subtopicId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
