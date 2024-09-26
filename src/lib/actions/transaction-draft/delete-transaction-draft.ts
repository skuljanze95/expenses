"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { transactionDrafts } from "@/lib/db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function deleteDraftTransaction(id: string) {
  const userId = handleAuth();

  try {
    const [transactionToDelete] = await db
      .select()
      .from(transactionDrafts)
      .where(eq(transactionDrafts.id, id))
      .limit(1);

    if (!transactionToDelete || transactionToDelete.userId !== userId) {
      throw new Error("Transaction not found or unauthorized");
    }

    await db.delete(transactionDrafts).where(eq(transactionDrafts.id, id));

    revalidatePath("/home");

    return {
      data: { message: "Draft transaction deleted" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to delete draft transaction" },
    };
  }
}
