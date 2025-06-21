export interface MealPlan {
    name: string;
    price: number;
    image?: string;
    isPopular: boolean;
    description: string;
    benefits: string[];
}