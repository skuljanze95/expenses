"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { useHelpers } from "@/hooks/useHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { deleteBudget } from "@/lib/actions/budget/delete-budget";
import { updateBudget } from "@/lib/actions/budget/update-budget";
import { type BudgetType } from "@/lib/db/schema/budget";
import { type CategoryType } from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

export const updateBudgetFormSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Required" })
    .gt(0, { message: "Required" }),
  categoryId: z.string().min(1, { message: "Required" }),
  id: z.string().min(1, { message: "Required" }),
});

type Props = {
  budget: BudgetType;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  categories: CategoryType[];
};

export function UpdateBudgetDrawer({
  budget,
  categories,
  isOpen,
  setIsOpen,
}: Props) {
  const {
    isLoading,
    isOpen: isOpenCategory,
    setIsLoading,
    setIsOpen: setIsOpenCategory,
  } = useHelpers();

  const form = useForm<z.infer<typeof updateBudgetFormSchema>>({
    resolver: zodResolver(updateBudgetFormSchema),
  });

  useEffect(() => {
    if (budget) {
      form.reset({
        amount: Number(budget.amount),
        categoryId: budget.categoryId ?? "",
        id: budget.id,
      });
    }
  }, [budget, form]);

  async function handleUpdateBudget(
    values: z.infer<typeof updateBudgetFormSchema>,
  ) {
    setIsLoading(true);

    const { data, error } = await updateBudget({
      amount: values.amount,
      categoryId: values.categoryId,
      id: values.id,
    });
    if (error) {
      console.error(error);
      setIsLoading(false);
      return toast.error("Something went wrong", {
        description: error.message,
      });
    }

    toast.success(data?.message);

    setIsLoading(false);
    setIsOpen(false);
    form.reset();
  }
  async function handleDeleteBudget() {
    setIsLoading(true);

    const { data, error } = await deleteBudget(budget.id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      return toast.error("Something went wrong", {
        description: error.message,
      });
    }

    toast.success(data?.message);
    setIsLoading(false);
  }

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerContent>
        <div className="mx-auto max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle className="-mt-5 text-center text-base font-normal">
              Update budget
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(handleUpdateBudget)}
            >
              <FormField
                render={({ field, formState: { errors } }) => (
                  <FormItem className="relative flex flex-col">
                    <FormControl>
                      <NumericFormat
                        className={cn(
                          "border-none pb-16 pt-10 text-center text-[3rem] shadow-none focus-visible:ring-0",
                          errors.amount && "text-destructive",
                        )}
                        onValueChange={(values: { floatValue?: number }) => {
                          field.onChange(values.floatValue);
                        }}
                        customInput={Input}
                        decimalScale={2}
                        decimalSeparator=","
                        disabled={isLoading}
                        inputMode="decimal"
                        suffix="€"
                        thousandSeparator="."
                        value={field.value}
                        fixedDecimalScale
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-0 place-self-center" />
                  </FormItem>
                )}
                control={form.control}
                name="amount"
              />

              <FormField
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover
                      onOpenChange={setIsOpenCategory}
                      open={isOpenCategory}
                      modal
                    >
                      <PopoverTrigger asChild>
                        <Button
                          className={cn(
                            "w-full justify-between px-3 text-base font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                          role="combobox"
                          variant="outline"
                        >
                          {field.value
                            ? categories.find(
                                (category) => category.id === field.value,
                              )?.name
                            : "Category"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="h-72 p-0">
                        <Command className="flex justify-between">
                          <div>
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No categories found</CommandEmpty>

                              <CommandGroup className="h-52 overflow-y-auto">
                                {categories.map((category) => (
                                  <CommandItem
                                    onSelect={() => {
                                      field.onChange(category.id);
                                      setIsOpenCategory(false);
                                    }}
                                    key={category.id}
                                    value={category.name}
                                  >
                                    {category.name}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        category.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </div>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="categoryId"
              />

              <div className="flex flex-col gap-2">
                <Button
                  className="rounded-full border-destructive text-destructive"
                  disabled={isLoading}
                  onClick={handleDeleteBudget}
                  type="button"
                  variant={"outline"}
                >
                  Delete
                </Button>
                <Button
                  className="flex gap-2 rounded-full"
                  disabled={isLoading || !form.formState.isDirty}
                  type="submit"
                >
                  {isLoading && <Spinner />}
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
