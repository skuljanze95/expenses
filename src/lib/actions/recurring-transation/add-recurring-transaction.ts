"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type recurringTransactionFormSchema } from "@/components/home/recurring-transactions/add-recurring-transaction-drawer";

import { db } from "../../db";
import {
  type RecurringTransactionInsertType,
  recurringTransactions,
} from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function addRecurringTransaction(
  formData: z.infer<typeof recurringTransactionFormSchema>,
) {
  const userId = handleAuth();

  try {
    const monthDay = new Date(formData.date ?? new Date()).getDate();

    const newRecurringTransaction: RecurringTransactionInsertType = {
      amount: formData.amount.toString(),
      categoryId: formData.categoryId,
      day: monthDay,
      title: formData.title,
      type: formData.type,
      userId,
    };

    const data = await db
      .insert(recurringTransactions)
      .values(newRecurringTransaction)
      .returning({ id: recurringTransactions.id });

    if (!data[0]) {
      return {
        data: null,
        error: { message: "Failed to add recurring transaction" },
      };
    }

    revalidatePath("/home");

    return {
      data: data[0].id,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to add recurring transaction" },
    };
  }
}
