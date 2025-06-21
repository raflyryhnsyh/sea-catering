import PageWithNavbar from '@/layouts/PageWithNavbar';
import CardMealPlan from '@/components/menu/card-meal-plan';


const mealPlans = [
  {
    name: "Breakfast Plan",
    price: 20,
    description:
      "Get 20 AI-generated portraits with 2 unique styles and filters.",
    features: [
      { title: "5 hours turnaround time" },
      { title: "20 AI portraits" },
      { title: "Choice of 2 styles" },
      { title: "Choice of 2 filters" },
      { title: "2 retouch credits" },
    ],
  },
  {
    name: "Lunch Plan",
    price: 40,
    description:
      "Get 50 AI-generated portraits with 5 unique styles and filters.",
    features: [
      { title: "3 hours turnaround time" },
      { title: "50 AI portraits" },
      { title: "Choice of 5 styles" },
      { title: "Choice of 5 filters" },
      { title: "5 retouch credits" },
    ],
    isPopular: true,
  },
  {
    name: "Dinner Plan",
    price: 80,
    description:
      "Get 100 AI-generated portraits with 10 unique styles and filters.",
    features: [
      { title: "1-hour turnaround time" },
      { title: "100 AI portraits" },
      { title: "Choice of 10 styles" },
      { title: "Choice of 10 filters" },
      { title: "10 retouch credits" },
    ],
  },
];

// const mealPlans = [
//   {
//     name: 'Breakfast Plan',
//     image: "../public/vite.svg",
//     price: 150000,
//     description: "..."
//   },
//   {
//     name: 'Lunch Plan',
//     image: "../public/vite.svg",
//     price: 150000,
//     description: "..."
//   },
//   {
//     name: 'Dinner Plan',
//     image: "../public/vite.svg",
//     price: 150000,
//     description: "..."
//   }
// ]

export default function MenuPlan() {
  return (
    <PageWithNavbar>
     <div className="min-h-screen flex flex-col items-center justify-center gap-10">
        <h1 className="text-5xl font-bold text-center tracking-tight">Meal Plan</h1>
        <div className="flex items-center">
          {mealPlans.map((plan) => (
                  <CardMealPlan
                    name={plan.name}
                    price={plan.price}
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