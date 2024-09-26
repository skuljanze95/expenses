"use server";

import { auth } from "@clerk/nextjs/server";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../../db";
import { categories } from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function deleteCategory(id: string) {
  const userId = handleAuth();

  try {
    const [categoryToDelete] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!categoryToDelete || categoryToDelete.userId !== userId) {
      throw new Error("Category not found or unauthorized");
    }

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/categories");

    return {
      data: { message: "Category deleted" },
      error: null,
    };
  } catch (error) {
    console.error(error instanceof NeonDbError);

    if (error instanceof NeonDbError) {
      const match = error.detail?.match(/from table "([^"]+)"/);
      const tableName = match ? match[1] : null;

      return {
        data: null,
        error: {
          message: tableName
            ? `Failed to delete category because it is being used in ${tableName}`
            : "Failed to delete category",
        },
      };
    }

    return {
      data: null,
      error: {
        message: "Failed to delete category",
      },
    };
  }
}
