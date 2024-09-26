import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

import { type TransactionType } from "@/lib/db/schema/transaction";

export function TransactionTypeIcons({
  type,
}: {
  type: TransactionType["type"];
}) {
  switch (type) {
    case "income":
      return <ArrowUpRight className="text-emerald-500" />;
    case "expense":
      return <ArrowDownLeft className="text-red-500" />;
    case "investment":
      return <TrendingUp className="text-purple-600" />;
    case "saving":
      return <PiggyBank className="text-yellow-500" />;
  }
}
