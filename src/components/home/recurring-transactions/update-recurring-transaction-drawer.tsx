"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { useHelpers } from "@/hooks/useHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addCategory } from "@/lib/actions/categories/add-category";
import { deleteRecurringTransaction } from "@/lib/actions/recurring-transation/delete-recurring-transaction";
import { updateRecurringTransaction } from "@/lib/actions/recurring-transation/update-recurring-transaction";
import {
  type CategoryType,
  type RecurringTransactionType,
  transactionType,
} from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

export const updateRecurringTransactionFormSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Required" })
    .gt(0, { message: "Required" }),
  categoryId: z.string().optional(),
  date: z.date().optional(),
  id: z.string(),
  title: z.string().trim().min(1, { message: "Required" }),
  type: z.enum(transactionType),
});

type Props = {
  categories: CategoryType[];
  recurringTransaction: RecurringTransactionType;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
};

export function UpdateRecurringTransactionDrawer({
  categories,
  isOpen,
  recurringTransaction,
  setIsOpen,
}: Props) {
  const [newCategory, setNewCategory] = useState("");

  const { isLoading, setIsLoading } = useHelpers();
  const { isOpen: isOpenCategory, setIsOpen: setIsOpenCategory } = useHelpers();

  const form = useForm<z.infer<typeof updateRecurringTransactionFormSchema>>({
    resolver: zodResolver(updateRecurringTransactionFormSchema),
  });

  useEffect(() => {
    if (recurringTransaction) {
      form.reset({
        amount: Number(recurringTransaction.amount),
        categoryId: recurringTransaction.categoryId ?? undefined,
        id: recurringTransaction.id,
        title: recurringTransaction.title,
        type: recurringTransaction.type,
      });
    }
  }, [recurringTransaction, form]);

  async function handleUpdateRecurringTransaciton(
    formData: z.infer<typeof updateRecurringTransactionFormSchema>,
  ) {
    setIsLoading(true);

    const { error } = await updateRecurringTransaction({
      ...formData,
      date: formData.date ?? undefined,
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
      return toast.error("Something went wrong", {
        description: error.message,
      });
    }

    toast.success("Recurring transaction updated");

    setIsLoading(false);
    setIsOpen(false);
    form.reset();
  }

  async function handleAddNewCategory(name: string) {
    const { data, error } = await addCategory({
      name,
      type: form.getValues("type"),
    });

    if (error) {
      console.error(error);
      return toast.error("Something went wrong", {
        description: error.message,
      });
    }

    toast.success(data?.message);
    setNewCategory("");
  }

  async function handleDeleteRecurringTransaction() {
    setIsLoading(true);
    const { error } = await deleteRecurringTransaction(recurringTransaction.id);

    if (error) {
      console.error(error);
      return toast.error("Something went wrong", {
        description: error.message,
      });
    }

    toast.success("Recurring transaction deleted");
    setIsLoading(false);
    setIsOpen(false);
  }

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerContent>
        <div className="mx-auto max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle className="-mt-5 text-center text-base font-normal">
              New Transaction
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(handleUpdateRecurringTransaciton)}
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
                  <FormItem className="flex w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full pl-3 text-left text-base font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            variant={"outline"}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto">
                        <Calendar
                          disabled={isLoading}
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="date"
              />

              <FormField
                render={({ field }) => (
                  <FormItem>
                    <Tabs
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("categoryId", undefined);
                      }}
                      defaultValue="expense"
                    >
                      <TabsList className="h-10 w-full">
                        {transactionType.map((type, index) => (
                          <TabsTrigger
                            className="w-full capitalize"
                            disabled={isLoading}
                            key={index}
                            value={type}
                          >
                            {type}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="type"
              />

              <FormField
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-col">
                    <Input
                      disabled={isLoading}
                      {...field}
                      className={cn(
                        errors.title &&
                          "border-destructive focus-visible:ring-destructive",
                        "text-base",
                      )}
                      placeholder="Description"
                    />

                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="title"
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
                            <CommandInput
                              onValueChange={setNewCategory}
                              placeholder="Search category..."
                              value={newCategory}
                            />
                            <CommandList>
                              <CommandEmpty>No categories found</CommandEmpty>

                              <CommandGroup className="h-52 overflow-y-auto">
                                {categories
                                  .filter(
                                    (category) =>
                                      category.type === form.getValues("type"),
                                  )
                                  .map((category) => (
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
                          <div className="border-t">
                            <Button
                              onClick={async (e) => {
                                e.preventDefault();
                                await handleAddNewCategory(newCategory);
                              }}
                              className="w-full justify-start font-normal"
                              disabled={!newCategory}
                              type="button"
                              variant="ghost"
                            >
                              Add &quot;{newCategory}&quot;
                            </Button>
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
                  onClick={handleDeleteRecurringTransaction}
                  type="button"
                  variant={"outline"}
                >
                  Delete
                </Button>
                <Button
                  className="flex gap-2 rounded-full"
                  disabled={isLoading}
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
