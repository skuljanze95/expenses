"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import { accountHistory } from "../../db/schema/account-history";
import { balances } from "../../db/schema/balance";
import { getSameDayLastMonth, percentageChange } from "../../utils";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getBalance() {
  const userId = handleAuth();

  const now = new Date();

  const sameDayLastMonth = getSameDayLastMonth(now);

  try {
    const data = await db.query.balances.findFirst({
      where: eq(balances.userId, userId),
    });

    const history = await db.query.accountHistory.findFirst({
      where: and(
        eq(accountHistory.userId, userId),
        eq(accountHistory.timestamp, sameDayLastMonth),
      ),
    });

    const percentage = percentageChange(
      Number(data?.balance ?? 0),
      Number(history?.balance ?? 0),
    ).toFixed(1);

    return {
      balace: {
        ...data,
        percentageChange: percentage,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get balance");
  }
}
