// pages/ResetPassword.tsx
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Mail, LockIcon } from "lucide-react";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- 1) Schema validasi ---
const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[a-z]/, "Must include lowercase")
      .regex(/[0-9]/, "Must include number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must include special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ResetPassword() {
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // 1. Tambahkan cleanup untuk forms
  useEffect(() => {
    return () => {
      emailForm.reset();
      passwordForm.reset();
      setMessage(null);
    };
  }, []);

  useEffect(() => {
    // Cek URL parameters untuk token recovery
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
    const type = hashParams.get('type') || searchParams.get('type');
    const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

    console.log('URL Params:', { accessToken, refreshToken, type, errorDescription }); // Debug

    // Jika ada error dari Supabase
    if (errorDescription) {
      setMessage(`Error: ${errorDescription}`);
      return;
    }

    // Jika type adalah recovery dan ada access token
    if (type === 'recovery' && accessToken) {
      console.log('Recovery mode detected'); // Debug

      // Set session dari token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({ error }) => {
        if (error) {
          console.error('Session error:', error);
          setMessage('Link reset tidak valid atau sudah expired.');
        } else {
          console.log('Session set successfully');
          setIsRecovery(true);
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session); // Debug log

      if (event === "PASSWORD_RECOVERY" || event === "TOKEN_REFRESHED") {
        console.log('Password recovery event detected');
        setIsRecovery(true);
      }

      if (event === "SIGNED_OUT") {
        setIsRecovery(false);
        setMessage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Perbaiki onEmailSubmit dengan redirectTo yang lebih spesifik
  const onEmailSubmit = emailForm.handleSubmit(async ({ email }) => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Link reset telah dikirim ke email Anda. Silakan cek kotak masuk.");
        setDone(true);
      }
    } catch (err) {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  });

  // Tambahkan try-catch untuk onPasswordSubmit
  const onPasswordSubmit = passwordForm.handleSubmit(async ({ password }) => {
    setLoading(true);
    setMessage(null);

    try {
      // Pastikan user sudah login/authenticated sebelum update password
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Session tidak valid. Silakan gunakan link reset terbaru.");
        setIsRecovery(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Update password error:', error);
        setMessage(error.message);
      } else {
        setMessage("Password berhasil di-reset! Anda akan diarahkan ke halaman login.");
        setDone(true);

        // Sign out user dan redirect ke login setelah 3 detik
        setTimeout(async () => {
          await supabase.auth.signOut();
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      console.error('Password update error:', err);
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  });


  // toggle visibility
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {isRecovery ? (
              <LockIcon className="h-6 w-6 text-primary" />
            ) : (
              <Mail className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle>
            {isRecovery ? "Reset Password" : "Forgot Password"}
          </CardTitle>
          <CardDescription>
            {isRecovery
              ? "Masukkan password baru Anda"
              : "Masukkan email untuk menerima link reset"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {message && (
            <Alert
              className={
                /berhasil|dikirim/i.test(message)
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {done ? (
            <p className="text-center">
              <Link to="/login" className="text-primary underline">
                Kembali ke halaman login
              </Link>
            </p>
          ) : !isRecovery ? (
            <Form {...emailForm}>
              <form onSubmit={onEmailSubmit} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={loading}>
                  {loading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={onPasswordSubmit} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Silakan masukkan password baru Anda.
                </p>
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPwd ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPwd((v) => !v)}
                        >
                          {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirm ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirm((v) => !v)}
                        >
                          {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={loading}>
                  {loading ? "Memproses..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Sudah ingat password?{" "}
            <Link to="/login" className="underline text-primary">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
