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

export async function returnBook(borrowingId: string) {
  let redirectPath = buildSuccessRedirect(
    "/history",
    "Livre rendu avec succès",
  );

  try {
    const user = await requireUser();

    const borrowing = await db.borrowing.findFirst({
      where: {
        id: borrowingId,
        userId: user.id,
        returnedAt: null,
      },
      select: {
        id: true,
        bookId: true,
      },
    });

    if (!borrowing) {
      redirectPath = buildErrorRedirect("/history", "Emprunt introuvable");
    } else {
      await db.$transaction([
        db.borrowing.update({
          where: { id: borrowing.id },
          data: {
            returnedAt: new Date(),
          },
        }),
        db.book.update({
          where: { id: borrowing.bookId },
          data: {
            available: true,
          },
        }),
      ]);

      revalidatePath("/profile");
      revalidatePath("/books");
      revalidatePath("/history");
    }
  } catch (error) {
    redirectPath = buildErrorRedirect(
      "/history",
      getErrorMessage(error, "Erreur serveur pendant le retour"),
    );
  }

  redirect(redirectPath);
}