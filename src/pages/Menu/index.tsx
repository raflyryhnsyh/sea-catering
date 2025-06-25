import CardMealPlan from '@/components/menu/card-meal-plan';
import type { MealPlan } from '@/types/features';
import { useEffect, useState } from 'react';
import { mealPlanService } from '@/services/meal-plan-service';

export default function MenuPlan() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        console.log('Starting to fetch meal plans...');
        setLoading(true);
        setError(null);

        const plans = await mealPlanService.getAllMealPlans();
        console.log('Received plans:', plans);

        setMealPlans(plans);
      } catch (err) {
        console.error('Error loading meal plans:', err);
        setError(`Failed to load meal plans: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading meal plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <p className="text-muted-foreground text-center">No meal plans available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Meal Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect meal plan that fits your lifestyle and dietary goals
          </p>
        </div>

        {/* Grid Layout with special styling for popular card */}
        <div className="mt-12 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-8 lg:gap-0">
          {mealPlans.map((plan) => (
            <CardMealPlan
              key={plan.id || plan.name}
              id={plan.id}
              name={plan.name}
              price={plan.price}
              image={plan.image}
              isPopular={plan.isPopular ?? false}
              description={plan.description}
              benefits={plan.benefits}
            />
          ))}
        </div>
      </div>
    </div>
  );
}