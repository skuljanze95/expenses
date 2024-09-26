import { Suspense } from "react";

import {
  CategoriesList,
  CategoriesListSkeleton,
} from "@/components/home/categories/category-list";
import { getCategories } from "@/lib/actions/categories/get-categories";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Suspense fallback={<CategoriesListSkeleton />}>
        <Categories />
      </Suspense>
    </main>
  );
}

async function Categories() {
  const { categories } = await getCategories();

  return <CategoriesList categories={categories} />;
}
