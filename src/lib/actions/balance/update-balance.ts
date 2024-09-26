import { eq } from "drizzle-orm";

import { db } from "../../db";
import { balances } from "../../db/schema/balance";
import { type TransactionType } from "../../db/schema/transaction";

export async function updateBalance(
  userId: string,
  transactionType: TransactionType["type"],
  amount: number,
) {
  try {
    const currentBalance = await db.query.balances.findFirst({
      where: eq(balances.userId, userId),
    });

    if (!currentBalance) {
      throw new Error("Balance not found for user");
    }

    let newBalance = Number(currentBalance.balance);

    switch (transactionType) {
      case "income":
        newBalance += amount;
        break;
      case "expense":
        newBalance -= amount;
        break;
      case "investment":
      case "saving":
        newBalance -= amount;
        break;
    }

    await db
      .update(balances)
      .set({ balance: newBalance.toFixed(2).toString() })
      .where(eq(balances.userId, userId));

    return {
      data: { message: "Balance updated" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update balance" },
    };
  }
}
