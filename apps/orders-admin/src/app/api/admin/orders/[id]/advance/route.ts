import { NextResponse } from "next/server";
import { advanceStatusSchema, assertTransition, IllegalTransitionError, ORDER_STATUS_LABELS } from "@portfolio/orders-core";
import { store } from "@/lib/store";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/orders/[id]/advance — move an order to its next status.
 *
 * Any authenticated admin (owner or staff) may advance a status. The legality
 * of the move is enforced by orders-core's assertTransition, the same function
 * the UI uses to decide which buttons to show, so an out-of-band request can't
 * skip steps. The resulting OrderEvent records the acting admin by name and is
 * immediately visible on the customer's tracking page.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = advanceStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const order = await store.getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Cancellation goes through the dedicated owner-only route, not here.
  if (parsed.data.status === "cancelled") {
    return NextResponse.json({ error: "Use the cancel action to cancel an order." }, { status: 422 });
  }

  try {
    assertTransition(order.status, parsed.data.status);
  } catch (error) {
    if (error instanceof IllegalTransitionError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw error;
  }

  const note = parsed.data.note || `Marked ${ORDER_STATUS_LABELS[parsed.data.status].toLowerCase()}.`;
  const updated = await store.appendEvent(id, parsed.data.status, note, `admin:${session.name}`);
  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ status: updated.status });
}
