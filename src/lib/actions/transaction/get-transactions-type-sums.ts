"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte } from "drizzle-orm";

import { db } from "@/lib/db";
import { accountHistory } from "@/lib/db/schema/account-history";
import { transactionType, transactions } from "@/lib/db/schema/transaction";
import { getSameDayLastMonth, percentageChange } from "@/lib/utils";

export type TransactionTypeSums = {
  percentage: number;
  title: (typeof transactionType)[number];
  value: number;
  percentageOfIncome?: number;
};

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getTransactionsTypeSums() {
  const userId = handleAuth();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sameDayLastMonth = getSameDayLastMonth(now);

  try {
    const data = await db.query.transactions.findMany({
      orderBy: [desc(transactions.date)],
      where: and(
        eq(transactions.userId, userId),
        gte(transactions.date, startOfMonth),
      ),
      with: { category: true },
    });

    const history = await db.query.accountHistory.findFirst({
      where: and(
        eq(accountHistory.userId, userId),
        eq(accountHistory.timestamp, sameDayLastMonth),
      ),
    });

    const typeSums: TransactionTypeSums[] = transactionType
      .map((type) => {
        const sum = data
          .filter((t) => t.type === type)
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalIncome = data
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const historySum = () => {
          if (type === "income") {
            return Number(
              percentageChange(
                Number(sum),
                Number(history?.incomeAmount),
              )?.toFixed(1),
            );
          } else if (type === "expense") {
            return Number(
              percentageChange(
                Number(sum),
                Number(history?.expenseAmount),
              )?.toFixed(1),
            );
          } else if (type === "investment") {
            return Number(
              percentageChange(
                Number(sum),
                Number(history?.investmentAmount),
              )?.toFixed(1),
            );
          } else if (type === "saving") {
            return Number(
              percentageChange(
                Number(sum),
                Number(history?.savingsAmount),
              )?.toFixed(1),
            );
          }
        };

        return {
          percentage: historySum() ?? 0,
          percentageOfIncome:
            type !== "income"
              ? Number(((sum / totalIncome) * 100).toFixed(1))
              : undefined,
          title: type,
          value: sum,
        };
      })
      .filter((typeSum) => typeSum !== undefined) as TransactionTypeSums[];

    return {
      typeSums,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get transactions");
  }
}
