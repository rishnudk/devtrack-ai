import { NextRequest, NextResponse } from "next/server";
import { getSessionWithRole, isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { subtopics, topicCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

// POST /api/catalog/:categoryId/subtopics — Add a subtopic (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getSessionWithRole();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { categoryId } = await params;

    // Verify the category exists
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

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newSubtopic = await db
      .insert(subtopics)
      .values({
        id: generateId(),
        categoryId,
        name: name.trim(),
        description: description?.trim() || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(newSubtopic[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/catalog/:categoryId/subtopics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
