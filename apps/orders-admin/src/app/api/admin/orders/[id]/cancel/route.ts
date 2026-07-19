import { NextResponse } from "next/server";
import { assertTransition, IllegalTransitionError } from "@portfolio/orders-core";
import { store } from "@/lib/store";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/orders/[id]/cancel — cancel an order. Owner only.
 *
 * The role check is here on the server, not just in the UI: a staff session is
 * authenticated (so it clears the middleware) but is refused with 403. Hiding
 * the cancel button is a convenience, not the control.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (session.role !== "owner") {
    return NextResponse.json({ error: "Only an owner can cancel an order." }, { status: 403 });
  }

  const { id } = await params;

  let note = "Cancelled by owner.";
  try {
    const body = (await request.json()) as { note?: unknown };
    if (typeof body?.note === "string" && body.note.trim()) note = body.note.trim().slice(0, 300);
  } catch {
    // body is optional for cancel
  }

  const order = await store.getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  try {
    assertTransition(order.status, "cancelled");
  } catch (error) {
    if (error instanceof IllegalTransitionError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw error;
  }

  const updated = await store.appendEvent(id, "cancelled", note, `admin:${session.name}`);
  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ status: updated.status });
}
