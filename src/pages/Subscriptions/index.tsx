import SubscriptionForm from "@/components/subscription/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Subscription() {

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {

    const checkAuthentication = () => {
      // Simulasi pengecekan autentikasi
      const token = localStorage.getItem('token'); // Ganti dengan logika autentikasi yang sesuai
      if (!token) {
        navigate('/login');
        return;
      }
      setIsAuthenticated(true);
    }

    checkAuthentication

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

  // Jika belum authenticated, tampilkan pesan atau redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access subscription plans.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-accent text-accent-foreground px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
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