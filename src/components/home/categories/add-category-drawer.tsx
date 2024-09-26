"use client";

import { useForm } from "react-hook-form";

import { useHelpers } from "@/hooks/useHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { addCategory } from "@/lib/actions/categories/add-category";
import { transactionType } from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  type: z.enum(transactionType),
});

export function AddCategoryDrawer() {
  const { isLoading, isOpen, setIsLoading, setIsOpen } = useHelpers();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    defaultValues: {
      name: "",
      type: undefined,
    },
    resolver: zodResolver(categoryFormSchema),
  });

  async function handleAddNewBudget(
    values: z.infer<typeof categoryFormSchema>,
  ) {
    const { data, error } = await addCategory(values);
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

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerTrigger asChild>
        <Button className="rounded-full">Add</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle className="-mt-5 text-center text-base font-normal">
              New category
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(handleAddNewBudget)}
            >
              <FormField
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={cn(
                          errors.name &&
                            "border-destructive focus-visible:ring-destructive",
                          "text-base",
                        )}
                        placeholder="Category Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="name"
              />
              <FormField
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            errors.type &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionType.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="type"
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
