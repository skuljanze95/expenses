import { sql } from "drizzle-orm";
import { decimal, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { balances } from "./balance";

export const accountHistory = pgTable("account_history", {
  balance: decimal("balance").notNull(),
  balanceId: text("balance_id")
    .notNull()
    .references(() => balances.id),
  expenseAmount: decimal("expense_amount").notNull(),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  incomeAmount: decimal("income_amount").notNull(),
  investmentAmount: decimal("investment_amount").notNull(),
  savingsAmount: decimal("savings_amount").notNull(),
  timestamp: timestamp("timestamp").default(sql`now()`),
  userId: text("user_id").notNull(),
});

export type AccountHistoryInsertType = typeof accountHistory.$inferInsert;
