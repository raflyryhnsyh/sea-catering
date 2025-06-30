import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { type MealPlanFromDB } from "@/services/meal-plan-service";
import { supabase } from "@/lib/db";

interface MealPlanForm {
  name: string;
  price: number;
  description: string;
  benefits: string[];
  image: string;
}

export default function CateringMenu() {
  const [mealPlans, setMealPlans] = useState<MealPlanFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlanFromDB | null>(null);
  const [formData, setFormData] = useState<MealPlanForm>({
    name: "",
    price: 0,
    description: "",
    benefits: [],
    image: ""
  });
  const [benefitInput, setBenefitInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meal_plan')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      benefits: [],
      image: ""
    });
    setBenefitInput("");
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || formData.price <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      if (editingPlan) {
        // Update existing meal plan
        const { error } = await supabase
          .from('meal_plan')
          .update({
            name: formData.name,
            price: formData.price,
            description: formData.description,
            benefits: formData.benefits,
            image: formData.image
          })
          .eq('id', editingPlan.id);

        if (error) throw error;
        setIsEditModalOpen(false);
        setEditingPlan(null);
      } else {
        // Add new meal plan
        const { error } = await supabase
          .from('meal_plan')
          .insert([{
            name: formData.name,
            price: formData.price,
            description: formData.description,
            benefits: formData.benefits,
            image: formData.image
          }]);

        if (error) throw error;
        setIsAddModalOpen(false);
      }

      resetForm();
      fetchMealPlans();
    } catch (error) {
      console.error('Error submitting meal plan:', error);
      alert("Error saving meal plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan: MealPlanFromDB) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      benefits: Array.isArray(plan.benefits) ? plan.benefits : [],
      image: plan.image || ""
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (planId: number) => {
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
      const { error } = await supabase
        .from('meal_plan')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      fetchMealPlans();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      alert("Error deleting meal plan. Please try again.");
    }
  };

  const MealPlanForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Plan Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Diet Plan"
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Price per Meal (IDR) *</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
          placeholder="e.g., 25000"
          min="0"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the meal plan..."
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label>Benefits</Label>
        <div className="flex gap-2">
          <Input
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            placeholder="Add a benefit..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
          />
          <Button type="button" onClick={handleAddBenefit}>Add</Button>
        </div>
        {formData.benefits.length > 0 && (
          <div className="mt-2 space-y-1">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">{benefit}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBenefit(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : (editingPlan ? "Update Plan" : "Add Plan")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setEditingPlan(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Meal Plan</DialogTitle>
              </DialogHeader>
              <MealPlanForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-6 pb-6">
        {mealPlans.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <div className="text-center">
                <p className="text-muted-foreground">No meal plans found</p>
                <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                  Add Your First Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <p className="text-2xl font-bold text-primary mt-2">
                        Rp {plan.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          /meal
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {plan.image && (
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  {Array.isArray(plan.benefits) && plan.benefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.benefits.slice(0, 3).map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                        {plan.benefits.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.benefits.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Meal Plan</DialogTitle>
          </DialogHeader>
          <MealPlanForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}