import { relations, sql } from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const transactionType = [
  "expense",
  "income",
  "investment",
  "saving",
] as const;

export const transactionTypeEnum = pgEnum("transaction_type", transactionType);

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: transactionTypeEnum("type").notNull(),
  userId: text("user_id").notNull(),
});

export type CategoryInsertType = typeof categories.$inferInsert;

export type CategoryType = typeof categories.$inferSelect;

export const transactions = pgTable("transaction", {
  amount: decimal("amount").notNull(),
  categoryId: text("category_id").references(() => categories.id),

  date: timestamp("date").default(sql`now()`),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  recurringTransactionId: text("recurring_transaction_id"),
  title: text("title").notNull(),
  type: transactionTypeEnum("type").notNull(),
  userId: text("user_id").notNull(),
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export type TransactionType = typeof transactions.$inferSelect;
export type TransactionInsertType = typeof transactions.$inferInsert;

export const transactionDrafts = pgTable("transaction_draft", {
  amount: decimal("amount"),
  categoryId: text("category_id").references(() => categories.id),
  date: timestamp("date").default(sql`now()`),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: transactionTypeEnum("type").notNull(),
  userId: text("user_id").notNull(),
});

export const transactionDraftRelations = relations(
  transactionDrafts,
  ({ one }) => ({
    category: one(categories, {
      fields: [transactionDrafts.categoryId],
      references: [categories.id],
    }),
  }),
);
export type TransactionDraftType = typeof transactionDrafts.$inferSelect;

export const recurringTransactions = pgTable("recurring_transaction", {
  amount: decimal("amount"),
  categoryId: text("category_id").references(() => categories.id),
  day: integer("day").notNull(),
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: transactionTypeEnum("type").notNull(),
  userId: text("user_id").notNull(),
});

export const recurringTransactionRelations = relations(
  recurringTransactions,
  ({ one }) => ({
    category: one(categories, {
      fields: [recurringTransactions.categoryId],
      references: [categories.id],
    }),
  }),
);

export type RecurringTransactionInsertType =
  typeof recurringTransactions.$inferInsert;

export type RecurringTransactionType =
  typeof recurringTransactions.$inferSelect;
