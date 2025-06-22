import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function SubscriptionForm() {
  return (
    <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-8">
              {/* Profile section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="phone"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <Separator />
            </div>
          </form>
        </CardContent>
        <CardHeader>
          <CardTitle>Subscripton Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-8">
              {/* Subscription section */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Selection</Label>
                  <RadioGroup className="flex flex-row">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diet-plan" id="diet-plan" />
                        <Label htmlFor="diet-plan" className="text-sm font-medium">Diet Plan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="protein-plan" id="protein-plan" />
                        <Label htmlFor="protein-plan" className="text-sm font-medium">Protein Plan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="royal-plan" id="royal-plan" />
                        <Label htmlFor="royal-plan" className="text-sm font-medium">Royal Plan</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Meal Type</Label>
                  <div className="flex flex-row space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="breakfast" />
                      <Label htmlFor="breakfast" className="text-sm font-medium">Breakfast</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lunch" />
                      <Label htmlFor="lunch" className="text-sm font-medium">Lunch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dinner" />
                      <Label htmlFor="dinner" className="text-sm font-medium">Dinner</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="monday" />
                      <Label htmlFor="monday" className="text-sm font-medium">Monday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tuesday" />
                      <Label htmlFor="tuesday" className="text-sm font-medium">Tuesday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wednesday" />
                      <Label htmlFor="wednesday" className="text-sm font-medium">Wednesday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="thursday" />
                      <Label htmlFor="thursday" className="text-sm font-medium">Thursday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="friday" />
                      <Label htmlFor="friday" className="text-sm font-medium">Friday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="saturday" />
                      <Label htmlFor="saturday" className="text-sm font-medium">Saturday</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sunday" />
                      <Label htmlFor="sunday" className="text-sm font-medium">Sunday</Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select the days you want your meals delivered
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Let us know about any allergies or special requests.</Label>
                  <Textarea
                    id="note"
                    placeholder="Write a few sentences about yourself"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
