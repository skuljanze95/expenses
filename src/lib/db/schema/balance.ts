import { sql } from "drizzle-orm";
import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const balances = pgTable("balance", {
  balance: decimal("balance").default("0.0").notNull(),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  updatedAt: timestamp("updatedAt").default(sql`now()`),
  userId: text("userId").notNull(),
});
