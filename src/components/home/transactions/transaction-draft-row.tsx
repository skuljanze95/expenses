"use client";
import { useState } from "react";

import { RefreshCw } from "lucide-react";

import {
  type CategoryType,
  type TransactionDraftType,
} from "@/lib/db/schema/transaction";
import { cn, formatCurrency } from "@/lib/utils";

import { ConfirmDraftTransactionDrawer } from "./confirm-draft-transaction-drawer";

type Props = {
  transaction: TransactionDraftType;
  category: CategoryType | null;
  isLast: boolean;
  categories: CategoryType[];
};

export function TransactionDraftRow({
  categories,
  category,
  isLast,
  transaction,
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
            {transactionTypeIcons({ type: transaction.type })}
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
      <p className="flex w-min text-nowrap rounded-full border px-3 py-1 text-xs">
        Draft
      </p>
      {category && (
        <p className="flex w-min text-nowrap rounded-full border px-3 py-1 text-xs">
          {category.name}
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
      <ConfirmDraftTransactionDrawer
        categories={categories}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        transaction={transaction}
      />
    </div>
  );
}

const transactionTypeIcons = ({
  type,
}: {
  type: TransactionDraftType["type"];
}) => {
  switch (type) {
    case "income":
      return <RefreshCw className="text-emerald-500" />;
    case "expense":
      return <RefreshCw className="text-red-500" />;
    case "investment":
      return <RefreshCw className="text-purple-600" />;
    case "saving":
      return <RefreshCw className="text-yellow-500" />;
  }
};
