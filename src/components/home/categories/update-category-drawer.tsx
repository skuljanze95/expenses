"use client";

import { useEffect } from "react";
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
import { deleteCategory } from "@/lib/actions/categories/delete-category";
import { updateCategory } from "@/lib/actions/categories/update-category";
import {
  type CategoryType,
  transactionType,
} from "@/lib/db/schema/transaction";
import { cn } from "@/lib/utils";

export const transactionCategoryFormSchema = z.object({
  id: z.string().min(1, { message: "Required" }),
  name: z.string().min(1, { message: "Required" }),
  type: z.enum(transactionType),
});

type Props = {
  category: CategoryType;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
};

export function UpdateCategoryDrawer({ category, isOpen, setIsOpen }: Props) {
  const { isLoading, setIsLoading } = useHelpers();

  const form = useForm<z.infer<typeof transactionCategoryFormSchema>>({
    defaultValues: {
      id: "",
      name: "",
      type: undefined,
    },
    resolver: zodResolver(transactionCategoryFormSchema),
  });

  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        type: category.type,
      });
    }
  }, [category, form]);

  async function handleUpdateCategory(
    values: z.infer<typeof transactionCategoryFormSchema>,
  ) {
    setIsLoading(true);
    const { data, error } = await updateCategory(values);
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

  async function handleDeleteCategory() {
    const { data, error } = await deleteCategory(category.id);
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
      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-4">
          <DrawerHeader>
            <DrawerTitle className="-mt-5 text-center text-base font-normal">
              Update category
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(handleUpdateCategory)}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Theme" />
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
                className="rounded-full border-destructive text-destructive"
                disabled={isLoading}
                onClick={handleDeleteCategory}
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
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
