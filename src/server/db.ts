import type { Repository } from "./repository";
import { getMockRepository } from "./mock-repository";

/**
 * Repository selection point. Defaults to the in-memory mock so the app
 * runs with zero setup. Set DATABASE_URL to switch to Postgres — see
 * prisma/schema.prisma and README "Menghubungkan database nyata".
 *
 * TODO(real-db): implement PrismaRepository against prisma/schema.prisma
 * and return it here when process.env.DATABASE_URL is set. Left as mock
 * for this build per product decision (see chat) — no live DB credentials
 * available yet.
 */
export function getRepository(): Repository {
  return getMockRepository();
}
