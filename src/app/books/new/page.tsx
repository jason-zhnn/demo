import { createBook } from "../actions";
import { BookForm } from "@/components/BookForm";

export default function NewBookPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Add a book</h1>
      <BookForm action={createBook} submitLabel="Create book" />
    </div>
  );
}
