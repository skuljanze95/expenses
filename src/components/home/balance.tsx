import { getBalance } from "@/lib/actions/balance/get-balance";
import { formatCurrency } from "@/lib/utils";

import { Skeleton } from "../ui/skeleton";

export async function Balance() {
  const { balace } = await getBalance();

  return (
    <div className="flex h-auto min-h-[3.5rem] flex-col gap-1 text-center sm:h-14">
      <p className="text-sm font-medium">Balance</p>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
        <p className="text-2xl font-medium sm:text-2xl">
          {formatCurrency(Number(balace?.balance))}
        </p>
        <span className="text-slate-30 text-xs font-normal text-muted-foreground">
          {balace.percentageChange}% from last month
        </span>
      </div>
    </div>
  );
}

export async function BalanceSkeleton() {
  return (
    <div className="flex h-auto min-h-[3.5rem] flex-col gap-1 text-center sm:h-14">
      <p className="text-sm font-medium">Balance</p>
      <div className="flex flex-col items-center justify-center gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
