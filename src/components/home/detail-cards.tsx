import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTransactionsTypeSums } from "@/lib/actions/transaction/get-transactions-type-sums";
import { cn, formatCurrency } from "@/lib/utils";

export async function DetailCards() {
  const { typeSums } = await getTransactionsTypeSums();

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {typeSums.map((item) => (
        <DetailsCard
          key={item.title}
          percentage={item.percentage}
          percentageOfIncome={item.percentageOfIncome}
          title={item.title}
          value={item.value}
        />
      ))}
    </div>
  );
}

function DetailsCard({
  percentage,
  percentageOfIncome,
  title,
  value,
}: {
  title: "income" | "expense" | "investment" | "saving";
  value: number;
  percentage: number;
  percentageOfIncome?: number;
}) {
  const getTitleColor = (title: string) => {
    switch (title) {
      case "income":
        return "text-emerald-500";
      case "expense":
        return "text-red-500";
      case "investment":
        return "text-purple-600";
      case "saving":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle
          className={cn(
            getTitleColor(title),
            "flex w-full justify-between text-sm font-normal capitalize",
          )}
        >
          {title}
          <span>{percentageOfIncome ? percentageOfIncome + "%" : null}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-0.5 text-xl font-medium">
          {formatCurrency(value)}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {percentage < 0 ? percentage : `+${percentage}`}% from last month
        </p>
      </CardContent>
    </Card>
  );
}

export function DetailCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card className="w-full p-4" key={index}>
          <CardHeader className="mb-1 flex flex-row items-center justify-between space-y-0 p-0">
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="p-0">
            <Skeleton className="mt-0.5 h-7 w-[120px]" />
            <Skeleton className="mt-2 h-4 w-[140px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
