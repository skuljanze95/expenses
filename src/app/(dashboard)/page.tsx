import { Suspense } from "react";

import Link from "next/link";

import { Balance, BalanceSkeleton } from "@/components/home/balance";
import { AddTransactionDrawer } from "@/components/home/transactions/add-transaction-drawer";
import { TransactionDraftRow } from "@/components/home/transactions/transaction-draft-row";
import {
  TransactionsList,
  TransactionsListSkeleton,
} from "@/components/home/transactions/transactions-list";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/actions/categories/get-categories";
import { getTransactions } from "@/lib/actions/transaction/get-transactions";
import { getTransactionsDrafts } from "@/lib/actions/transaction-draft/get-transactions-drafts";

import {
  DetailCards,
  DetailCardsSkeleton,
} from "../../components/home/detail-cards";

export default async function Home() {
  return (
    <main className="flex flex-col p-4">
      <div className="relative flex flex-col justify-between gap-8">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-row items-center justify-center gap-2">
            <Suspense fallback={<BalanceSkeleton />}>
              <Balance />
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<DetailCardsSkeleton />}>
          <DetailCards />
        </Suspense>

        <Suspense fallback={<TransactionsListSkeleton />}>
          <Transactions />
        </Suspense>
      </div>
    </main>
  );
}

async function Transactions() {
  const { transactions } = await getTransactions({ currentMonthOnly: true });
  const { categories } = await getCategories();
  const { transactionsDrafts } = await getTransactionsDrafts();

  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-14 z-10 flex items-center justify-between bg-background py-2">
        <div>
          <p className="text-xl font-semibold">Transactions</p>
          <p className="text-sm text-muted-foreground">
            You made {transactions.length} transactions this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/transactions">
            <Button className="rounded-full" variant="outline">
              View all
            </Button>
          </Link>

          <AddTransactionDrawer categories={categories} />
        </div>
      </div>
      {transactionsDrafts.length > 0 && (
        <div>
          <h3 className="my-3 text-sm font-medium text-muted-foreground">
            Transaction drafts
          </h3>
          <div className="flex flex-col border-y">
            {transactionsDrafts?.map((transaction, index) => (
              <TransactionDraftRow
                categories={categories}
                category={transaction.category}
                isLast={index === transactionsDrafts.length - 1}
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        </div>
      )}

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
