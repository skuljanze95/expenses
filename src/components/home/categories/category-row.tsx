"use client";

import { useHelpers } from "@/hooks/useHelpers";

import { type CategoryType } from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

import { UpdateCategoryDrawer } from "./update-category-drawer";

type Props = {
  category: CategoryType;
  isLast: boolean;
};
export function CategoryRow({ category, isLast }: Props) {
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
        <p>{category.name}</p>
        <p className="flex w-min text-nowrap rounded-full border px-3 py-1 text-xs">
          {category.type}
        </p>
      </div>
      <UpdateCategoryDrawer
        category={category}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
