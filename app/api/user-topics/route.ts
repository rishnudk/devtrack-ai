import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  userSelectedTopics,
  topicCategories,
  subtopics,
  subtopic_notes,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// GET /api/user-topics — Fetch the user's selected topics with joined catalog data
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const selected = await db
      .select()
      .from(userSelectedTopics)
      .where(eq(userSelectedTopics.userId, session.user.id))
      .orderBy(userSelectedTopics.createdAt);

    // Enrich with catalog data
    const enriched = await Promise.all(
      selected.map(async (item) => {
        const category = await db
          .select()
          .from(topicCategories)
          .where(eq(topicCategories.id, item.categoryId))
          .limit(1);

        const subtopic = await db
          .select()
          .from(subtopics)
          .where(eq(subtopics.id, item.subtopicId))
          .limit(1);

        let concept = null;
        if (item.conceptId) {
          const conceptResult = await db
            .select()
            .from(subtopic_notes)
            .where(eq(subtopic_notes.id, item.conceptId))
            .limit(1);
          concept = conceptResult[0] || null;
        }

        return {
          ...item,
          category: category[0] || null,
          subtopic: subtopic[0] || null,
          concept,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("GET /api/user-topics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user-topics — Select a topic from the catalog
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, subtopicId, conceptId } = body;

    if (!categoryId || !subtopicId) {
      return NextResponse.json(
        { error: "categoryId and subtopicId are required" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existing = await db
      .select()
      .from(userSelectedTopics)
      .where(
        and(
          eq(userSelectedTopics.userId, session.user.id),
          eq(userSelectedTopics.categoryId, categoryId),
          eq(userSelectedTopics.subtopicId, subtopicId)
        )
      )
      .limit(1);

    if (existing.length) {
      return NextResponse.json(
        { error: "Topic already in your list" },
        { status: 409 }
      );
    }

    // Verify category exists
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

    // Verify subtopic exists
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

    const newSelection = await db
      .insert(userSelectedTopics)
      .values({
        id: generateId(),
        userId: session.user.id,
        categoryId,
        subtopicId,
        conceptId: conceptId || null,
        status: "not_started",
        progress: 0,
      })
      .returning();

    return NextResponse.json(newSelection[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/user-topics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
