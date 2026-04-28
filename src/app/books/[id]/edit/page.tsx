import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import { BookForm } from "@/components/BookForm";
import { updateBook } from "../../actions";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = Number(id);
  if (!Number.isFinite(bookId)) notFound();

  const book = await getBook(bookId);
  if (!book) notFound();

  const boundUpdate = updateBook.bind(null, bookId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit book</h1>
      <BookForm
        action={boundUpdate}
        submitLabel="Save changes"
        initial={{
          title: book.title,
          subtitle: book.subtitle,
          isbn: book.isbn,
          pageCount: book.pageCount,
          coverUrl: book.coverUrl,
          publishedYear: book.publishedYear,
          rating: book.rating,
          authorNames: book.authors.map((a) => a.author.name),
        }}
      />
    </div>
  );
}
