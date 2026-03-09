"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function borrowBook(bookId: string) {
  const user = await requireUser();

  const book = await db.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new Error("Livre introuvable");
  }

  if (!book.available) {
    throw new Error("Livre indisponible");
  }

  const activeBorrowings = await db.borrowing.count({
    where: {
      userId: user.id,
      returnedAt: null,
    },
  });

  if (activeBorrowings >= 3) {
    throw new Error("Maximum 3 emprunts atteints");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await db.$transaction([
    db.borrowing.create({
      data: {
        userId: user.id,
        bookId,
        dueDate,
      },
    }),

    db.book.update({
      where: { id: bookId },
      data: { available: false },
    }),
  ]);

  revalidatePath("/books");
  revalidatePath("/profile");
}