"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { recurringTransactions } from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getRecurringTransactions() {
  const userId = handleAuth();

  try {
    const data = await db.query.recurringTransactions.findMany({
      where: eq(recurringTransactions.userId, userId),
      with: {
        category: true,
      },
    });

    return {
      data,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get transactions");
  }
}
