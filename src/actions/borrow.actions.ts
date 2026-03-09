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
  let redirectPath = buildSuccessRedirect(
    "/books",
    "Livre emprunté avec succès",
  );

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
      redirectPath = buildErrorRedirect("/books", "Livre introuvable");
    } else if (!book.available) {
      redirectPath = buildErrorRedirect("/books", "Livre indisponible");
    } else {
      const activeBorrowings = await db.borrowing.count({
        where: {
          userId: user.id,
          returnedAt: null,
        },
      });

      if (activeBorrowings >= 3) {
        redirectPath = buildErrorRedirect(
          "/books",
          "Maximum de 3 emprunts atteint",
        );
      } else {
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
      }
    }
  } catch (error) {
    redirectPath = buildErrorRedirect(
      "/books",
      getErrorMessage(error, "Erreur serveur pendant l'emprunt"),
    );
  }

  redirect(redirectPath);
}