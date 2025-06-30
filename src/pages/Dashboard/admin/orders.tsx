import { DataTable } from "@/components/dashboard/data-table-orders";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";

interface Subscription {
  id: string;
  user_id: string;
  phone_number: string;
  status: string;
  start_date: string;
  end_date: string;
}

export default function Orders() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch subscriptions data dari Supabase
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, phone_number, status, start_date, end_date')
        .order('start_date', { ascending: false });

      console.log('Fetched subscriptions:', data);

      if (error) {
        throw error;
      }

      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Transform data untuk DataTable dengan struktur subscription
  const transformedData = subscriptions.map((sub, index) => ({
    id: parseInt(sub.id) || index + 1,
    user_id: sub.user_id,
    phone_number: sub.phone_number || 'N/A',
    status: sub.status,
    start_date: sub.start_date,
    end_date: sub.end_date,
    formatted_start_date: formatDate(sub.start_date),
    formatted_end_date: formatDate(sub.end_date)
  }));

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Orders Management</h1>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage user subscriptions and their status
        </p>
      </div>

      <div className="@container/main flex flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {transformedData.length > 0 ? (
            <DataTable data={transformedData} />
          ) : (
            <div className="mx-6 bg-white rounded-lg shadow border p-8 text-center">
              <div className="text-gray-500 text-lg">No subscriptions found</div>
              <div className="text-gray-400 text-sm mt-2">
                There are no subscription records to display
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}