import type { NextRequest } from "next/server";

import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  type AccountHistoryInsertType,
  accountHistory,
} from "@/lib/db/schema/account-history";
import { transactions } from "@/lib/db/schema/transaction";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  yesterday.setHours(10, 0, 0, 0);

  const balances = await db.query.balances.findMany({});

  for (const balance of balances) {
    const userTransactions = await db.query.transactions.findMany({
      where: and(
        eq(transactions.userId, balance.userId),
        gte(transactions.date, startOfMonth),
        lte(transactions.date, endOfMonth),
      ),
    });

    const typeSums = {
      expense: 0,
      income: 0,
      investment: 0,
      saving: 0,
    };

    for (const transaction of userTransactions) {
      typeSums[transaction.type] += Number(transaction.amount);
    }

    const accountHistoryData: AccountHistoryInsertType = {
      balance: balance.balance.toString(),
      balanceId: balance.id,
      expenseAmount: typeSums.expense.toString(),
      incomeAmount: typeSums.income.toString(),
      investmentAmount: typeSums.investment.toString(),
      savingsAmount: typeSums.saving.toString(),
      timestamp: yesterday,
      userId: balance.userId,
    };

    await db.insert(accountHistory).values(accountHistoryData);
  }

  return Response.json({ success: true });
}
