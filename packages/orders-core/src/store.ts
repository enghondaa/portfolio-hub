import type {
  AdminUser,
  Customer,
  EventActor,
  Order,
  OrderStatus,
  Product,
} from "./types";

/**
 * The one interface both apps talk to.
 *
 * apps/orders and apps/orders-admin each own their route handlers, but
 * neither reaches past this contract. That is what lets the same order be
 * written by a customer on the storefront and advanced by an admin, with
 * only one implementation of the rules in between.
 */
export interface OrdersStore {
  /* catalogue */
  listProducts(options?: { includeInactive?: boolean }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  createProduct(input: Omit<Product, "id">): Promise<Product>;
  updateProduct(id: string, input: Partial<Omit<Product, "id">>): Promise<Product | null>;

  /* customers */
  listCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  findCustomerByEmail(email: string): Promise<Customer | null>;

  /* orders */
  listOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  /** Lookup for the public tracking page. Email must match, or this returns null. */
  findOrderForTracking(orderNumber: string, email: string): Promise<Order | null>;
  createOrder(input: CreateOrderInput): Promise<Order>;
  /** Appends an event and moves the order. Callers must have already validated the transition. */
  appendEvent(orderId: string, status: OrderStatus, note: string, actor: EventActor): Promise<Order | null>;

  /* admin users */
  findAdminByEmail(email: string): Promise<AdminUser | null>;

  /* operations */
  reset(): Promise<void>;
}

export interface CreateOrderInput {
  customer: { name: string; email: string };
  address: string;
  items: { productId: string; qty: number }[];
}

/** Thrown when a basket cannot be fulfilled. Carries per-product detail for the 422 body. */
export class StockError extends Error {
  problems: { productId: string; reason: string; available: number; requested: number }[];

  constructor(problems: StockError["problems"]) {
    super("Some items are no longer available in the quantity requested.");
    this.name = "StockError";
    this.problems = problems;
  }
}
