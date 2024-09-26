import { Suspense } from "react";

import {
  RecurringTransactionsList,
  RecurringTransactionsSkeleton,
} from "@/components/home/recurring-transactions/recurring-transacition-list";
import { getCategories } from "@/lib/actions/categories/get-categories";
import { getRecurringTransactions } from "@/lib/actions/recurring-transation/get-recurring-transaction";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Suspense fallback={<RecurringTransactionsSkeleton />}>
        <RecurringTransactions />
      </Suspense>
    </main>
  );
}

async function RecurringTransactions() {
  const { data } = await getRecurringTransactions();
  const { categories } = await getCategories();

  return (
    <RecurringTransactionsList
      categories={categories}
      recurringTransactions={data}
    />
  );
}
