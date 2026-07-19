import { NextResponse } from "next/server";
import { checkoutSchema, StockError } from "@portfolio/orders-core";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/orders — place an order.
 *
 * The client sends product ids and quantities plus contact details. It does
 * NOT send prices: the store reprices every line from the catalogue, so a
 * tampered cart cannot change what is charged. Stock is validated against the
 * live catalogue and a shortfall comes back as 422 with per-product detail.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const order = await store.createOrder({
      customer: { name: parsed.data.name, email: parsed.data.email },
      address: parsed.data.address,
      items: parsed.data.items.map((i) => ({ productId: i.productId, qty: i.qty })),
    });
    return NextResponse.json({ orderNumber: order.orderNumber, email: parsed.data.email }, { status: 201 });
  } catch (error) {
    if (error instanceof StockError) {
      return NextResponse.json({ error: error.message, stock: error.problems }, { status: 422 });
    }
    console.error("POST /api/orders failed", error);
    return NextResponse.json({ error: "Could not place the order" }, { status: 500 });
  }
}
