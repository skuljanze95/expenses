"use client";

import { useHelpers } from "@/hooks/useHelpers";

import {
  type CategoryType,
  type RecurringTransactionType,
} from "@/lib/db/schema/transaction";
import { cn, formatCurrency } from "@/lib/utils";

import { TransactionTypeIcons } from "../transactions/transaction-type-icons";
import { UpdateRecurringTransactionDrawer } from "./update-recurring-transaction-drawer";

type Props = {
  transaction: RecurringTransactionType;
  category: CategoryType | null;
  isLast: boolean;
  categories: CategoryType[];
};
export function RecurringTransactionRow({
  categories,
  category,
  isLast,
  transaction,
}: Props) {
  const { isOpen, setIsOpen } = useHelpers();
  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-between gap-4 border-t p-2 text-sm",
          isLast && "border-b",
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex w-64 flex-col justify-center">
          <div className="flex items-center gap-2 font-medium">
            <div className="flex h-5 w-5 items-center justify-center">
              <TransactionTypeIcons type={transaction.type} />
            </div>
            <div>
              <p>{transaction.title}</p>
              <p className="text-xs text-muted-foreground">
                On the {transaction.day}th day of the month
              </p>
            </div>
          </div>
        </div>

        {category && (
          <p className="flex w-min text-nowrap rounded-full border px-3 py-1 text-xs">
            {category?.name}
          </p>
        )}
        <div className="flex w-44 flex-1 justify-end text-right font-medium">
          <span> {transaction.type === "income" ? "+" : "-"}</span>
          <p
            className={cn(
              transaction.type === "income" ? "text-green-500" : "",
            )}
          >
            {formatCurrency(Number(transaction.amount))}
          </p>
        </div>
      </div>
      <UpdateRecurringTransactionDrawer
        categories={categories}
        isOpen={isOpen}
        recurringTransaction={transaction}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
