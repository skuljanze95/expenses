"use client";

import { useState } from "react";
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
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addCategory } from "@/lib/actions/categories/add-category";
import { addTransaction } from "@/lib/actions/transaction/add-transaction";
import {
  type CategoryType,
  transactionType,
} from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

export const transactionFormSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Required" })
    .gt(0, { message: "Required" }),
  categoryId: z.string().optional(),
  date: z.date().optional(),
  isRecurring: z.boolean().default(false),
  title: z.string().trim().min(1, { message: "Required" }),
  type: z.enum(transactionType),
});

type Props = {
  categories: CategoryType[];
};

export function AddTransactionDrawer({ categories }: Props) {
  const [newCategory, setNewCategory] = useState("");

  const { isLoading, isOpen, setIsLoading, setIsOpen } = useHelpers();
  const { isOpen: isOpenCategory, setIsOpen: setIsOpenCategory } = useHelpers();

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    defaultValues: {
      amount: 0,
      isRecurring: false,
      title: "",
      type: transactionType[0],
    },
    resolver: zodResolver(transactionFormSchema),
  });

  async function handleAddNewTransaciton(
    formData: z.infer<typeof transactionFormSchema>,
  ) {
    setIsLoading(true);

    const updatedDate = formData.date ? new Date(formData.date) : new Date();

    if (
      formData.date &&
      new Date(formData.date).toDateString() !== new Date().toDateString()
    ) {
      updatedDate.setHours(8, 0, 0, 0);
    } else {
      updatedDate.setHours(
        new Date().getHours(),
        new Date().getMinutes(),
        0,
        0,
      );
    }

    const { data, error } = await addTransaction({
      ...formData,
      date: updatedDate,
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

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerTrigger asChild>
        <Button className="rounded-full">Add</Button>
      </DrawerTrigger>
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
              onSubmit={form.handleSubmit(handleAddNewTransaciton)}
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

              <FormField
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Add as recurring
                      </FormLabel>
                      <FormDescription>
                        This transaction will be added again the following
                        months at the same day as today
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        disabled={isLoading}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
                control={form.control}
                name="isRecurring"
              />

              <Button
                className="flex gap-2 rounded-full"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <Spinner />}
                Add
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
