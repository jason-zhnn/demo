type StarRatingProps = {
  rating: number | null;
  className?: string;
};

export function StarRating({ rating, className }: StarRatingProps) {
  const value = rating ?? 0;
  return (
    <span
      className={className ?? "text-sm text-amber-500"}
      aria-label={rating ? `${rating} out of 5 stars` : "Unrated"}
      title={rating ? `${rating} / 5` : "Unrated"}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "" : "text-neutral-300"}>
          {n <= value ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
