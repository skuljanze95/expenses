"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { budget } from "@/lib/db/schema/budget";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function deleteBudget(id: string) {
  const userId = handleAuth();

  try {
    const [transactionToDelete] = await db
      .select()
      .from(budget)
      .where(eq(budget.id, id))
      .limit(1);

    if (!transactionToDelete || transactionToDelete.userId !== userId) {
      throw new Error("Budget not found or unauthorized");
    }

    await db.delete(budget).where(eq(budget.id, id));

    revalidatePath("/budget");

    return {
      data: { message: "Budget deleted" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to delete budget" },
    };
  }
}
