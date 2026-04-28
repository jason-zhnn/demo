import { setBookRating } from "@/app/books/actions";

type BookRatingControlProps = {
  bookId: number;
  rating: number | null;
};

export function BookRatingControl({ bookId, rating }: BookRatingControlProps) {
  const value = rating ?? 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <form key={n} action={setBookRating.bind(null, bookId, n)}>
              <button
                type="submit"
                aria-label={`Rate ${n} ${n === 1 ? "star" : "stars"}`}
                aria-pressed={filled}
                className={
                  "px-0.5 text-2xl leading-none transition " +
                  (filled ? "text-amber-500" : "text-neutral-300 hover:text-amber-400")
                }
              >
                {filled ? "★" : "☆"}
              </button>
            </form>
          );
        })}
      </div>
      {rating != null && (
        <form action={setBookRating.bind(null, bookId, null)}>
          <button
            type="submit"
            className="text-xs text-neutral-500 hover:underline"
          >
            Clear
          </button>
        </form>
      )}
    </div>
  );
}
