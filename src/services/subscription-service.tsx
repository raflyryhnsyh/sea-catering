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
    auto_renewal?: boolean; // add auto_renewal field
}

export const subscriptionService = {
    async createSubscription(data: CreateSubscriptionData, autoRenewal: boolean = true) {
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
                auto_renewal: autoRenewal
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

    // New method to handle auto-renewal
    async renewSubscription(originalSubscription: Subscription) {
        try {
            // Mark the old subscription as expired
            await supabase
                .from('subscriptions')
                .update({ status: 'EXPIRED' })
                .eq('id', originalSubscription.id);

            // Create new subscription with same details
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

            const newSubscriptionData = {
                user_id: originalSubscription.user_id,
                phone_number: originalSubscription.phone_number,
                plan_id: originalSubscription.plan_id,
                meal_type: originalSubscription.meal_type,
                delivery_days: originalSubscription.delivery_days,
                allergies: originalSubscription.allergies,
                status: 'ACTIVE',
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                auto_renewal: originalSubscription.auto_renewal
            };

            const { data: newSubscription, error } = await supabase
                .from('subscriptions')
                .insert([newSubscriptionData])
                .select()
                .single();

            if (error) {
                console.error('Auto-renewal error:', error);
                throw error;
            }

            return { data: newSubscription, error: null };
        } catch (error) {
            console.error('Renewal service error:', error);
            return { data: null, error };
        }
    },

    // Enhanced method to check and handle auto-renewal
    async checkAndRenewSubscriptions(userId: string) {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Find subscriptions that are about to expire (within 1 day) and have auto_renewal enabled
            const { data: expiringSubs, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'ACTIVE')
                .eq('auto_renewal', true)
                .lte('end_date', today);

            if (error) {
                throw error;
            }

            // Auto-renew each expiring subscription
            const renewalPromises = expiringSubs?.map(sub => this.renewSubscription(sub)) || [];
            const renewalResults = await Promise.all(renewalPromises);

            return { data: renewalResults, error: null };
        } catch (error) {
            console.error('Check and renew error:', error);
            return { data: null, error };
        }
    },

    async getActiveSubscription(userId: string) {
        try {
            // First check and handle auto-renewals
            await this.checkAndRenewSubscriptions(userId);

            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'ACTIVE')
                .gte('end_date', today) // End date must be today or later
                .order('start_date', { ascending: false });

            if (error) {
                throw error;
            }

            // Double check to ensure subscription is truly active
            const activeSubscriptions = data?.filter(sub => {
                const endDate = new Date(sub.end_date);
                const currentDate = new Date();
                return endDate >= currentDate && sub.status === 'ACTIVE';
            }) || [];

            return { data: activeSubscriptions, error: null };
        } catch (error) {
            console.error('Get active subscription error:', error);
            return { data: [], error };
        }
    },

    // Method to calculate subscription price
    async calculateSubscriptionPrice(planId: number, mealTypes: string[], deliveryDays: string[]) {
        try {
            // Get plan price from meal_plans table
            const { data: plan, error } = await supabase
                .from('meal_plan')
                .select('price')
                .eq('id', planId)
                .single();

            if (error || !plan) {
                throw new Error('Plan not found');
            }

            const pricePerMeal = plan.price;
            const mealTypesCount = mealTypes.length;
            const deliveryDaysCount = deliveryDays.length;
            const weeksInMonth = 4.3;

            const totalPrice = pricePerMeal * mealTypesCount * deliveryDaysCount * weeksInMonth;

            return { price: totalPrice, error: null };
        } catch (error) {
            console.error('Calculate price error:', error);
            return { price: 0, error };
        }
    },

    // Method to check and update expired subscriptions
    async updateExpiredSubscriptions(userId: string) {
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('subscriptions')
                .update({ status: 'EXPIRED' })
                .eq('user_id', userId)
                .eq('status', 'ACTIVE')
                .lt('end_date', today) // End date is before today
                .select();

            if (error) {
                throw error;
            }

            return { data, error: null };
        } catch (error) {
            console.error('Update expired subscriptions error:', error);
            return { data: null, error };
        }
    },

    // Enhanced getUserSubscriptions with expiry check
    async getUserSubscriptions(userId?: string) {
        try {
            let targetUserId = userId;

            if (!targetUserId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    throw new Error('User not authenticated');
                }
                targetUserId = user.id;
            }

            // First, update any expired subscriptions
            await this.updateExpiredSubscriptions(targetUserId);

            // Then fetch all subscriptions
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', targetUserId)
                .order('start_date', { ascending: false });

            if (error) {
                throw error;
            }

            return { data: data || [], error: null };
        } catch (error) {
            console.error('Get subscriptions error:', error);
            return { data: [], error };
        }
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
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            // Update subscription status to CANCELLED and disable auto_renewal
            const { data, error } = await supabase
                .from('subscriptions')
                .update({
                    status: 'CANCELLED',
                    auto_renewal: false // Disable auto-renewal when cancelled
                })
                .eq('id', subscriptionId)
                .eq('user_id', user.id) // Ensure user can only cancel their own subscription
                .select()
                .single();

            if (error) {
                console.error('Cancel subscription error:', error);
                throw error;
            }

            return { data, error: null };
        } catch (error) {
            console.error('Cancel subscription service error:', error);
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