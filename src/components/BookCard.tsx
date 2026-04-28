import Link from "next/link";
import { StarRating } from "./StarRating";

type BookCardProps = {
  id: number;
  title: string;
  subtitle?: string | null;
  authorNames: string[];
  tagNames: string[];
  publishedYear?: number | null;
  coverUrl?: string | null;
  rating?: number | null;
};

export function BookCard({ id, title, subtitle, authorNames, tagNames, publishedYear, coverUrl, rating }: BookCardProps) {
  return (
    <Link
      href={`/books/${id}`}
      className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400"
    >
      <div className="aspect-[2/3] w-16 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wide text-neutral-400">
            No cover
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-medium">{title}</h2>
          {publishedYear && <span className="text-xs text-neutral-500">{publishedYear}</span>}
        </div>
        {subtitle && <p className="mt-1 text-sm text-neutral-600">{subtitle}</p>}
        {authorNames.length > 0 && (
          <p className="mt-2 text-sm text-neutral-700">{authorNames.join(", ")}</p>
        )}
        {rating != null && (
          <div className="mt-2">
            <StarRating rating={rating} />
          </div>
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
      </div>
    </Link>
  );
}
