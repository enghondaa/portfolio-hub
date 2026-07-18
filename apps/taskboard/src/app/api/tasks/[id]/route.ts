import { NextResponse } from "next/server";
import { store } from "@/lib/db";
import { updateTaskSchema } from "@/lib/types";

export const dynamic = "force-dynamic";

// Next.js 16: route params arrive as a Promise and must be awaited.
type RouteContext = { params: Promise<{ id: string }> };

/** PATCH /api/tasks/[id] — partial update. 404 when the id doesn't exist. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const task = await store.update(id, parsed.data);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json({ task });
  } catch (error) {
    console.error(`PATCH /api/tasks/${id} failed`, error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

/** DELETE /api/tasks/[id] — 204 on success, 404 if it was already gone. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const removed = await store.remove(id);
    if (!removed) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/tasks/${id} failed`, error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
