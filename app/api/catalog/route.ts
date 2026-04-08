import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionWithRole, isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/db";
import { topicCategories, subtopics, subtopic_notes } from "@/lib/db/schema";
import { generateId } from "@/lib/utils";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/catalog — List all categories with nested subtopics and concepts
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all categories
    const categories = await db
      .select()
      .from(topicCategories)
      .orderBy(topicCategories.createdAt);

    // Fetch all subtopics
    const allSubtopics = await db
      .select()
      .from(subtopics)
      .orderBy(subtopics.createdAt);

    // Fetch all concepts (subtopic_notes)
    const allConcepts = await db
      .select()
      .from(subtopic_notes)
      .orderBy(subtopic_notes.createdAt);

    // Nest subtopics and concepts into categories
    const nested = categories.map((category) => ({
      ...category,
      subtopics: allSubtopics
        .filter((s) => s.categoryId === category.id)
        .map((subtopic) => ({
          ...subtopic,
          concepts: allConcepts.filter((c) => c.subtopicId === subtopic.id),
        })),
    }));

    return NextResponse.json(nested);
  } catch (error) {
    console.error("GET /api/catalog error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/catalog — Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionWithRole();
    if (!session || !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, icon } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newCategory = await db
      .insert(topicCategories)
      .values({
        id: generateId(),
        name: name.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        cretedBy: session.user.id,
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/catalog error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}