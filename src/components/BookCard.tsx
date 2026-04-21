import Link from "next/link";

type BookCardProps = {
  id: number;
  title: string;
  subtitle?: string | null;
  authorNames: string[];
  tagNames: string[];
  publishedYear?: number | null;
};

export function BookCard({ id, title, subtitle, authorNames, tagNames, publishedYear }: BookCardProps) {
  return (
    <Link
      href={`/books/${id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-medium">{title}</h2>
        {publishedYear && <span className="text-xs text-neutral-500">{publishedYear}</span>}
      </div>
      {subtitle && <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>}
      {authorNames.length > 0 && (
        <p className="mt-2 text-sm text-neutral-700">{authorNames.join(", ")}</p>
      )}
      {tagNames.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tagNames.map((tag) => (
            <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
