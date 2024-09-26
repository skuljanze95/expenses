"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type updateRecurringTransactionFormSchema } from "@/components/home/recurring-transactions/update-recurring-transaction-drawer";

import { db } from "../../db";
import { recurringTransactions } from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function updateRecurringTransaction(
  formData: z.infer<typeof updateRecurringTransactionFormSchema>,
) {
  const userId = handleAuth();

  try {
    const existingTransaction = await db.query.recurringTransactions.findFirst({
      where: and(
        eq(recurringTransactions.id, formData.id),
        eq(recurringTransactions.userId, userId),
      ),
    });

    if (!existingTransaction) {
      throw new Error("Recurring transaction not found or unauthorized");
    }

    const day = formData.date
      ? new Date(formData.date).getDate()
      : existingTransaction.day;

    await db
      .update(recurringTransactions)
      .set({
        amount: formData.amount.toString(),
        categoryId: formData.categoryId,
        day: day,
        id: existingTransaction.id,
        title: formData.title,
        type: formData.type,
        userId,
      })
      .where(eq(recurringTransactions.id, existingTransaction.id));

    revalidatePath("/home");

    return {
      data: { message: "Recurring transaction updated successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update recurring transaction" },
    };
  }
}
