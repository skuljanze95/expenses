"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type categoryFormSchema } from "@/components/home/categories/add-category-drawer";

import { db } from "../../db";
import { categories } from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function updateCategory(
  formData: z.infer<typeof categoryFormSchema> & { id: string },
) {
  const userId = handleAuth();

  try {
    const existingCategory = await db.query.categories.findFirst({
      where: and(eq(categories.id, formData.id), eq(categories.userId, userId)),
    });

    if (!existingCategory) {
      throw new Error("Category not found or unauthorized");
    }
    await db
      .update(categories)
      .set({
        name: formData.name,
        type: formData.type,
      })
      .where(
        and(eq(categories.id, formData.id), eq(categories.userId, userId)),
      );

    revalidatePath("/categories");

    return {
      data: { message: "Category updated" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to update category" },
    };
  }
}
