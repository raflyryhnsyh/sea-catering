import SubscriptionForm from "@/components/subscription/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Subscription() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading subscription plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 pt-24">
      <div className="max-w-7xl mx-auto justify-center items-center flex flex-col">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-5xl font-bold text-center tracking-tight">Build Your Subscription Plan</h1>
          <p className="text-muted-foreground text-lg mb-12">
            Create a personalized meal plan that fits your lifestyle and taste preferences..
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <div className="bg-accent rounded-xl shadow-lg border p-8">
            <SubscriptionForm />
          </div>
        </div>

      </div>
    </div >
  );
}