import { supabase } from '@/lib/db';
import type { MealPlan } from '@/types/features';

export interface MealPlanFromDB {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    benefits: string[];
    created_at?: string;
    updated_at?: string;
}

export const mealPlanService = {
    async getAllMealPlans(): Promise<MealPlan[]> {
        try {
            console.log('Fetching meal plans from Supabase...');

            const { data, error } = await supabase
                .from('meal_plan')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Raw data from Supabase:', data);

            if (!data || data.length === 0) {
                console.warn('No meal plans found in database');
                return [];
            }

            // Transform data from DB to MealPlan type
            const transformedData = data.map((plan: MealPlanFromDB) => ({
                id: plan.id,
                name: plan.name,
                price: plan.price,
                image: plan.image,
                description: plan.description,
                benefits: Array.isArray(plan.benefits) ? plan.benefits : [],
                isPopular: plan.id === 2 // Set most popular for id = 2
            }));

            console.log('Transformed meal plans:', transformedData);
            return transformedData;
        } catch (error) {
            console.error('Failed to fetch meal plans:', error);
            throw error;
        }
    }
};