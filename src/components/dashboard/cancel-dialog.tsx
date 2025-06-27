import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { type Subscription } from "@/services/subscription-service";

interface CancelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription;
    onConfirm: () => Promise<void>;
}

export default function CancelDialog({
    isOpen,
    onClose,
    subscription,
    onConfirm
}: CancelDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Cancel confirmation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPlanName = (planId: number) => {
        const plans = {
            1: 'Diet Plan',
            2: 'Protein Plan',
            3: 'Royal Plan'
        };
        return plans[planId as keyof typeof plans] || 'Unknown Plan';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Cancel Subscription
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel your subscription? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Subscription Details */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium text-gray-900">Subscription Details:</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p><span className="font-medium">Plan:</span> {getPlanName(subscription.plan_id)}</p>
                            <p><span className="font-medium">End Date:</span> {formatDate(subscription.end_date)}</p>
                            {subscription.auto_renewal && (
                                <p><span className="font-medium">Auto-Renewal:</span> Currently enabled</p>
                            )}
                        </div>
                    </div>

                    {/* Cancellation Effects */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-medium text-red-800 mb-2">What happens when you cancel:</h4>
                        <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                            <li>Your subscription will be marked as cancelled</li>
                            <li>Auto-renewal will be permanently disabled</li>
                            <li>You'll continue to receive meals until {formatDate(subscription.end_date)}</li>
                            <li>No future charges will be made</li>
                            <li>You can resubscribe anytime with a new subscription</li>
                        </ul>
                    </div>

                    {/* Confirmation Text */}
                    <div className="text-center p-4">
                        <p className="text-sm text-gray-600">
                            This will permanently cancel your subscription and disable auto-renewal.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Keep Subscription
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <X className="h-4 w-4" />
                                Yes, Cancel Subscription
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}