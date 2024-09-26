"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

import { type categoryFormSchema } from "@/components/home/categories/add-category-drawer";

import { db } from "../../db";
import {
  type CategoryInsertType,
  categories,
} from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function addCategory(
  formData: z.infer<typeof categoryFormSchema>,
) {
  const userId = handleAuth();

  try {
    const newCategory: CategoryInsertType = {
      ...formData,
      userId,
    };

    await db.insert(categories).values(newCategory);

    revalidatePath("/home");

    return {
      data: { message: "Category added" },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: { message: "Failed to add category" },
    };
  }
}
