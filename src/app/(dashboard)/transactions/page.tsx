import { Suspense } from "react";

import { AddTransactionDrawer } from "@/components/home/transactions/add-transaction-drawer";
import {
  TransactionsList,
  TransactionsListSkeleton,
} from "@/components/home/transactions/transactions-list";
import { getCategories } from "@/lib/actions/categories/get-categories";
import { getTransactions } from "@/lib/actions/transaction/get-transactions";

export default async function Home() {
  return (
    <main className="flex flex-col px-4">
      <Suspense fallback={<TransactionsListSkeleton />}>
        <Transactions />
      </Suspense>
    </main>
  );
}

async function Transactions() {
  const { transactions } = await getTransactions({ currentMonthOnly: false });
  const { categories } = await getCategories();

  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-14 z-10 flex items-center justify-between bg-background py-2">
        <div>
          <p className="text-xl font-semibold">Transactions</p>
          <p className="text-sm text-muted-foreground">
            You made {transactions.length} transactions
          </p>
        </div>
        <AddTransactionDrawer categories={categories} />
      </div>
      {transactions.length > 0 ? (
        <TransactionsList categories={categories} transactions={transactions} />
      ) : (
        <div className="m-4 flex flex-col items-center justify-center rounded-md border p-4 text-center text-muted-foreground">
          <p className="text-lg font-semibold">No transactions found</p>
          <p className="text-sm">
            You can add a new transaction using the button above.
          </p>
        </div>
      )}
    </div>
  );
}
