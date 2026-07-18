import { NextResponse } from "next/server";
import { store } from "@/lib/db";
import { createTaskSchema } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/tasks — every task, ordered by column then position. */
export async function GET() {
  try {
    const tasks = await store.list();
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET /api/tasks failed", error);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

/** POST /api/tasks — create a task. 422 with field-level messages on invalid input. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const task = await store.create(parsed.data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks failed", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
