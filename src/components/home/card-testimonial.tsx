import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types/features";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= rating;
      const isHalfFilled = star > rating && star - 0.5 <= rating;
      
      return (
        <div key={star} className="relative">
          <Star
            className={`w-4 h-4 ${
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
          {isHalfFilled && (
            <Star
              className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400"
              style={{
                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
              }}
            />
          )}
        </div>
      );
    })}
    <span className="ml-1 text-sm text-gray-500">({rating})</span>
  </div>
);

const TestimonialCard = ({ id, name, rating, comment, avatar }: Testimonial) => (
  <div
      key={id}
      className="min-w-96 max-w-sm bg-accent rounded-xl p-6 mx-4 my-10 "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : (
                <span className="text-xl font-medium">{name.charAt(0)}</span>
                )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{name}</p>
            <StarRating rating={rating} />
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link to="#" target="_blank">
          </Link>
        </Button>
      </div>
      <p className="mt-5 text-[17px]">{comment}</p>
    </div>
);

export default TestimonialCard;