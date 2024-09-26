"use server";

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { transactionDrafts } from "@/lib/db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getTransactionsDrafts() {
  const userId = handleAuth();

  try {
    const data = await db.query.transactionDrafts.findMany({
      orderBy: [desc(transactionDrafts.date)],
      where: eq(transactionDrafts.userId, userId),
      with: { category: true },
    });

    return {
      transactionsDrafts: data,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get transactions drafts");
  }
}
