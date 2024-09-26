"use server";

import { auth } from "@clerk/nextjs/server";
import { NeonDbError } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type budgetFormSchema } from "@/components/home/budget/add-budget-drawer";
import { db } from "@/lib/db";
import { type BudgetInsertType, budget } from "@/lib/db/schema/budget";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function addBudget(formData: z.infer<typeof budgetFormSchema>) {
  const userId = handleAuth();

  try {
    const newBudget: BudgetInsertType = {
      amount: formData.amount.toString(),
      categoryId: formData.categoryId,
      userId,
    };

    await db.insert(budget).values(newBudget);

    revalidatePath("/budget");

    return {
      data: { message: "Budget added successfully" },
      error: null,
    };
  } catch (error) {
    console.error(error instanceof NeonDbError ? error.cause : error);

    if (error instanceof NeonDbError) {
      return {
        data: null,
        error: {
          message:
            error.constraint === "user_category_unique"
              ? "Budget for this category already exists"
              : "Failed to add budget",
        },
      };
    }

    return {
      data: null,
      error: { message: "Failed to add budget" },
    };
  }
}
