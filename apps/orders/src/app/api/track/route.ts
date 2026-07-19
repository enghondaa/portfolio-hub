import { NextResponse } from "next/server";
import { ORDER_STATUS_LABELS, ORDER_STATUS_NEXT_COPY, trackLookupSchema } from "@portfolio/orders-core";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/track — look up an order for the public tracking page.
 *
 * Requires the order number AND the matching customer email. The store only
 * returns the order when both line up, so this endpoint cannot be used to
 * walk order numbers and read other people's orders. A wrong email and an
 * unknown number both come back as the same 404, so neither answer confirms
 * whether the other order exists.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = trackLookupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const order = await store.findOrderForTracking(parsed.data.orderNumber, parsed.data.email);
    if (!order) {
      return NextResponse.json(
        { error: "We couldn't find an order with that number and email together. Check both and try again." },
        { status: 404 }
      );
    }

    // Estimated delivery: seeded rule of shippedAt + 3 days, only meaningful
    // once the parcel has actually shipped.
    const shippedEvent = order.timeline.find((e) => e.status === "shipped");
    const estimatedDelivery =
      shippedEvent && order.status !== "delivered" && order.status !== "cancelled"
        ? new Date(new Date(shippedEvent.at).getTime() + 3 * 86_400_000).toISOString()
        : null;

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: ORDER_STATUS_LABELS[order.status],
      whatNext: ORDER_STATUS_NEXT_COPY[order.status],
      placedAt: order.placedAt,
      estimatedDelivery,
      totalCents: order.totalCents,
      itemCount: order.items.reduce((sum, i) => sum + i.qty, 0),
      timeline: order.timeline.map((e) => ({
        status: e.status,
        label: ORDER_STATUS_LABELS[e.status],
        note: e.note,
        at: e.at,
      })),
    });
  } catch (error) {
    console.error("POST /api/track failed", error);
    return NextResponse.json({ error: "Could not look up the order" }, { status: 500 });
  }
}
