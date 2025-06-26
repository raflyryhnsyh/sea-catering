import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscriptionService } from "@/services/subscription-service";
import { Card } from "../ui/card";

interface PauseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: {
        id: number;
        start_date: string;
        end_date: string;
        delivery_days: string[] | string;
    };
    onSuccess: () => void;
}

export default function PauseDialog({ isOpen, onClose, subscription, onSuccess }: PauseDialogProps) {
    const [pauseStart, setPauseStart] = useState("");
    const [pauseEnd, setPauseEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Get subscription date range
    const subscriptionStart = subscription.start_date;
    const subscriptionEnd = subscription.end_date;
    const today = new Date().toISOString().split('T')[0];

    // Get min date (today or subscription start, whichever is later)
    const minDate = today > subscriptionStart ? today : subscriptionStart;

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
            }

            return daysList.map(day =>
                day.charAt(0).toUpperCase() + day.slice(1)
            ).join(', ');
        } catch (error) {
            return 'Unknown';
        }
    };

    const calculateSkippedDeliveries = () => {
        if (!pauseStart || !pauseEnd) return 0;

        const start = new Date(pauseStart);
        const end = new Date(pauseEnd);
        let count = 0;

        // Parse delivery days
        let deliveryDays: string[] = [];
        try {
            if (typeof subscription.delivery_days === 'string') {
                if (subscription.delivery_days.startsWith('[')) {
                    deliveryDays = JSON.parse(subscription.delivery_days);
                } else {
                    deliveryDays = subscription.delivery_days.split(',').map(s => s.trim());
                }
            } else {
                deliveryDays = subscription.delivery_days;
            }
        } catch (error) {
            return 0;
        }

        // Convert day names to numbers (0 = Sunday, 1 = Monday, etc.)
        const dayMap: { [key: string]: number } = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
        };

        const deliveryDayNumbers = deliveryDays.map(day => dayMap[day.toLowerCase()]).filter(num => num !== undefined);

        // Count delivery days in the pause period
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            if (deliveryDayNumbers.includes(date.getDay())) {
                count++;
            }
        }

        return count;
    };

    const handlePause = async () => {
        setError("");

        // Validation
        if (!pauseStart || !pauseEnd) {
            setError("Please select both start and end dates for the pause period");
            return;
        }

        const startDate = new Date(pauseStart);
        const endDate = new Date(pauseEnd);
        const minDateTime = new Date(minDate);
        const subEndDate = new Date(subscriptionEnd);

        if (startDate < minDateTime) {
            setError("Pause start date cannot be before today or subscription start date");
            return;
        }

        if (endDate < startDate) {
            setError("Pause end date must be after or same as start date");
            return;
        }

        if (startDate > subEndDate || endDate > subEndDate) {
            setError("Pause dates must be within your subscription period");
            return;
        }

        setLoading(true);

        try {
            const { error } = await subscriptionService.pauseSubscription(
                subscription.id,
                pauseStart,
                pauseEnd
            );

            if (error) {
                console.error('Error pausing delivery:', error);
                setError("Failed to pause delivery. Please try again.");
                return;
            }

            // Reset form and close
            setPauseStart("");
            setPauseEnd("");
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Pause delivery error:', error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPauseStart("");
        setPauseEnd("");
        setError("");
        onClose();
    };

    const skippedDeliveries = calculateSkippedDeliveries();

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Pause Meal Delivery</DialogTitle>
                    <DialogDescription>
                        Skip meal deliveries for a specific date range. No meals will be delivered during this period, but your subscription will continue.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && (
                        <div className="p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Subscription Info */}
                    <Card className="p-4">
                        <p><strong>Subscription Period:</strong> {new Date(subscriptionStart).toLocaleDateString()} - {new Date(subscriptionEnd).toLocaleDateString()}</p>
                        <p><strong>Delivery Days:</strong> {formatDeliveryDays(subscription.delivery_days)}</p>
                    </Card>

                    <div className="space-y-2">
                        <Label htmlFor="pauseStart">Pause Start Date</Label>
                        <Input
                            id="pauseStart"
                            type="date"
                            value={pauseStart}
                            onChange={(e) => setPauseStart(e.target.value)}
                            min={minDate}
                            max={subscriptionEnd}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pauseEnd">Pause End Date</Label>
                        <Input
                            id="pauseEnd"
                            type="date"
                            value={pauseEnd}
                            onChange={(e) => setPauseEnd(e.target.value)}
                            min={pauseStart || minDate}
                            max={subscriptionEnd}
                        />
                    </div>

                    {/* Delivery Count Preview */}
                    {pauseStart && pauseEnd && skippedDeliveries > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-md text-sm">
                            <p><strong>Deliveries to be skipped:</strong> {skippedDeliveries} meal{skippedDeliveries > 1 ? 's' : ''}</p>
                            <p className="text-yellow-700 mt-1">These meals will not be delivered during the selected period.</p>
                        </div>
                    )}

                    <Card className="p-4">
                        <p><strong>Important:</strong></p>
                        <ul className="list-disc list-inside ">
                            <li>No meals will be delivered during the pause period</li>
                            <li>Your subscription will continue and resume automatically after the pause period</li>
                            <li>You can set multiple pause periods if needed</li>
                            <li>Only delivery days within your subscription are affected</li>
                        </ul>
                    </Card>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handlePause} disabled={loading}>
                        {loading ? "Pausing Delivery..." : "Pause Delivery"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}