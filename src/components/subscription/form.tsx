import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { subscriptionService } from "@/services/subscription-service";
import { ChevronLeft, ShoppingCart, Receipt } from "lucide-react";
import { mealPlanService } from "@/services/meal-plan-service";

interface FormData {
  name: string;
  phoneNumber: string;
  planId: number;
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
  autoRenewal: boolean; // Add auto-renewal option
}

interface PlanOption {
  id: number;
  value: string;
  label: string;
  price: number;
}

export default function SubscriptionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMealPlan = location.state?.selectedMealPlan;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || "",
    phoneNumber: "",
    planId: selectedMealPlan?.id || 1,
    mealTypes: [],
    deliveryDays: [],
    allergies: "",
    autoRenewal: true // Add auto-renewal option
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState("");
  const [planOptions, setPlanOptions] = useState<PlanOption[]>([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // Check for existing active subscription
  useEffect(() => {
    const checkActiveSubscription = async () => {
      if (!user?.id) {
        setCheckingSubscription(false);
        return;
      }

      try {
        setCheckingSubscription(true);

        // Get subscriptions for the user
        const { data: subscriptions, error } = await subscriptionService.getActiveSubscription(user.id);

        if (error) {
          console.error('Error checking subscription:', error);
          setCheckingSubscription(false);
          return;
        }

        // Debug log to see the response structure
        console.log('Subscription check response:', {
          userId: user.id,
          subscriptions,
          subscriptionCount: subscriptions?.length || 0
        });

        // Check if user has any truly active subscription
        const hasActiveSubscription = subscriptions && subscriptions.length > 0;

        console.log('Active subscription check:', {
          hasActiveSubscription,
          subscriptionsWithStatus: subscriptions?.map(sub => ({ id: sub.id, status: sub.status }))
        });

        console.log('Active subscription check:', {
          userId: user.id,
          hasActiveSubscription,
          subscriptionCount: subscriptions?.length || 0,
          subscriptions: subscriptions?.map(sub => ({
            id: sub.id,
            status: sub.status,
            endDate: sub.end_date
          }))
        });

        setHasActiveSubscription(hasActiveSubscription);

        setCheckingSubscription(false);
      } catch (error) {
        console.error('Failed to check subscription:', error);
        setCheckingSubscription(false);
      }
    };

    checkActiveSubscription();
  }, [user?.id]);

  // Fetch meal plans from database
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const plans = await mealPlanService.getAllMealPlans();

        // Transform meal plans to plan options format
        const transformedPlans = plans.map(plan => ({
          id: plan.id,
          value: plan.name.toLowerCase().replace(/\s+/g, '-'),
          label: plan.name,
          price: plan.price
        }));

        setPlanOptions(transformedPlans);
      } catch (error) {
        console.error('Failed to fetch meal plans:', error);
        setMessage("Failed to load meal plans. Please refresh the page.");
      } finally {
        setCheckingSubscription(false);
      }
    };

    fetchMealPlans();
  }, []);

  const handleActiveSubscriptionClose = () => {
    navigate('/dashboard');
  };

  // Show loading while checking subscription
  if (checkingSubscription) {
    return (
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Checking your subscription status...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show modal and prevent form rendering if user has active subscription
  if (hasActiveSubscription) {
    return (
      <>
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Active Subscription Found</h2>
                  <p className="text-muted-foreground mb-4">
                    You already have an active subscription. Redirecting to dashboard.
                  </p>
                  <Button onClick={handleActiveSubscriptionClose}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </>
    );
  }

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

  // Calculate total price
  const calculateTotal = () => {
    const selectedPlan = planOptions.find(p => p.id === formData.planId);
    const pricePerMeal = selectedPlan?.price || 0;
    const mealTypesCount = formData.mealTypes.length;
    const deliveryDaysCount = formData.deliveryDays.length;
    const weeksInMonth = 4.3;

    return pricePerMeal * mealTypesCount * deliveryDaysCount * weeksInMonth;
  };

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

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setMessage("Please enter your name");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setMessage("Please enter your phone number");
      return false;
    }
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setMessage("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.mealTypes.length === 0) {
      setMessage("Please select at least one meal type");
      return false;
    }
    if (formData.deliveryDays.length === 0) {
      setMessage("Please select at least one delivery day");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setMessage("");

    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setMessage("");
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      setMessage("Please login to create a subscription");
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
      }, formData.autoRenewal);

      if (error) {
        console.error('Subscription creation failed:', error);
        setMessage("Failed to create subscription. Please try again.");
        return;
      }

      if (data) {
        setShowSuccessModal(true);
        setFormData({
          name: user?.user_metadata?.full_name || "",
          phoneNumber: "",
          planId: 1,
          mealTypes: [],
          deliveryDays: [],
          allergies: "",
          autoRenewal: true // Reset auto-renewal option
        });
        setCurrentStep(1);
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

  const getSelectedPlan = () => planOptions.find(p => p.id === formData.planId);

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Subscription Preferences"}
              {currentStep === 3 && "Order Summary & Checkout"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 3
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-md text-sm mb-6 ${message.includes('success') || message.includes('successful')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                {message}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
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
              </div>
            )}

            {/* Step 2: Subscription Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Plan Selection</Label>
                    <RadioGroup
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      value={planOptions.find(p => p.id === formData.planId)?.value}
                      onValueChange={handlePlanChange}
                    >
                      {planOptions.map((plan) => (
                        <div key={plan.id} className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value={plan.value} id={plan.value} />
                          <div className="flex-1">
                            <Label htmlFor={plan.value} className="font-medium">
                              {plan.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Rp {plan.price.toLocaleString()}/meal
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Meal Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {mealTypeOptions.map((meal) => (
                        <div key={meal.id} className="flex items-center space-x-2 border rounded-lg p-3">
                          <Checkbox
                            id={meal.id}
                            checked={formData.mealTypes.includes(meal.id)}
                            onCheckedChange={(checked) => handleMealTypeChange(meal.id, checked as boolean)}
                          />
                          <Label htmlFor={meal.id} className="font-medium">
                            {meal.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Delivery Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {dayOptions.map((day) => (
                        <div key={day.id} className="flex items-center space-x-2 border rounded-lg p-3">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies or Special Requests (Optional)</Label>
                    <Textarea
                      id="allergies"
                      placeholder="Write about your allergies or special dietary requirements"
                      value={formData.allergies}
                      onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Order Summary & Checkout */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Summary */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Receipt className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">Order Summary</h3>
                    </div>

                    <div className="rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Plan:</span>
                        <span>{getSelectedPlan()?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Price per meal:</span>
                        <span>Rp {getSelectedPlan()?.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Meal types:</span>
                        <span>{formData.mealTypes.length} types</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Delivery days:</span>
                        <span>{formData.deliveryDays.length} days/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span>30 days (4.3 weeks)</span>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Calculation: Rp {getSelectedPlan()?.price.toLocaleString()} × {formData.mealTypes.length} × {formData.deliveryDays.length} × 4.3
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount:</span>
                          <span className="text-primary">Rp {calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Details */}
                    <div className="space-y-3 pt-4">
                      <h4 className="font-medium">Selected Details:</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Meal Types:</strong> {formData.mealTypes.map(type => mealTypeOptions.find(m => m.id === type)?.label).join(', ')}</p>
                        <p><strong>Delivery Days:</strong> {formData.deliveryDays.map(day => dayOptions.find(d => d.id === day)?.label).join(', ')}</p>
                        {formData.allergies && (
                          <p><strong>Allergies or Special Requests:</strong> {formData.allergies}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                    <div className="rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{formData.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{user?.email}</span>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-orange-500 mb-2">Payment Information</h4>
                      <p className="text-sm text-orange-400">
                        Your subscription will be active for 30 days starting from today.
                        You can manage your subscription from your dashboard.
                      </p>
                    </div>

                    {/* Auto-Renewal Option */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoRenewal"
                        checked={formData.autoRenewal}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, autoRenewal: !!checked }))
                        }
                      />
                      <Label htmlFor="autoRenewal" className="text-sm">
                        Enable auto-renewal (subscription will automatically renew every month)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}

              <div className="ml-auto">
                {currentStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {loading ? "Processing..." : "Confirm Subscription"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Created Successfully!</DialogTitle>
            <DialogDescription>
              Your subscription plan has been created and will be active for 30 days starting from today.
              Total amount: Rp {calculateTotal().toLocaleString()}
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