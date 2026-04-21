type BookFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: {
    title: string;
    subtitle: string | null;
    isbn: string | null;
    pageCount: number | null;
    coverUrl: string | null;
    publishedYear: number | null;
    authorNames: string[];
  };
  submitLabel: string;
};

export function BookForm({ action, initial, submitLabel }: BookFormProps) {
  return (
    <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <label className="flex flex-col text-sm">
        <span className="text-neutral-600">Title</span>
        <input
          name="title"
          required
          defaultValue={initial?.title ?? ""}
          className="mt-1 rounded border border-neutral-300 px-2 py-1"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="text-neutral-600">Subtitle</span>
        <input
          name="subtitle"
          defaultValue={initial?.subtitle ?? ""}
          className="mt-1 rounded border border-neutral-300 px-2 py-1"
        />
      </label>

      <label className="flex flex-col text-sm">
        <span className="text-neutral-600">Authors (comma separated)</span>
        <input
          name="authors"
          defaultValue={initial?.authorNames.join(", ") ?? ""}
          className="mt-1 rounded border border-neutral-300 px-2 py-1"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col text-sm">
          <span className="text-neutral-600">Pages</span>
          <input
            name="pageCount"
            type="number"
            min={0}
            defaultValue={initial?.pageCount ?? ""}
            className="mt-1 rounded border border-neutral-300 px-2 py-1"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="text-neutral-600">Published year</span>
          <input
            name="publishedYear"
            type="number"
            defaultValue={initial?.publishedYear ?? ""}
            className="mt-1 rounded border border-neutral-300 px-2 py-1"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="text-neutral-600">ISBN</span>
          <input
            name="isbn"
            defaultValue={initial?.isbn ?? ""}
            className="mt-1 rounded border border-neutral-300 px-2 py-1"
          />
        </label>
      </div>

      <label className="flex flex-col text-sm">
        <span className="text-neutral-600">Cover URL</span>
        <input
          name="coverUrl"
          defaultValue={initial?.coverUrl ?? ""}
          className="mt-1 rounded border border-neutral-300 px-2 py-1"
        />
      </label>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
