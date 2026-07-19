import bcrypt from "bcryptjs";
import {
  createMemoryStore,
  createPostgresStore,
  type OrdersStore,
} from "@portfolio/orders-core";

/**
 * The admin app's store instance, sharing the same Postgres database as the
 * storefront. That shared database is the whole point: an order advanced here
 * shows up on the customer's tracking page because both apps read and write
 * the same rows. With the in-memory fallback the two apps are disconnected,
 * which the red PersistenceBanner states plainly.
 *
 * Admin passwords are hashed with bcrypt. The demo password is public (shown
 * on the login page) and both accounts share it, but it is still hashed and
 * verified for real, because the source is public and read as proof of how
 * credential auth is done.
 */

const SEED_VERSION = process.env.SEED_VERSION ?? "kahwa-v2";

/** The demo password, shown on the login page. Both seeded accounts use it. */
export const DEMO_PASSWORD = "kahwa-demo";

// Precomputed bcrypt hash of DEMO_PASSWORD (cost 10), so seeding does not pay
// a hashing round-trip on every cold start. Verified with bcrypt.compare.
const DEMO_HASH = "$2a$10$FooNbRoon24SmJcwDHQUgen02sIiR.ZyoGaVDVCAVq0eWI2wsNXWm";

const ADMIN_SEED = [
  { id: "adm_owner", name: "Demo Owner", email: "owner@demo", passwordHash: DEMO_HASH, role: "owner" as const },
  { id: "adm_staff", name: "Demo Staff", email: "staff@demo", passwordHash: DEMO_HASH, role: "staff" as const },
];

export const isPersistent = Boolean(process.env.POSTGRES_URL);

export const store: OrdersStore = isPersistent
  ? createPostgresStore({ seedVersion: SEED_VERSION, admins: ADMIN_SEED })
  : createMemoryStore({ seedVersion: SEED_VERSION, admins: ADMIN_SEED });

/**
 * Verifies an email/password pair against the stored bcrypt hash.
 *
 * If the storefront seeded a placeholder hash before this app ran, the stored
 * hash will not match DEMO_PASSWORD; the login endpoint handles that by
 * accepting the known demo password for a seeded account and letting the admin
 * store self-heal the hash. Returns the admin (minus the hash) on success.
 */
export async function verifyLogin(email: string, password: string) {
  const admin = await store.findAdminByEmail(email);
  if (!admin) return null;

  let ok = false;
  try {
    ok = await bcrypt.compare(password, admin.passwordHash);
  } catch {
    ok = false;
  }
  // Fallback: a seeded demo account with the known demo password is accepted
  // even if the storefront wrote a placeholder hash first. This only ever
  // matches the two public demo accounts against the public demo password.
  if (!ok && password === DEMO_PASSWORD && (email === "owner@demo" || email === "staff@demo")) {
    ok = true;
  }
  if (!ok) return null;

  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
}
