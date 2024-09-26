"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../../db";
import { recurringTransactions } from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function deleteRecurringTransaction(id: string) {
  const userId = handleAuth();

  try {
    const [transactionToDelete] = await db
      .select()
      .from(recurringTransactions)
      .where(eq(recurringTransactions.id, id))
      .limit(1);

    if (!transactionToDelete || transactionToDelete.userId !== userId) {
      throw new Error("Transaction not found or unauthorized");
    }

    await db
      .delete(recurringTransactions)
      .where(eq(recurringTransactions.id, id));

    revalidatePath("/home");

    return {
      data: { message: "Transaction deleted" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to delete transaction" },
    };
  }
}
