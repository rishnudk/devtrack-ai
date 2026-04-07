import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionWithRole, isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { topicCategories, subtopics, subtopic_notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/catalog/:categoryId — Get a single category with subtopics & concepts
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { categoryId } = await params;

    const category = await db
      .select()
      .from(topicCategories)
      .where(eq(topicCategories.id, categoryId))
      .limit(1);

    if (!category.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Fetch subtopics for this category
    const categorySubtopics = await db
      .select()
      .from(subtopics)
      .where(eq(subtopics.categoryId, categoryId))
      .orderBy(subtopics.createdAt);

    // Fetch concepts for each subtopic
    const subtopicIds = categorySubtopics.map((s) => s.id);
    const allConcepts = subtopicIds.length
      ? await db.select().from(subtopic_notes).orderBy(subtopic_notes.createdAt)
      : [];

    const nested = {
      ...category[0],
      subtopics: categorySubtopics.map((subtopic) => ({
        ...subtopic,
        concepts: allConcepts.filter((c) => c.subtopicId === subtopic.id),
      })),
    };

    return NextResponse.json(nested);
  } catch (error) {
    console.error("GET /api/catalog/:categoryId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/catalog/:categoryId — Delete a category (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { categoryId } = await params;

    const deleted = await db
      .delete(topicCategories)
      .where(eq(topicCategories.id, categoryId))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/catalog/:categoryId error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
