import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import type { MealPlan } from "@/types/features";
import { cn } from "@/lib/utils";



export default function CardMealPlan({ 
  name, 
  price,
  image, 
  description, 
  benefits, 
  isPopular = false
}: MealPlan) {

  return (
    <div
      className={cn("relative p-6 bg-background border px-8 rounded-lg", {
        "shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] py-14 z-[1] px-10 overflow-hidden":
          isPopular,
      })}
    >
      {isPopular && (
        <Badge className="absolute top-4 right-4 rounded-full px-3 py-1 uppercase text-xs">
          Most Popular
        </Badge>
      )}
      
      <div className="flex flex-col items-center">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-128 h-48 mb-4 rounded-2xl object-cover"
          />
        )}
      </div>

      <div className="flex flex-row items-end justify-between">
        <h3 className="text-2xl font-medium">{name}</h3>
        <p className="mt-2 text-4xl font-bold">
          Rp {price}
          <span className="ml-1.5 text-2xl text-muted-foreground font-normal">
            /meal
          </span>
        </p>
      </div>
      
      <p className="mt-4 font-medium text-muted-foreground">
        {description}
      </p>
      
      <Button
        variant={isPopular ? "default" : "outline"}
        size="lg"
        className="w-full mt-6 rounded-full text-base"
      >
        See More Details <ArrowUpRight className="w-4 h-4 ml-2" />
      </Button>
      
      <Separator className="my-8" />
      
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <CircleCheck className="h-4 w-4 mt-1 text-green-600 flex-shrink-0" />
            <span className="text-sm">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}