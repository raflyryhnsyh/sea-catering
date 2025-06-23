import * as React from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ForgotPassword() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: PasswordFormValues) {
    console.log(data);
    setIsSubmitted(true);
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <LockIcon className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
              <AlertDescription>
                Your password has been successfully reset. You can now{" "}
                <Link to="/login" className="font-medium underline">
                  sign in
                </Link>{" "}
                with your new credentials.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type={isPasswordVisible ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground absolute top-0 right-0 h-full px-3 py-2"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                      <FormDescription>
                        Password must be at least 8 characters with uppercase,
                        lowercase, and number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type={
                              isConfirmPasswordVisible ? "text" : "password"
                            }
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground absolute top-0 right-0 h-full px-3 py-2"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            Toggle confirm password visibility
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
