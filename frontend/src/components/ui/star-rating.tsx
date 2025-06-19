import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /**
   * Current selected rating (0–5)
   */
  value?: number;
  /**
   * Callback when the rating changes.
   */
  onChange?: (rating: number) => void;
  /**
   * Size of the icons (tailwind class e.g. `h-5 w-5`). Defaults to `h-6 w-6`.
   */
  iconClassName?: string;
  /** If true, the component is read-only (non-interactive) */
  readOnly?: boolean;
}

export function StarRating({
  value = 0,
  onChange,
  iconClassName = "h-6 w-6",
  readOnly = false,
}: StarRatingProps) {
  // Local hover state for nicer UX
  const [hover, setHover] = useState<number | null>(null);

  const effectiveRating = hover !== null ? hover : value;

  const handleSelect = (rating: number) => {
    if (readOnly) return;
    onChange?.(rating);
  };

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star`}
          disabled={readOnly}
          className={cn("focus:outline-none", readOnly && "cursor-default")}
          onClick={() => handleSelect(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
        >
          <Star
            className={cn(
              iconClassName,
              effectiveRating >= star ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
} 