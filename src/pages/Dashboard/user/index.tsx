import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Phone, Utensils } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { subscriptionService, type Subscription } from "@/services/subscription-service";

export default function DashboardUser() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const { data, error } = await subscriptionService.getUserSubscriptions();

        if (error) {
          console.error('Error fetching subscriptions:', error);
          return;
        }

        setSubscriptions(data);

        // Find active subscription
        const active = data.find(sub =>
          sub.status === 'ACTIVE' &&
          new Date(sub.end_date) > new Date()
        );
        setActiveSubscription(active || null);
      } catch (error) {
        console.error('Fetch subscriptions error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      const { error } = await subscriptionService.cancelSubscription(subscriptionId);

      if (error) {
        console.error('Error cancelling subscription:', error);
        return;
      }

      // Refresh subscriptions after cancellation
      const { data } = await subscriptionService.getUserSubscriptions();
      setSubscriptions(data);

      // Update active subscription
      const active = data.find(sub =>
        sub.status === 'ACTIVE' &&
        new Date(sub.end_date) > new Date()
      );
      setActiveSubscription(active || null);
    } catch (error) {
      console.error('Cancel subscription error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMealTypes = (mealTypes: string[] | string) => {
    try {
      let types: string[] = [];

      if (typeof mealTypes === 'string') {
        // If it's a JSON string, parse it
        if (mealTypes.startsWith('[') || mealTypes.startsWith('{')) {
          types = JSON.parse(mealTypes);
        } else {
          // If it's a comma-separated string
          types = mealTypes.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(mealTypes)) {
        types = mealTypes;
      } else {
        return 'No meal types specified';
      }

      if (!Array.isArray(types) || types.length === 0) {
        return 'No meal types specified';
      }

      return types.map(type =>
        type.charAt(0).toUpperCase() + type.slice(1)
      ).join(', ');
    } catch (error) {
      console.error('Error formatting meal types:', error);
      return 'Unable to display meal types';
    }
  };

  const formatDeliveryDays = (days: string[] | string) => {
    try {
      let daysList: string[] = [];

      if (typeof days === 'string') {
        // If it's a JSON string, parse it
        if (days.startsWith('[') || days.startsWith('{')) {
          daysList = JSON.parse(days);
        } else {
          // If it's a comma-separated string
          daysList = days.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(days)) {
        daysList = days;
      } else {
        return 'No delivery days specified';
      }

      if (!Array.isArray(daysList) || daysList.length === 0) {
        return 'No delivery days specified';
      }

      return daysList.map(day =>
        day.charAt(0).toUpperCase() + day.slice(1)
      ).join(', ');
    } catch (error) {
      console.error('Error formatting delivery days:', error);
      return 'Unable to display delivery days';
    }
  };

  const getPlanName = (planId: number) => {
    const plans = {
      1: 'Diet Plan',
      2: 'Protein Plan',
      3: 'Royal Plan'
    };
    return plans[planId as keyof typeof plans] || 'Unknown Plan';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>

        {/* Active Subscription Card */}
        {activeSubscription ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Active Subscription
                </CardTitle>
                <Badge className={getStatusColor(activeSubscription.status)}>
                  {activeSubscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Plan:</span>
                    <span>{getPlanName(activeSubscription.plan_id)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <span>{activeSubscription.phone_number}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="font-medium">Meal Types:</span>
                      <div className="text-sm">{formatMealTypes(activeSubscription.meal_type)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Start Date:</span>
                    <span>{formatDate(activeSubscription.start_date)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">End Date:</span>
                    <span>{formatDate(activeSubscription.end_date)}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="font-medium">Delivery Days:</span>
                      <div className="text-sm">{formatDeliveryDays(activeSubscription.delivery_days)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {activeSubscription.allergies && (
                <div className="pt-3 border-t">
                  <span className="font-medium">Allergies/Special Requests:</span>
                  <p className="text-muted-foreground mt-1">{activeSubscription.allergies}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => handleCancelSubscription(activeSubscription.id)}
                >
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have any active subscription. Subscribe to start enjoying our meal delivery service.
              </p>
              <Button asChild>
                <a href="/subscription">Subscribe Now</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Subscription History */}
        {subscriptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getPlanName(subscription.plan_id)}</span>
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Meals: {formatMealTypes(subscription.meal_type)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Delivery: {formatDeliveryDays(subscription.delivery_days)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}