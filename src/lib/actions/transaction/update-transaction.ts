"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type updateTransactionFormSchema } from "@/components/home/transactions/update-transaction-drawer";
import { db } from "@/lib/db";
import {
  type TransactionType,
  transactions,
} from "@/lib/db/schema/transaction";

import { updateBalance } from "../balance/update-balance";
import { addRecurringTransaction } from "../recurring-transation/add-recurring-transaction";
import { deleteRecurringTransaction } from "../recurring-transation/delete-recurring-transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function updateTransaction(
  formData: z.infer<typeof updateTransactionFormSchema>,
) {
  const userId = handleAuth();

  try {
    const existingTransaction = await db.query.transactions.findFirst({
      where: and(
        eq(transactions.id, formData.id),
        eq(transactions.userId, userId),
      ),
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    const wasRecurring = !!existingTransaction.recurringTransactionId;
    const isNowRecurring = formData.isRecurring;

    if (wasRecurring && !isNowRecurring) {
      await deleteRecurringTransaction(
        existingTransaction.recurringTransactionId!,
      );
      formData.recurringTransactionId = null;
    } else if (!wasRecurring && isNowRecurring) {
      const { data: recurringTransactionId, error: recurringError } =
        await addRecurringTransaction({
          ...formData,
        });
      if (recurringError) {
        throw new Error("Failed to add recurring transaction");
      }
      formData.recurringTransactionId = recurringTransactionId;
    }

    await db
      .update(transactions)
      .set({
        amount: formData.amount.toString(),
        categoryId: formData.categoryId,
        date: formData.date,
        recurringTransactionId: formData.recurringTransactionId,
        title: formData.title,
        type: formData.type,
      })
      .where(
        and(eq(transactions.id, formData.id), eq(transactions.userId, userId)),
      );

    const { error } = await handleBalanceUpdate(
      userId,
      existingTransaction.type,
      formData.type,
      Number(existingTransaction.amount),
      formData.amount,
    );

    if (error) {
      await db
        .update(transactions)
        .set(existingTransaction)
        .where(
          and(
            eq(transactions.id, formData.id),
            eq(transactions.userId, userId),
          ),
        );

      return {
        data: null,
        error: { message: "Failed to update transaction" },
      };
    }

    revalidatePath("/home");

    return {
      data: { message: "Transaction updated successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update transaction" },
    };
  }
}

async function handleBalanceUpdate(
  userId: string,
  oldType: TransactionType["type"],
  newType: TransactionType["type"],
  oldAmount: number,
  newAmount: number,
): Promise<{ error: boolean | null }> {
  if (oldType === "income") {
    const { error } = await updateBalance(userId, "expense", oldAmount);
    if (error) return { error: true };
  } else {
    const { error } = await updateBalance(userId, "income", oldAmount);
    if (error) return { error: true };
  }

  const { error } = await updateBalance(userId, newType, newAmount);
  if (error) return { error: true };

  return { error: null };
}
