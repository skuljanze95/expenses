"use server";

import { auth } from "@clerk/nextjs/server";
import { NeonDbError } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type updateBudgetFormSchema } from "@/components/home/budget/update-budget-drawer";
import { db } from "@/lib/db";
import { type BudgetInsertType, budget } from "@/lib/db/schema/budget";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function updateBudget(
  formData: z.infer<typeof updateBudgetFormSchema>,
) {
  const userId = handleAuth();

  try {
    const updatedBudget: BudgetInsertType = {
      amount: formData.amount.toString(),
      categoryId: formData.categoryId,
      userId,
    };

    await db
      .update(budget)
      .set(updatedBudget)
      .where(
        and(
          eq(budget.categoryId, formData.categoryId),
          eq(budget.userId, userId),
        ),
      );

    revalidatePath("/budget");

    return {
      data: { message: "Budget updated successfully" },
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
              : "Failed to update budget",
        },
      };
    }

    return {
      data: null,
      error: { message: "Failed to update budget" },
    };
  }
}
