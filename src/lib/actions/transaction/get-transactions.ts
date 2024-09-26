"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte } from "drizzle-orm";

import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getTransactions({
  currentMonthOnly = false,
}: {
  currentMonthOnly: boolean;
}) {
  const userId = handleAuth();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const data = await db.query.transactions.findMany({
      orderBy: [desc(transactions.date)],
      where: and(
        eq(transactions.userId, userId),
        currentMonthOnly ? gte(transactions.date, startOfMonth) : undefined,
      ),
      with: { category: true },
    });

    return {
      transactions: data,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get transactions");
  }
}
