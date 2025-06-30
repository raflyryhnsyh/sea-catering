import { DataTableUsers } from "@/components/dashboard/data-table-users";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  phone: string | null;
  provider: string | null;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          role,
          phone,
          provider,
          created_at
        `)
        .eq('role', 'user') // Filter only users with role = 'user'
        .order('created_at', { ascending: false });

      console.log('Fetched users:', data);

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users data');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Transform data untuk DataTable
  const tableData = users.map((user) => ({
    id: user.id,
    full_name: user.full_name || 'N/A',
    email: user.email || 'N/A',
    role: user.role,
    phone: user.phone,
    provider: user.provider,
    created_at: user.created_at,
    formatted_created_at: formatDate(user.created_at)
  }));

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Users Management</h1>
        </div>
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Users Management</h1>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-600 font-medium">Error</div>
            <div className="text-red-500 text-sm mt-1">{error}</div>
            <button
              onClick={fetchUsers}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage user accounts and their information
        </p>
      </div>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {tableData.length > 0 ? (
            <DataTableUsers data={tableData} />
          ) : (
            <div className="mx-6 bg-white rounded-lg shadow border p-8 text-center">
              <div className="text-gray-500 text-lg">No users found</div>
              <div className="text-gray-400 text-sm mt-2">
                There are no user records to display
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}