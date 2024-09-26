"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { categories } from "../../db/schema/transaction";

function handleAuth() {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  return userId;
}

export async function getCategories() {
  const userId = handleAuth();

  try {
    const data = await db.query.categories.findMany({
      where: eq(categories.userId, userId),
    });

    return {
      categories: data,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get categories");
  }
}
