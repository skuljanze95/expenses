import { Suspense } from "react";

import { AddBudgetDrawer } from "@/components/home/budget/add-budget-drawer";
import {
  BudgetCard,
  BudgetCardSkeleton,
} from "@/components/home/budget/budget-card";
import { Button } from "@/components/ui/button";
import { getBudgetData } from "@/lib/actions/budget/get-budget-data";
import { getCategories } from "@/lib/actions/categories/get-categories";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col justify-between gap-4">
        <div className="sticky top-14 z-10 flex w-full items-center justify-between bg-background p-2 px-4">
          <div>
            <p className="text-xl font-semibold">Budget</p>
            <p className="text-sm text-muted-foreground">
              Overview of your monthly budget cards
            </p>
          </div>
          <Suspense
            fallback={
              <Button className="rounded-full" variant="outline">
                Add
              </Button>
            }
          >
            <AddBudgetButton />
          </Suspense>
        </div>

        <Suspense fallback={<BudgetCardSkeletonGrid />}>
          <BudgetCards />
        </Suspense>
      </div>
    </main>
  );
}

async function AddBudgetButton() {
  const { categories } = await getCategories();
  return <AddBudgetDrawer categories={categories} />;
}

async function BudgetCards() {
  const { budgetData } = await getBudgetData();
  const { categories } = await getCategories();
  if (budgetData.length === 0) {
    return (
      <div className="m-4 flex flex-col items-center justify-center rounded-md border p-4 text-center text-muted-foreground">
        <p className="text-lg font-semibold">No budget found</p>
        <p className="text-sm">
          You can add a new budget using the button above.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-4 sm:grid-cols-2">
      {budgetData.map((budget) => (
        <BudgetCard
          budget={budget}
          categories={categories}
          category={budget.category}
          key={budget.id}
          sum={budget.sum}
          transactionCount={budget.transactionCount}
        />
      ))}
    </div>
  );
}
function BudgetCardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-4 sm:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <BudgetCardSkeleton key={index} />
      ))}
    </div>
  );
}
