import AddTestimonial from '@/components/home/add-testimonials';
import KeyFeatures from '@/components/home/key-features';
import Overview from '@/components/home/overview';
import Testimonials from '@/components/home/testimonials';
import { Edit, MonitorCheck, Truck } from "lucide-react";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import type { Testimonial } from '@/types/features';
import { useAuth } from '@/hooks/AuthContext';

const allFeatures = [
  {
    icon: Edit,
    title: "Customizable Meals",
    description:
      "Tailor your meals to fit your specific dietary requirements, preferences, and health goals. Choose from a variety of ingredients and meal plans.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "We deliver our healthy meals to major cities throughout Indonesia, ensuring you have access to nutritious food wherever you are.",
  },
  {
    icon: MonitorCheck,
    title: "Nutritional Transparency",
    description:
      "Access detailed nutritional information for each meal, including calorie count, macronutrient breakdown, and allergen information.",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetchingTestimonials, setFetchingTestimonials] = useState(false);

  const fetchTestimonials = async () => {
    setFetchingTestimonials(true);
    try {
      const { data, error } = await supabase
        .from('testimonial')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data - ambil user_name dan user_avatar dari database
      const transformedData: Testimonial[] = (data || []).map((item: any) => {
        const isCurrentUser = user && item.user_id === user.id;

        let name = 'Anonymous User';
        let avatar = null;

        if (item.user_name) {
          // Jika ada user_name di database, gunakan itu
          name = item.user_name;
        } else if (isCurrentUser && user) {
          // Fallback untuk current user
          name = user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'You';
        } else {
          // Fallback untuk user lain
          name = `User ${item.user_id?.slice(-4) || 'Unknown'}`;
        }

        // Ambil avatar dari database atau user metadata
        avatar = item.user_avatar ||
          (isCurrentUser && user ? (user.user_metadata?.avatar_url || user.user_metadata?.picture) : null);

        return {
          id: item.id,
          name,
          rating: item.rating,
          comment: item.comment,
          avatar,
          user_id: item.user_id,
          created_at: item.created_at
        };
      });

      setTestimonials(transformedData);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setFetchingTestimonials(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await fetchTestimonials();

      // Add minimum loading time for UX
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    };

    initializePage();
  }, [user]);

  const handleTestimonialAdded = async () => {
    await fetchTestimonials();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading home...</p>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Overview />
      <KeyFeatures features={allFeatures} />
      <Testimonials
        testimonials={testimonials}
      />
      <div className="flex justify-center py-8">
        <AddTestimonial onTestimonialAdded={handleTestimonialAdded} />
      </div>
    </div>
  );
}