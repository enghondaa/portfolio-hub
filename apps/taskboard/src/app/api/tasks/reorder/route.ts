import { NextResponse } from "next/server";
import { store } from "@/lib/db";
import { reorderSchema } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/tasks/reorder — persist a whole column's order in one request.
 * The client sends the full ordered id list after a drag, rather than one
 * PATCH per moved card, so a reorder is a single round trip.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const tasks = await store.reorder(parsed.data.column, parsed.data.orderedIds);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("POST /api/tasks/reorder failed", error);
    return NextResponse.json({ error: "Failed to reorder tasks" }, { status: 500 });
  }
}
