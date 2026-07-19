import {
  createMemoryStore,
  createPostgresStore,
  type OrdersStore,
} from "@portfolio/orders-core";

/**
 * The one store instance the storefront's route handlers talk to.
 *
 * Production runs on Postgres. The in-memory fallback exists only so the app
 * boots in local dev without a database, and both apps show a loud red banner
 * in that mode because with it the storefront and admin are disconnected —
 * see PersistenceBanner and the note in orders-core's Postgres adapter.
 *
 * Admin passwords are irrelevant to the demo (the login page has one-click
 * buttons) but are still stored hashed, because the source is public and read
 * as proof. Hashing is bcrypt in the admin app; the storefront never checks a
 * password, so it seeds placeholder hashes it will never verify against.
 */

const SEED_VERSION = process.env.SEED_VERSION ?? "kahwa-v1";

const ADMIN_SEED = [
  { id: "adm_owner", name: "Demo Owner", email: "owner@demo", passwordHash: "seeded-in-admin-app", role: "owner" as const },
  { id: "adm_staff", name: "Demo Staff", email: "staff@demo", passwordHash: "seeded-in-admin-app", role: "staff" as const },
];

export const isPersistent = Boolean(process.env.POSTGRES_URL);

export const store: OrdersStore = isPersistent
  ? createPostgresStore({ seedVersion: SEED_VERSION, admins: ADMIN_SEED })
  : createMemoryStore({ seedVersion: SEED_VERSION, admins: ADMIN_SEED });
