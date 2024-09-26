"use server";

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { budget } from "@/lib/db/schema/budget";

import { getTransactions } from "../transaction/get-transactions";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getBudgetData() {
  const userId = handleAuth();

  try {
    const budgetData = await db.query.budget.findMany({
      orderBy: [desc(budget.updatedAt)],
      where: eq(budget.userId, userId),
      with: { category: true },
    });

    const categories = budgetData.map((item) => item.categoryId);
    const transactionsData = await getTransactions({ currentMonthOnly: true });

    const categorySums = transactionsData.transactions.reduce(
      (acc: Record<string, number>, item) => {
        if (categories.includes(item.categoryId) && item.categoryId !== null) {
          acc[item.categoryId] =
            (acc[item.categoryId] ?? 0) + Number(item.amount);
        }
        return acc;
      },
      {},
    );

    const categoryTransactionCounts = transactionsData.transactions.reduce(
      (acc: Record<string, number>, item) => {
        if (categories.includes(item.categoryId) && item.categoryId !== null) {
          acc[item.categoryId] = (acc[item.categoryId] ?? 0) + 1;
        }
        return acc;
      },
      {},
    );

    return {
      budgetData: budgetData.map((item) => ({
        ...item,
        sum: categorySums[item.categoryId!] ?? 0,
        transactionCount: categoryTransactionCounts[item.categoryId!] ?? 0,
      })),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get budget data");
  }
}
