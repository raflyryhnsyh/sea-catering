import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Phone, Utensils, Pause, CalendarX } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { subscriptionService, type Subscription } from "@/services/subscription-service";
import PauseDialog from "@/components/dashboard/pause-dialog";

export default function DashboardUser() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPauseDialog, setShowPauseDialog] = useState(false);

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

        // Find active subscription (ACTIVE status and not expired)
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

      await refreshSubscriptions();
    } catch (error) {
      console.error('Cancel subscription error:', error);
    }
  };

  const refreshSubscriptions = async () => {
    const { data } = await subscriptionService.getUserSubscriptions();
    setSubscriptions(data);

    const active = data.find(sub =>
      sub.status === 'ACTIVE' &&
      new Date(sub.end_date) > new Date()
    );
    setActiveSubscription(active || null);
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
        if (mealTypes.startsWith('[') || mealTypes.startsWith('{')) {
          types = JSON.parse(mealTypes);
        } else {
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
        if (days.startsWith('[') || days.startsWith('{')) {
          daysList = JSON.parse(days);
        } else {
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

  const hasActivePausePeriod = (subscription: Subscription) => {
    if (!subscription.pause_periode_start || !subscription.pause_periode_end) return false;

    const today = new Date();
    const pauseStart = new Date(subscription.pause_periode_start);
    const pauseEnd = new Date(subscription.pause_periode_end);

    return today >= pauseStart && today <= pauseEnd;
  };

  const hasUpcomingPausePeriod = (subscription: Subscription) => {
    if (!subscription.pause_periode_start || !subscription.pause_periode_end) return false;

    const today = new Date();
    const pauseStart = new Date(subscription.pause_periode_start);

    return today < pauseStart;
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

              {/* Pause Period Information */}
              {activeSubscription.pause_periode_start && activeSubscription.pause_periode_end && (
                <div className="pt-3 border-t">
                  {hasActivePausePeriod(activeSubscription) ? (
                    <div className="bg-yellow-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarX className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Delivery Currently Paused</span>
                      </div>
                      <div className="text-sm text-yellow-700">
                        <p>No deliveries from {formatDate(activeSubscription.pause_periode_start)} to {formatDate(activeSubscription.pause_periode_end)}</p>
                        <p className="mt-1">Deliveries will resume automatically after {formatDate(activeSubscription.pause_periode_end)}</p>
                      </div>
                    </div>
                  ) : hasUpcomingPausePeriod(activeSubscription) ? (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Upcoming Delivery Pause</span>
                      </div>
                      <div className="text-sm text-blue-700">
                        <p>Deliveries will be paused from {formatDate(activeSubscription.pause_periode_start)} to {formatDate(activeSubscription.pause_periode_end)}</p>
                        <p className="mt-1">No meals will be delivered during this period</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-800">Previous Delivery Pause</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p>Deliveries were paused from {formatDate(activeSubscription.pause_periode_start)} to {formatDate(activeSubscription.pause_periode_end)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSubscription.allergies && (
                <div className="pt-3 border-t">
                  <span className="font-medium">Allergies/Special Requests:</span>
                  <p className="text-muted-foreground mt-1">{activeSubscription.allergies}</p>
                </div>
              )}

              <div className="pt-4 border-t flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowPauseDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pause Delivery
                </Button>

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
                <a href="/subscriptions">Subscribe Now</a>
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
                      {subscription.pause_periode_start && subscription.pause_periode_end && (
                        <div className="text-sm text-orange-600">
                          Delivery paused: {formatDate(subscription.pause_periode_start)} - {formatDate(subscription.pause_periode_end)}
                        </div>
                      )}
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

      {/* Pause Dialog */}
      {activeSubscription && (
        <PauseDialog
          isOpen={showPauseDialog}
          onClose={() => setShowPauseDialog(false)}
          subscription={activeSubscription}
          onSuccess={refreshSubscriptions}
        />
      )}
    </div>
  );
}