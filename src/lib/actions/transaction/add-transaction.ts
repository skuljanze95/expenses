"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type transactionFormSchema } from "@/components/home/transactions/add-transaction-drawer";
import { db } from "@/lib/db";
import {
  type TransactionInsertType,
  transactions,
} from "@/lib/db/schema/transaction";

import { updateBalance } from "../balance/update-balance";
import { addRecurringTransaction } from "../recurring-transation/add-recurring-transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function addTransaction(
  formData: z.infer<typeof transactionFormSchema>,
) {
  const userId = handleAuth();

  let recurringTransactionId: string | null = null;

  try {
    if (formData.isRecurring) {
      const { data, error } = await addRecurringTransaction(formData);
      if (error) {
        console.error(error);
        return {
          data: null,
          error: { message: "Failed to add recurring transaction" },
        };
      }
      recurringTransactionId = data;
    }

    const newTransaction: TransactionInsertType = {
      amount: formData.amount.toString(),
      categoryId: formData.categoryId,
      date: formData.date ?? new Date(),
      recurringTransactionId,
      title: formData.title,
      type: formData.type,
      userId,
    };

    const insertedTransaction = await db
      .insert(transactions)
      .values(newTransaction)
      .returning({ id: transactions.id });

    if (!insertedTransaction[0]) {
      return {
        data: null,
        error: { message: "Failed to add transaction" },
      };
    }

    const { error } = await updateBalance(
      userId,
      formData.type,
      formData.amount,
    );

    if (error) {
      await db
        .delete(transactions)
        .where(eq(transactions.id, insertedTransaction[0].id));

      console.error(error);
      return {
        data: null,
        error: { message: "Failed to add transaction" },
      };
    }

    revalidatePath("/home");

    return {
      data: { message: "Transaction added" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to add transaction" },
    };
  }
}
