import { supabase } from '@/lib/db';

export interface CreateSubscriptionData {
    phone_number: string;
    plan_id: number;
    meal_type: string[];
    delivery_days: string[];
    allergies?: string;
}

export interface Subscription {
    id: number;
    user_id: string;
    phone_number: string;
    plan_id: number;
    meal_type: string[];
    delivery_days: string[];
    allergies?: string;
    status: string;
    start_date: string;
    end_date: string;
    pause_periode_start?: string;
    pause_periode_end?: string;
}

export const subscriptionService = {
    async createSubscription(data: CreateSubscriptionData) {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            // Calculate end date (30 days from now)
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

            const subscriptionData = {
                user_id: user.id,
                phone_number: data.phone_number,
                plan_id: data.plan_id,
                meal_type: data.meal_type,
                delivery_days: data.delivery_days,
                allergies: data.allergies || null,
                status: 'ACTIVE',
                start_date: startDate.toISOString().split('T')[0], // Format as date only
                end_date: endDate.toISOString().split('T')[0], // Format as date only
            };

            const { data: subscription, error } = await supabase
                .from('subscriptions')
                .insert([subscriptionData])
                .select()
                .single();

            if (error) {
                console.error('Subscription creation error:', error);
                throw error;
            }

            return { data: subscription, error: null };
        } catch (error) {
            console.error('Subscription service error:', error);
            return { data: null, error };
        }
    },

    async getUserSubscriptions(userId?: string) {
        try {
            let query = supabase.from('subscriptions').select('*');

            if (userId) {
                query = query.eq('user_id', userId);
            } else {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    throw new Error('User not authenticated');
                }
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query.order('id', { ascending: false });

            if (error) {
                console.error('Error fetching subscriptions:', error);
                throw error;
            }

            return { data: data || [], error: null };
        } catch (error) {
            console.error('Get subscriptions error:', error);
            return { data: [], error };
        }
    },

    async getActiveSubscription(userId: string) {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'ACTIVE') // Filter by ACTIVE status
            .gte('end_date', new Date().toISOString().split('T')[0]) // Ensure end date is today or later

        return { data, error };
    },

    // Alternative method to get all user subscriptions if needed
    async getAllUserSubscriptions(userId: string) {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .gte('end_date', new Date().toISOString().split('T')[0]) // Ensure end date is today or later

        return { data, error };
    },

    async cancelSubscription(subscriptionId: number) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .update({ status: 'CANCELLED' })
                .eq('id', subscriptionId)
                .select()
                .single();

            if (error) {
                console.error('Error cancelling subscription:', error);
                throw error;
            }

            return { data, error: null };
        } catch (error) {
            console.error('Cancel subscription error:', error);
            return { data: null, error };
        }
    },

    async pauseSubscription(subscriptionId: number, pauseStart: string, pauseEnd: string) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .update({
                    pause_periode_start: pauseStart,
                    pause_periode_end: pauseEnd
                })
                .eq('id', subscriptionId)
                .select()
                .single();

            if (error) {
                console.error('Error pausing subscription:', error);
                throw error;
            }

            return { data, error: null };
        } catch (error) {
            console.error('Pause subscription error:', error);
            return { data: null, error };
        }
    },

    async resumeSubscription(subscriptionId: number) {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .update({
                    status: 'ACTIVE',
                    pause_periode_start: null,
                    pause_periode_end: null
                })
                .eq('id', subscriptionId)
                .select()
                .single();

            if (error) {
                console.error('Error resuming subscription:', error);
                throw error;
            }

            return { data, error: null };
        } catch (error) {
            console.error('Resume subscription error:', error);
            return { data: null, error };
        }
    }
};