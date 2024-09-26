"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema/transaction";

import { updateBalance } from "../balance/update-balance";
import { deleteRecurringTransaction } from "../recurring-transation/delete-recurring-transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function deleteTransaction(id: string) {
  const userId = handleAuth();

  try {
    const [transactionToDelete] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);

    if (!transactionToDelete || transactionToDelete.userId !== userId) {
      throw new Error("Transaction not found or unauthorized");
    }

    await db.delete(transactions).where(eq(transactions.id, id));

    if (transactionToDelete.recurringTransactionId) {
      await deleteRecurringTransaction(
        transactionToDelete.recurringTransactionId,
      );
    }

    const reversedType =
      transactionToDelete.type === "income" ? "expense" : "income";

    await updateBalance(
      userId,
      reversedType,
      parseFloat(transactionToDelete.amount),
    );

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
