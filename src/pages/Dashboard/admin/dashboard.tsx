import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/db";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardStats {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  activeSubscriptions: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<DashboardStats>({
    newSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    reactivations: 0,
    activeSubscriptions: 0,
  });

  const [timeRange, setTimeRange] = useState<string>("90d");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);

  // Function to calculate date range based on time range selection
  const calculateDateRange = (range: string): DateRange => {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case "365d": // 1 year
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "90d": // 3 months
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "30d": // 30 days
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "7d": // 7 days
        startDate.setDate(endDate.getDate() - 7);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 3); // default to 3 months
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  // Calculate dashboard statistics
  const calculateStats = async (startDate: string, endDate: string) => {
    try {
      console.log('Calculating stats for date range:', startDate, 'to', endDate);

      // 1. New Subscriptions - berdasarkan start_date dalam range
      const { data: newSubs, error: newSubsError } = await supabase
        .from('subscriptions')
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate);

      if (newSubsError) {
        console.error('Error fetching new subscriptions:', newSubsError);
        throw newSubsError;
      }

      console.log('New subscriptions found:', newSubs?.length || 0);

      // 2. Active Subscriptions - status = 'ACTIVE' dan end_date >= today atau end_date is null
      const today = new Date().toISOString().split('T')[0];
      const { data: activeSubs, error: activeSubsError } = await supabase
        .from('subscriptions')
        .select('id, plan_id, meal_type, delivery_days, status, end_date, start_date')
        .eq('status', 'ACTIVE')
        .or(`end_date.gte.${today},end_date.is.null`);

      if (activeSubsError) {
        console.error('Error fetching active subscriptions:', activeSubsError);
        throw activeSubsError;
      }

      console.log('Active subscriptions found:', activeSubs?.length || 0);

      // 3. Get meal plans untuk MRR calculation
      const { data: mealPlans, error: mealPlansError } = await supabase
        .from('meal_plan')
        .select('id, price');

      if (mealPlansError) {
        console.error('Error fetching meal plans:', mealPlansError);
        throw mealPlansError;
      }

      // Create map untuk meal plan prices
      const mealPlanPrices = mealPlans?.reduce((acc, plan) => {
        acc[plan.id] = plan.price;
        return acc;
      }, {} as Record<number, number>) || {};

      // 4. Calculate Monthly Recurring Revenue (MRR)
      let totalMRR = 0;
      if (activeSubs && activeSubs.length > 0) {
        activeSubs.forEach(sub => {
          try {
            // Get price dari meal plan
            const pricePerMeal = mealPlanPrices[sub.plan_id] || 0;

            if (pricePerMeal === 0) {
              console.warn('No price found for plan_id:', sub.plan_id);
              return;
            }

            // Parse meal types dan delivery days - kedua field bertipe varchar
            let mealTypesCount = 1;
            let deliveryDaysCount = 1;

            if (sub.meal_type) {
              try {
                // Jika meal_type adalah JSON string
                if (sub.meal_type.startsWith('[') || sub.meal_type.startsWith('{')) {
                  const mealTypes = JSON.parse(sub.meal_type);
                  mealTypesCount = Array.isArray(mealTypes) ? mealTypes.length : 1;
                } else {
                  // Jika meal_type adalah comma-separated string
                  mealTypesCount = sub.meal_type.split(',').length;
                }
              } catch (e) {
                console.warn('Error parsing meal_type for subscription:', sub.id, 'value:', sub.meal_type);
                mealTypesCount = 1;
              }
            }

            if (sub.delivery_days) {
              try {
                // Jika delivery_days adalah JSON string
                if (sub.delivery_days.startsWith('[') || sub.delivery_days.startsWith('{')) {
                  const deliveryDays = JSON.parse(sub.delivery_days);
                  deliveryDaysCount = Array.isArray(deliveryDays) ? deliveryDays.length : 1;
                } else {
                  // Jika delivery_days adalah comma-separated string
                  deliveryDaysCount = sub.delivery_days.split(',').length;
                }
              } catch (e) {
                console.warn('Error parsing delivery_days for subscription:', sub.id, 'value:', sub.delivery_days);
                deliveryDaysCount = 1;
              }
            }

            // Calculate monthly price: price per meal × meal types × delivery days × 4.3 weeks
            const monthlyPrice = pricePerMeal * mealTypesCount * deliveryDaysCount * 4.3;
            totalMRR += monthlyPrice;

            console.log(`Subscription ${sub.id}: ${pricePerMeal} × ${mealTypesCount} × ${deliveryDaysCount} × 4.3 = ${monthlyPrice}`);
          } catch (error) {
            console.error('Error calculating MRR for subscription:', sub.id, error);
          }
        });
      }

      console.log('Total MRR calculated:', totalMRR);

      // 5. Reactivations - cari user yang punya subscription dengan status history
      const { data: allUserSubs, error: allUserSubsError } = await supabase
        .from('subscriptions')
        .select('user_id, status, start_date, end_date, id')
        .order('user_id')
        .order('start_date', { ascending: true });

      if (allUserSubsError) {
        console.error('Error fetching all subscriptions for reactivations:', allUserSubsError);
        throw allUserSubsError;
      }

      // Group by user
      const userSubsMap = allUserSubs?.reduce((acc, sub) => {
        if (!acc[sub.user_id]) acc[sub.user_id] = [];
        acc[sub.user_id].push(sub);
        return acc;
      }, {} as Record<string, any[]>) || {};

      let reactivations = 0;
      Object.values(userSubsMap).forEach(userSubs => {
        if (userSubs.length > 1) {
          // Sort by start_date untuk memastikan urutan yang benar
          userSubs.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

          for (let i = 1; i < userSubs.length; i++) {
            const prevSub = userSubs[i - 1];
            const currentSub = userSubs[i];

            // Check if previous was cancelled and current is active within date range
            if (prevSub.status === 'CANCELLED' &&
              currentSub.status === 'ACTIVE' &&
              currentSub.start_date >= startDate &&
              currentSub.start_date <= endDate) {
              reactivations++;
              console.log(`Reactivation found for user ${currentSub.user_id}: prev ${prevSub.id} (${prevSub.status}) -> current ${currentSub.id} (${currentSub.status})`);
            }
          }
        }
      });

      console.log('Reactivations found:', reactivations);

      setStats({
        newSubscriptions: newSubs?.length || 0,
        monthlyRecurringRevenue: Math.round(totalMRR),
        reactivations,
        activeSubscriptions: activeSubs?.length || 0,
      });

    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      setStats({
        newSubscriptions: 0,
        monthlyRecurringRevenue: 0,
        reactivations: 0,
        activeSubscriptions: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    const newDateRange = calculateDateRange(newTimeRange);
    setDateRange(newDateRange);
    setLoading(true);
    calculateStats(newDateRange.startDate, newDateRange.endDate);
  };

  // Initialize on component mount
  useEffect(() => {
    const initialDateRange = calculateDateRange(timeRange);
    setDateRange(initialDateRange);
    calculateStats(initialDateRange.startDate, initialDateRange.endDate);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get display text for time range
  const getTimeRangeText = (range: string) => {
    switch (range) {
      case "365d":
        return "Last 1 year";
      case "90d":
        return "Last 3 months";
      case "30d":
        return "Last 30 days";
      case "7d":
        return "Last 7 days";
      default:
        return "Last 3 months";
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Management</h1>
          <div className="flex items-center gap-4">

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger
                  className="flex w-40"
                  aria-label="Select time range"
                >
                  <SelectValue placeholder={getTimeRangeText(timeRange)} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="365d" className="rounded-lg">
                    Last 1 year
                  </SelectItem>
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Show current date range */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Showing data from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-6">
        {/* Dashboard Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* New Subscriptions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.newSubscriptions
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                New subscriptions in selected period
              </p>
            </CardContent>
          </Card>

          {/* Monthly Recurring Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                ) : (
                  formatCurrency(stats.monthlyRecurringRevenue)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue from active subscriptions
              </p>
            </CardContent>
          </Card>

          {/* Reactivations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reactivations</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.reactivations
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Cancelled subscriptions restarted
              </p>
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.activeSubscriptions
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active subscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Summary Information */}
        <Card>
          <CardHeader>
            <CardTitle>Summary Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Time Period:</p>
                <p className="text-muted-foreground">
                  {getTimeRangeText(timeRange)}
                </p>
              </div>
              <div>
                <p className="font-medium">Date Range:</p>
                <p className="text-muted-foreground">
                  {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-medium">Average Revenue per Subscription:</p>
                <p className="text-muted-foreground">
                  {stats.activeSubscriptions > 0
                    ? formatCurrency(Math.round(stats.monthlyRecurringRevenue / stats.activeSubscriptions))
                    : formatCurrency(0)
                  }
                </p>
              </div>
              <div>
                <p className="font-medium">Growth Rate:</p>
                <p className="text-muted-foreground">
                  {stats.activeSubscriptions > 0 && stats.newSubscriptions > 0
                    ? `${Math.round((stats.newSubscriptions / stats.activeSubscriptions) * 100)}% in selected period`
                    : 'No growth data available'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}