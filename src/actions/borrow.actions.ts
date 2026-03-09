"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  buildErrorRedirect,
  buildSuccessRedirect,
  getErrorMessage,
} from "@/lib/action-result";

export async function borrowBook(bookId: string) {
  try {
    const user = await requireUser();

    const book = await db.book.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        available: true,
      },
    });

    if (!book) {
      redirect(buildErrorRedirect("/books", "Livre introuvable"));
    }

    if (!book.available) {
      redirect(buildErrorRedirect("/books", "Livre indisponible"));
    }

    const activeBorrowings = await db.borrowing.count({
      where: {
        userId: user.id,
        returnedAt: null,
      },
    });

    if (activeBorrowings >= 3) {
      redirect(buildErrorRedirect("/books", "Maximum de 3 emprunts atteint"));
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

    redirect(buildSuccessRedirect("/books", "Livre emprunté avec succès"));
  } catch (error) {
    redirect(
      buildErrorRedirect(
        "/books",
        getErrorMessage(error, "Erreur serveur pendant l'emprunt"),
      ),
    );
  }
}