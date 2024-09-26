import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";

import { accountHistory } from "./schema/account-history";
import { balances } from "./schema/balance";
import { budget, budgetRelations } from "./schema/budget";
import {
  categories,
  recurringTransactionRelations,
  recurringTransactions,
  transactionDraftRelations,
  transactionDrafts,
  transactionRelations,
  transactions,
} from "./schema/transaction";

const schema = {
  accountHistory,
  balances,
  budget,
  budgetRelations,
  categories,
  recurringTransactionRelations,
  recurringTransactions,
  transactionDraftRelations,
  transactionDrafts,
  transactionRelations,
  transactions,
};

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
