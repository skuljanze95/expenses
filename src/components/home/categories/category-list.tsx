import { Skeleton } from "@/components/ui/skeleton";
import { type CategoryType } from "@/lib/db/schema/transaction";

import { AddCategoryDrawer } from "./add-category-drawer";
import { CategoryRow } from "./category-row";

type Props = {
  categories: CategoryType[];
};
export function CategoriesList({ categories }: Props) {
  return (
    <div className="flex w-full flex-col">
      <div className="sticky top-14 z-10 flex items-center justify-between bg-background px-4 py-2">
        <div>
          <p className="text-xl font-semibold">Categories</p>
          <p className="text-sm text-muted-foreground">
            You have {categories.length} categories
          </p>
        </div>
        <AddCategoryDrawer />
      </div>
      {categories.length > 0 ? (
        <div className="flex flex-col px-4">
          {categories.map((category, index) => (
            <CategoryRow
              category={category}
              isLast={index === categories.length - 1}
              key={category.id}
            />
          ))}
        </div>
      ) : (
        <div className="m-4 flex flex-col items-center justify-center rounded-md border p-4 text-center text-muted-foreground">
          <p className="text-lg font-semibold">No categories found</p>
          <p className="text-sm">
            You can add a new category using the button above.
          </p>
        </div>
      )}
    </div>
  );
}

export function CategoriesListSkeleton() {
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
