import { Skeleton } from "@/components/ui/skeleton";
import {
  type CategoryType,
  type TransactionType,
} from "@/lib/db/schema/transaction";

import { TransactionRow } from "./transaction-row";

type TransactionWithCategory = TransactionType & {
  category: CategoryType | null;
};

type Props = {
  transactions: TransactionWithCategory[];
  categories: CategoryType[];
};

export async function TransactionsList({ categories, transactions }: Props) {
  const groupedTransactions = transactions.reduce<
    Record<string, typeof transactions>
  >((acc, transaction) => {
    const date = new Date(transaction.date ?? "").toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-DE", {
        day: "numeric",
        month: "long",
      });
    }
  };

  return (
    <div className="flex w-full flex-col">
      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <div key={date}>
          <h3 className="my-3 text-sm font-medium text-muted-foreground">
            {formatDate(date)}
          </h3>
          <div className="flex flex-col border-y">
            {transactions.map((transaction, index) => (
              <TransactionRow
                isLast={index === transactions.length - 1}
                key={transaction.id}
                transaction={transaction}
                transactionCategories={categories}
                transactionCategory={transaction.category}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TransactionsListSkeleton() {
  return (
    <div className="w-full">
      <div className="sticky top-14 z-10 mb-4 flex items-center justify-between bg-background py-2">
        <div className="sticky top-0">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
      <div>
        <Skeleton className="my-3 h-4 w-32" />
        <div className="flex flex-col border-y">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="flex flex-row items-center gap-4 border-b p-2 text-sm"
              key={index}
            >
              <Skeleton className="h-5 w-5" />
              <div className="flex w-64 flex-col">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="ml-auto h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="my-3 h-4 w-32" />
            <div className="flex flex-col border-y">
              {Array.from({ length: 3 }).map((_, subIndex) => (
                <div
                  className="flex flex-row items-center gap-4 border-b p-2 text-sm"
                  key={subIndex}
                >
                  <Skeleton className="h-5 w-5" />
                  <div className="flex w-64 flex-col">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-1 h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="ml-auto h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
