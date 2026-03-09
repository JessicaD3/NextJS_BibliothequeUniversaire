"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function returnBook(borrowingId: string) {
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
    redirect("/history?message=Emprunt introuvable&type=error");
  }

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

  redirect("/history?message=Livre rendu avec succès&type=success");
}