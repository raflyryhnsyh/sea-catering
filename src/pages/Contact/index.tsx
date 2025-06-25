import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const contactInfo = [
  {
    icon: MailIcon,
    title: "Email",
    description: "Our friendly team is here to help.",
    contact: "seacatering@gmail.com",
    href: "mailto:seacatering@gmail.com"
  },
  {
    icon: MessageCircle,
    title: "Manager",
    description: "Our manager is here to help.",
    contact: "Brian",
    href: "#"
  },
  {
    icon: MapPinIcon,
    title: "Office",
    description: "Come say hello at our office.",
    contact: "Jl. Sudirman No. 123\nJakarta 10220, Indonesia",
    href: "https://maps.google.com"
  },
  {
    icon: PhoneIcon,
    title: "Phone",
    description: "Mon-Fri from 8am to 5pm.",
    contact: "+62 812 345 6789",
    href: "tel:+628123456789"
  }
];

export default function Contact() {

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Simulate loading contact page data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccessPopup(true);
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading contact information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 pt-8 gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Chat to our friendly team
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              We'd love to hear from you. Please fill out this form or reach out through any of the contact methods below.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="group">
                  <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <info.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-semibold text-xl">{info.title}</h3>
                  <p className="my-2.5 text-muted-foreground">
                    {info.description}
                  </p>
                  <Link
                    className="font-medium text-primary hover:underline inline-block"
                    to={info.href}
                    target={info.href.startsWith('http') ? "_blank" : undefined}
                  >
                    {info.contact.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < info.contact.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      placeholder="First name"
                      id="firstName"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      placeholder="Last name"
                      id="lastName"
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    id="phone"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    placeholder="How can we help you?"
                    id="subject"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox id="acceptTerms" className="mt-1" required />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                    You agree to our{" "}
                    <Link to="#" className="underline text-primary hover:no-underline">
                      terms and conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="underline text-primary hover:no-underline">
                      privacy policy
                    </Link>
                    .
                  </Label>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
            <p className="text-muted-foreground mb-6">
              We'll get back to you soon.
            </p>
            <Button onClick={closeSuccessPopup} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}