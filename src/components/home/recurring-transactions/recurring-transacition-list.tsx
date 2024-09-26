import { Skeleton } from "@/components/ui/skeleton";
import {
  type CategoryType,
  type RecurringTransactionType,
} from "@/lib/db/schema/transaction";

import { AddRecurringTransactionDrawer } from "./add-recurring-transaction-drawer";
import { RecurringTransactionRow } from "./transaction-row";

type RecurringTransactionWithCategory = RecurringTransactionType & {
  category: CategoryType | null;
};

type Props = {
  recurringTransactions: RecurringTransactionWithCategory[];
  categories: CategoryType[];
};

export function RecurringTransactionsList({
  categories,
  recurringTransactions,
}: Props) {
  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-14 z-10 flex items-center justify-between bg-background px-4 py-2">
        <div>
          <p className="text-xl font-semibold">Recurring Transactions </p>
          <p className="text-sm text-muted-foreground">
            You have {recurringTransactions.length} recurring{" "}
            {recurringTransactions.length === 1
              ? "transaction"
              : "transactions"}
          </p>
        </div>
        <AddRecurringTransactionDrawer categories={categories} />
      </div>
      {recurringTransactions.length > 0 ? (
        <div className="flex flex-col px-4">
          {recurringTransactions.map((transaction, index) => (
            <RecurringTransactionRow
              categories={categories}
              category={transaction.category}
              isLast={index === recurringTransactions.length - 1}
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      ) : (
        <div className="m-4 flex flex-col items-center justify-center rounded-md border p-4 text-center text-muted-foreground">
          <p className="text-lg font-semibold">
            No recurring transactions found
          </p>
          <p className="text-sm">
            You can add a new recurring transaction using the button above.
          </p>
        </div>
      )}
    </div>
  );
}

export function RecurringTransactionsSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-14 z-10 flex items-center justify-between bg-background px-4 py-2">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="flex flex-col px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="flex items-center justify-between border-t py-2"
            key={index}
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
