import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { HashLink } from "react-router-hash-link";
import { Logo } from "../navbar/logo";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

const footerLinks = [
  {
    title: "Overview",
    to: "#overview",
  },
  {
    title: "Features",
    to: "#features",
  },
  {
    title: "Testimonials",
    to: "#testimonials",
  },
];

const Footer = () => {


  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccessPopup(true);
      // reset form
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <footer className="dark:border-t mt-40 dark bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div>
            {/* Logo */}
            <Logo />

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, to }) => (
                <li key={title}>
                  <HashLink
                    to={to}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Newsletter */}
          <div className="max-w-xs w-full">
            <h6 className="font-semibold">Stay up to date</h6>
            <form className="mt-6 flex items-center gap-2" onSubmit={handleSubmit}>
              <Input type="email" placeholder="Enter your email" required />
              <Button
                disabled={submitting}
                className="bg-amber-800"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 text-accent-foreground"></div>
                    Sending...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-center gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground text-center sm:text-start">
            &copy; {new Date().getFullYear()}{" "}
            <HashLink to="/" target="_blank">
              Sea Catering
            </HashLink>
            . All rights reserved.
          </span>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card text-card-foreground rounded-lg p-8 max-w-md w-full mx-4 text-center animate-in fade-in duration-300 border-2 border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" style={{ color: 'hsl(var(--success))' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Subscription Successful!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for subscribing to our newsletter!
              </p>
              <Button onClick={closeSuccessPopup} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
