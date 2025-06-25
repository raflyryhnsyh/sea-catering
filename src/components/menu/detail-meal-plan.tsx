import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CircleCheck } from "lucide-react";
import type { MealPlan } from "@/types/features";
import { useNavigate } from "react-router-dom";

interface MealPlanDetailModalProps {
    mealPlan: MealPlan | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MealPlanDetail({
    mealPlan,
    isOpen,
    onClose,
}: MealPlanDetailModalProps) {
    const navigate = useNavigate();
    if (!mealPlan) return null;

    const handleOrderNow = () => {
        // Navigate to subscription page with selected meal plan data
        navigate('/subscriptions', {
            state: {
                selectedMealPlan: mealPlan
            }
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="relative">
                    <DialogTitle className="text-2xl font-bold pr-8">
                        {mealPlan.name}
                    </DialogTitle>
                    {mealPlan.isPopular && (
                        <Badge className="absolute top-0 right-8 rounded-full px-3 py-1 uppercase text-xs">
                            Most Popular
                        </Badge>
                    )}
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image */}
                    {mealPlan.image && (
                        <div className="w-full">
                            <img
                                src={mealPlan.image}
                                alt={mealPlan.name}
                                className="w-full h-64 rounded-xl object-cover"
                            />
                        </div>
                    )}

                    {/* Price */}
                    <div className="text-center">
                        <p className="text-4xl font-bold text-primary">
                            Rp {mealPlan.price}
                            <span className="ml-2 text-2xl text-muted-foreground font-normal">
                                /meal
                            </span>
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {mealPlan.description}
                        </p>
                    </div>

                    <Separator />

                    {/* Benefits */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                        <ul className="space-y-3">
                            {mealPlan.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CircleCheck className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                                    <span className="text-sm leading-relaxed">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleOrderNow}
                        >
                            Order Now
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}