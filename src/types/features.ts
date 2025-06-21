export interface MealPlan {
    name: string;
    image: string;
    price: number;
    description: string;
}

export interface SubscriptionPlan {
    name: string;
    price: number;
    isPopular: boolean;
    description: string;
    yearlyDiscount?: number;
    benefits: string[];
}