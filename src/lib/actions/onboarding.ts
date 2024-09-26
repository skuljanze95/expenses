"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { balances } from "../db/schema/balance";

async function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");
  return userId;
}

export async function onboarding() {
  const userId = await handleAuth();

  try {
    const existingBalance = await db.query.balances.findFirst({
      where: eq(balances.userId, userId),
    });

    if (existingBalance) {
      return {
        data: null,
        error: { message: "User already onboarded" },
      };
    }

    await db.insert(balances).values({
      balance: "0.0",
      userId,
    });

    return {
      data: { message: "Onboarding completed successfully" },
      error: null,
    };
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      data: null,
      error: { message: "Failed to complete onboarding" },
    };
  }
}
