import PageWithNavbar from '@/layouts/PageWithNavbar';
import CardMealPlan from '@/components/menu/card-meal-plan';


const mealPlans = [
  {
    name: "Diet Plan",
    price: 30000,
    image: "../public/DietPlan.jpg",
    description:
      "Balanced portions are low in calories, suitable for weight loss programs.",
    features: [
      { title: "400 Calories" },
      { title: "25 Protein" },
      { title: "50 Carbs" },
      { title: "10 Fat" },
    ],
  },
  {
    name: "Protein Plan",
    price: 40000,
    image: "../public/ProteinPlan.jpg",
    description:
      "High in protein to support muscle mass and recovery.",
    features: [
      { title: "500 Calories" },
      { title: "40 Protein" },
      { title: "45 Carbs" },
      { title: "15 Fat" },
    ],
    isPopular: true,
  },
  {
    name: "Royal Plan",
    price: 60000,
    image: "../public/RoyalPlan.jpg",
    description:
      "Premium combination with selected ingredients, larger portion.",
    features: [
      { title: "700 Calories" },
      { title: "35 Protein" },
      { title: "80 Carbs" },
      { title: "25 Fat" },
    ],
  },
];

export default function MenuPlan() {
  return (
    <PageWithNavbar>
     <div className="min-h-screen flex flex-col items-center justify-center gap-7 pt-18">
        <h1 className="text-5xl font-bold text-center tracking-tight">Meal Plan</h1>
        <div className="flex items-center">
          {mealPlans.map((plan) => (
                  <CardMealPlan
                    name={plan.name}
                    price={plan.price}
                    image={plan.image}
                    isPopular={plan.isPopular ?? false}
                    description={plan.description}
                    benefits={plan.features.map((feature) => feature.title)}
                  />
                ))}
        </div>
      </div>
    </PageWithNavbar>
  );
}