import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, loading } = useAuth();

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await signIn(email, password);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      setMessage("Login successful!");
      navigate("/dashboard");
    }
  }

  const handleGoogleSignIn = async () => {
    setMessage("");
    const { error } = await signInWithGoogle();

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
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
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={loading}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="password"
            type="password"
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" disabled={loading} onClick={handleGoogleSignIn}>
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
          Sign In with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign Up
        </Link>
      </div>
    </form>
  );
}