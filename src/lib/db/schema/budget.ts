import { relations, sql } from "drizzle-orm";
import {
  decimal,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { categories } from "./transaction";

export const budget = pgTable(
  "budget",
  {
    amount: decimal("amount").default("0.0").notNull(),
    categoryId: text("category_id").references(() => categories.id),
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    updatedAt: timestamp("updatedAt").default(sql`now()`),
    userId: text("userId").notNull(),
  },
  (table) => {
    return {
      userCategoryUnique: uniqueIndex("user_category_unique").on(
        table.userId,
        table.categoryId,
      ),
    };
  },
);

export type BudgetType = typeof budget.$inferSelect;
export type BudgetInsertType = typeof budget.$inferInsert;

export const budgetRelations = relations(budget, ({ one }) => ({
  category: one(categories, {
    fields: [budget.categoryId],
    references: [categories.id],
  }),
}));
