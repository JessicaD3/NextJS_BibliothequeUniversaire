"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function borrowBook(bookId: string) {
  const user = await requireUser();

  const book = await db.book.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      available: true,
    },
  });

  if (!book) {
    redirect("/books?message=Livre introuvable&type=error");
  }

  if (!book.available) {
    redirect("/books?message=Livre indisponible&type=error");
  }

  const activeBorrowings = await db.borrowing.count({
    where: {
      userId: user.id,
      returnedAt: null,
    },
  });

  if (activeBorrowings >= 3) {
    redirect("/books?message=Maximum de 3 emprunts atteint&type=error");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  await db.$transaction([
    db.borrowing.create({
      data: {
        userId: user.id,
        bookId: book.id,
        dueDate,
      },
    }),
    db.book.update({
      where: { id: book.id },
      data: { available: false },
    }),
  ]);

  revalidatePath("/books");
  revalidatePath("/profile");
  revalidatePath(`/books/${book.id}`);
  revalidatePath("/history");

  redirect("/books?message=Livre emprunté avec succès&type=success");
}