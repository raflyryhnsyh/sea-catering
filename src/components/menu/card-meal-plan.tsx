import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import type { MealPlan } from "@/types/features";
import { cn } from "@/lib/utils";
import { useState } from "react";
import MealPlanDetailModal from "./detail-meal-plan";

export default function CardMealPlan({
  id,
  name,
  price,
  image,
  description,
  benefits,
  isPopular = false
}: MealPlan) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const mealPlanData: MealPlan = {
    id,
    name,
    price,
    image,
    description,
    benefits,
    isPopular
  };

  return (
    <>
      <div
        className={cn("relative p-6 bg-background border px-8 rounded-lg", {
          // Reduced z-index untuk popular card agar tidak menutupi navbar
          "shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] py-14 z-10 px-10 lg:-mx-2 overflow-hidden":
            isPopular,
        })}
      >
        {isPopular && (
          <Badge className="absolute top-10 right-10 rotate-[45deg] rounded-none px-10 uppercase translate-x-1/2 -translate-y-1/2 z-20">
            Most Popular
          </Badge>
        )}

        {/* Image Section */}
        <div className="flex flex-col items-center mb-6">
          {image && (
            <img
              src={image}
              alt={name}
              className="w-full h-48 mb-4 rounded-2xl object-cover"
            />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium">{name}</h3>

        {/* Price */}
        <p className="mt-2 text-4xl font-bold">
          Rp {price?.toLocaleString()}
          <span className="ml-1.5 text-sm text-muted-foreground font-normal">
            /meal
          </span>
        </p>

        {/* Description */}
        <p className="mt-4 font-medium text-muted-foreground">
          {description}
        </p>

        {/* CTA Button */}
        <Button
          variant={isPopular ? "default" : "outline"}
          size="lg"
          className="w-full mt-6 rounded-full text-base"
          onClick={() => setIsDetailModalOpen(true)}
        >
          See More Details <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>

        <Separator className="my-8" />
      </div>

      <MealPlanDetailModal
        mealPlan={mealPlanData}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
}