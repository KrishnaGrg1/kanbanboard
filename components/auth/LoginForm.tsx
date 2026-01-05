"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import loginSchema from "@/app/(auth)/login/schema";
import { useLogin } from "@/hooks/use-Auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorMessages from "../ErrorDisplay";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    login.mutate(data);
  };

  const isLoading = login.isPending;
  const isSubmitDisabled = isLoading || !form.formState.isValid;

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent border-none shadow-none">
      <CardHeader className="space-y-4 pb-6 pt-10">
        {/* Title */}
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Login to Kanban Board
        </CardTitle>

        {/* Description */}
        <CardDescription className="text-center text-gray-600 dark:text-gray-400 text-base">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-semibold underline underline-offset-2 transition-colors"
          >
            Sign up
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent shadow-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1.5" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Password
                    </FormLabel>
                    <Link
                      href="/forget-password"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent shadow-sm pr-11"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1.5" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full h-12 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-gray-200 text-white dark:text-gray-900 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-800 dark:disabled:to-gray-800 disabled:text-gray-500 dark:disabled:text-gray-600 font-semibold rounded-lg shadow-lg disabled:shadow-none transition-all duration-200 mt-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Error Messages */}
            {(form.formState.errors.root?.message || login.error?.message) && (
              <ErrorMessages
                errors={[
                  (form.formState.errors.root?.message ||
                    login.error?.message) as string,
                ]}
              />
            )}

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 leading-relaxed">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-gray-900 dark:text-white underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-gray-900 dark:text-white underline hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
