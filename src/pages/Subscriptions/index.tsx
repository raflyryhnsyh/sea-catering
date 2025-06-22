import PageWithNavbar from '@/layouts/PageWithNavbar';
import SubscriptionForm from "@/components/subscription/form";

export default function Subscription() {
  return (
    <PageWithNavbar>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-center tracking-tight">Build Your Subscription Plan</h1>
        <SubscriptionForm />
      </div>
    </PageWithNavbar>
  );
}