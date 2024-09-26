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
import { addTransaction } from "@/lib/actions/transaction/add-transaction";
import { deleteDraftTransaction } from "@/lib/actions/transaction-draft/delete-transaction-draft";
import {
  type CategoryType,
  type TransactionDraftType,
  transactionType,
} from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

export const confirmDraftTransactionSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Required" })
    .gt(0, { message: "Required" }),
  categoryId: z.string().optional(),
  date: z.date().optional(),
  id: z.string(),
  isRecurring: z.boolean().default(false),
  recurringTransactionId: z.string().nullable(),
  title: z.string().trim().min(1, { message: "Required" }),
  type: z.enum(transactionType),
});

type Props = {
  categories: CategoryType[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transaction: TransactionDraftType;
};

export function ConfirmDraftTransactionDrawer({
  categories,
  isOpen,
  setIsOpen,
  transaction,
}: Props) {
  const [newCategory, setNewCategory] = useState("");

  const {
    isLoading,
    isOpen: openCategory,
    setIsLoading,
    setIsOpen: setOpenCategory,
  } = useHelpers();

  const form = useForm<z.infer<typeof confirmDraftTransactionSchema>>({
    resolver: zodResolver(confirmDraftTransactionSchema),
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        amount: Number(transaction.amount),
        categoryId: transaction.categoryId ?? undefined,
        date: transaction.date ?? new Date(),
        id: transaction.id,
        recurringTransactionId: transaction.id ?? null,
        title: transaction.title,
        type: transaction.type,
      });
    }
  }, [transaction, form]);

  async function handleConfirmDraftTransaction(
    formData: z.infer<typeof confirmDraftTransactionSchema>,
  ) {
    setIsLoading(true);

    const updatedDate = formData.date ? new Date(formData.date) : new Date();
    updatedDate.setHours(8, 0, 0, 0);

    const updatedFormData = {
      ...formData,
      date: updatedDate,
    };

    const { data, error } = await addTransaction(updatedFormData);

    if (error) {
      console.error(error);
      return toast.error("Something went wrong", {
        description: error.message,
      });
    }

    await handleDeleteDraftTransaction();

    toast.success(data?.message);

    setIsLoading(false);
    setIsOpen(false);
    form.reset();
  }

  async function handleDeleteDraftTransaction() {
    setIsLoading(true);

    const { data, error } = await deleteDraftTransaction(transaction.id);

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
              Confirm Transaction
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(handleConfirmDraftTransaction)}
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
                      defaultValue={field.value}
                      onValueChange={field.onChange}
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
                      onOpenChange={setOpenCategory}
                      open={openCategory}
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
                              disabled
                            />
                            <CommandList>
                              <CommandEmpty>No categories found</CommandEmpty>

                              <CommandGroup className="h-52 overflow-y-auto">
                                {categories.map((category) => (
                                  <CommandItem
                                    onSelect={() => {
                                      field.onChange(category.id);
                                      setOpenCategory(false);
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
                  onClick={handleDeleteDraftTransaction}
                  type="button"
                  variant={"outline"}
                >
                  Delete draft
                </Button>
                <Button
                  className="flex gap-2 rounded-full"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading && <Spinner />}
                  Add
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
