import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Order status
 * ------------------------------------------------------------------ */

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Customer-facing explanation of what happens after each status. */
export const ORDER_STATUS_NEXT_COPY: Record<OrderStatus, string> = {
  placed: "We have your order and are checking stock. You'll get a confirmation shortly.",
  confirmed: "Your beans are queued for roasting and packing.",
  packed: "Your parcel is sealed and waiting for the courier to collect it.",
  shipped: "Your parcel is with the courier and moving toward your city.",
  out_for_delivery: "A courier is carrying your parcel today. Keep your phone nearby.",
  delivered: "This order is complete. We hope the coffee is good.",
  cancelled: "This order was cancelled. Nothing was charged, and nothing will ship.",
};

/* ------------------------------------------------------------------ *
 * Entities
 * ------------------------------------------------------------------ */

export type AdminRole = "owner" | "staff";
export type EventActor = "system" | "customer" | `admin:${string}`;

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageKey: string;
  stockQty: number;
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  qty: number;
  unitPriceCents: number;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string;
  actor: EventActor;
  at: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  status: OrderStatus;
  placedAt: string;
  timeline: OrderEvent[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
}

/* ------------------------------------------------------------------ *
 * Schemas
 * ------------------------------------------------------------------ */

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name must be 80 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(10, "Please enter a full delivery address").max(300, "Address must be 300 characters or fewer"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1, "Quantity must be at least 1").max(99, "Quantity must be 99 or fewer"),
      })
    )
    .min(1, "Your cart is empty"),
});

export const trackLookupSchema = z.object({
  orderNumber: z.string().trim().min(1, "Enter your order number"),
  email: z.string().trim().email("Enter the email used on the order"),
});

export const advanceStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().trim().max(300, "Note must be 300 characters or fewer").default(""),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  description: z.string().trim().min(10, "Give the product a real description").max(600),
  priceCents: z.number().int().min(1, "Price must be greater than zero"),
  stockQty: z.number().int().min(0, "Stock cannot be negative"),
  active: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type TrackLookupInput = z.infer<typeof trackLookupSchema>;
export type AdvanceStatusInput = z.infer<typeof advanceStatusSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
