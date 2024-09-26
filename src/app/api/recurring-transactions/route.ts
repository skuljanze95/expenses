import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { transactionDrafts } from "@/lib/db/schema/transaction";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const currentMonthDay = new Date().getDate();

  const recurringTransactions = await db.query.recurringTransactions.findMany();

  for (const transaction of recurringTransactions) {
    if (transaction.day === currentMonthDay) {
      await db.insert(transactionDrafts).values({
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        date: new Date(),
        title: transaction.title,
        type: transaction.type,
        userId: transaction.userId,
      });
    }
  }

  return Response.json({ success: true });
}
