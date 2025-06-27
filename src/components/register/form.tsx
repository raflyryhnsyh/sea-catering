import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePasswords = () => {
    const newErrors = { password: "", confirmPassword: "" };

    if (formData.password.length < 8) {
      newErrors.password = "Password harus minimal 8 karakter";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (validatePasswords()) {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullname
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data) {
        setMessage("Registration successful! Please check your email to verify your account.");
        // Reset form
        setFormData({
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setMessage("");
    const { error } = await signInWithGoogle();

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to register to your account
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('successful')
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            value={formData.fullname}
            id="fullname"
            type="text"
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            value={formData.email}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={loading}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Create Password</Label>
          <Input
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            value={formData.password}
            id="create-password"
            type="password"
            required
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            value={formData.confirmPassword}
            id="confirm-password"
            type="password"
            required
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" disabled={loading} onClick={handleGoogleSignUp}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
            width="20"
            height="20"
            className="mr-2">
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-18.4-1.5-36.4-4.3-53.6H272v101.4h146.9c-6.3 34.1-25 62.9-53.5 82v68.2h86.5c50.5-46.5 81.6-115.1 81.6-198z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c72.4 0 133.2-23.9 177.6-64.8l-86.5-68.2c-24 16-54.5 25.3-91.1 25.3-69.9 0-129.3-47.2-150.5-110.5H33.4v69.3C77.3 477.2 167.6 544.3 272 544.3z"
            />
            <path
              fill="#FBBC04"
              d="M121.5 326.1c-10.3-30.1-10.3-62.5 0-92.6V164.2H33.4c-36.1 71.9-36.1 156.1 0 228.1l88.1-66.2z"
            />
            <path
              fill="#EA4335"
              d="M272 107.7c39.4 0 74.9 13.6 102.9 40.4l77.3-77.3C405 24.2 344.4 0 272 0 167.6 0 77.3 67.1 33.4 164.2l88.1 69.3C142.7 154.9 202.1 107.7 272 107.7z"
            />
          </svg>
          Sign Up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </form>
  );
}