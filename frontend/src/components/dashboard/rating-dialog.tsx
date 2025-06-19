import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";

interface RatingDialogProps {
  /**
   * Identifier for the entity being rated (session, user, etc.)
   */
  targetId?: string;
  /** Text to show on the trigger button */
  triggerLabel?: string;
  /** Callback when the rating is submitted */
  onSubmit?: (rating: number, review: string) => void;
}

export function RatingDialog({
  targetId,
  triggerLabel = "Rate & Review",
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit?.(rating, review);
    setOpen(false);
    // reset form
    setRating(0);
    setReview("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
          <DialogDescription>
            Your review helps improve the quality of sessions within the community.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <StarRating value={rating} onChange={setRating} iconClassName="h-8 w-8" />
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 