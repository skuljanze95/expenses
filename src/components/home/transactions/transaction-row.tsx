"use client";
import { useState } from "react";

import {
  type CategoryType,
  type TransactionType,
} from "@/lib/db/schema/transaction";
import { cn, formatCurrency } from "@/lib/utils";

import { TransactionTypeIcons } from "./transaction-type-icons";
import { UpdateTransactionDrawer } from "./update-transaction-drawer";

type Props = {
  transaction: TransactionType;
  transactionCategory: CategoryType | null;
  isLast: boolean;
  transactionCategories: CategoryType[];
};

export function TransactionRow({
  isLast,
  transaction,
  transactionCategories,
  transactionCategory,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-row items-center gap-4 p-2 text-sm",
        !isLast && "border-b",
      )}
      onClick={() => setIsOpen(true)}
    >
      <div className="flex w-64 flex-col justify-center">
        <div className="flex items-center gap-2 font-medium">
          <div className="flex h-5 w-5 items-center justify-center">
            <TransactionTypeIcons type={transaction.type} />
          </div>
          <div>
            <div>{transaction.title}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(transaction.date ?? "").toLocaleTimeString([], {
                hour: "2-digit",
                hour12: false,
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {transactionCategory && (
        <p className="flex w-min text-nowrap rounded-full border px-3 py-1 text-xs">
          {transactionCategory.name}
        </p>
      )}

      <div className="flex w-44 flex-1 justify-end text-right font-medium">
        <span> {transaction.type === "income" ? "+" : "-"}</span>
        <p
          className={cn(transaction.type === "income" ? "text-green-500" : "")}
        >
          {formatCurrency(Number(transaction.amount))}
        </p>
      </div>
      <UpdateTransactionDrawer
        categories={transactionCategories}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        transaction={transaction}
      />
    </div>
  );
}
