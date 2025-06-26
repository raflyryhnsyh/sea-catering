import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { subscriptionService } from "@/services/subscription-service";

interface FormData {
  name: string;
  phoneNumber: string;
  planId: number;
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
}

export default function SubscriptionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMealPlan = location.state?.selectedMealPlan;

  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || "",
    phoneNumber: "",
    planId: selectedMealPlan?.id || 1,
    mealTypes: [],
    deliveryDays: [],
    allergies: ""
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState("");

  const planOptions = [
    { id: 1, value: "diet-plan", label: "Diet Plan" },
    { id: 2, value: "protein-plan", label: "Protein Plan" },
    { id: 3, value: "royal-plan", label: "Royal Plan" }
  ];

  const mealTypeOptions = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" }
  ];

  const dayOptions = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" }
  ];

  const handlePlanChange = (value: string) => {
    const plan = planOptions.find(p => p.value === value);
    if (plan) {
      setFormData(prev => ({ ...prev, planId: plan.id }));
    }
  };

  const handleMealTypeChange = (mealType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      mealTypes: checked
        ? [...prev.mealTypes, mealType]
        : prev.mealTypes.filter(type => type !== mealType)
    }));
  };

  const handleDeliveryDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryDays: checked
        ? [...prev.deliveryDays, day]
        : prev.deliveryDays.filter(d => d !== day)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login to create a subscription");
      return;
    }

    // Validation
    if (formData.mealTypes.length === 0) {
      setMessage("Please select at least one meal type");
      return;
    }

    if (formData.deliveryDays.length === 0) {
      setMessage("Please select at least one delivery day");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setMessage("Please enter your phone number");
      return;
    }

    // Phone number validation
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setMessage("Please enter a valid phone number");
      return;
    }

    if (!formData.name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await subscriptionService.createSubscription({
        phone_number: formData.phoneNumber.trim(),
        plan_id: formData.planId,
        meal_type: formData.mealTypes,
        delivery_days: formData.deliveryDays,
        allergies: formData.allergies.trim()
      });

      if (error) {
        console.error('Subscription creation failed:', error);
        setMessage("Failed to create subscription. Please try again.");
        return;
      }

      if (data) {
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          name: user?.user_metadata?.full_name || "",
          phoneNumber: "",
          planId: 1,
          mealTypes: [],
          deliveryDays: [],
          allergies: ""
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Message Display */}
                {message && (
                  <div className={`p-3 rounded-md text-sm ${message.includes('success') || message.includes('successful')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message}
                  </div>
                )}

                {/* Profile section */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <Separator />
                </div>
              </div>
            </CardContent>

            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Subscription section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Plan Selection</Label>
                    <RadioGroup
                      className="flex flex-row space-x-6"
                      value={planOptions.find(p => p.id === formData.planId)?.value}
                      onValueChange={handlePlanChange}
                    >
                      {planOptions.map((plan) => (
                        <div key={plan.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={plan.value} id={plan.value} />
                          <Label htmlFor={plan.value} className="text-sm font-medium">
                            {plan.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Meal Type</Label>
                    <div className="flex flex-row space-x-6">
                      {mealTypeOptions.map((meal) => (
                        <div key={meal.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={meal.id}
                            checked={formData.mealTypes.includes(meal.id)}
                            onCheckedChange={(checked) => handleMealTypeChange(meal.id, checked as boolean)}
                          />
                          <Label htmlFor={meal.id} className="text-sm font-medium">
                            {meal.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {dayOptions.map((day) => (
                        <div key={day.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={day.id}
                            checked={formData.deliveryDays.includes(day.id)}
                            onCheckedChange={(checked) => handleDeliveryDayChange(day.id, checked as boolean)}
                          />
                          <Label htmlFor={day.id} className="text-sm font-medium">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select the days you want your meals delivered
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Let us know about any allergies or special requests.</Label>
                    <Textarea
                      id="allergies"
                      placeholder="Write about your allergies or special dietary requirements"
                      value={formData.allergies}
                      onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Creating Subscription..." : "Create Subscription Plan"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Created Successfully!</DialogTitle>
            <DialogDescription>
              Your subscription plan has been created and will be active for 30 days starting from today.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessClose}>
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}