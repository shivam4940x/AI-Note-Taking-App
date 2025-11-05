"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "@/lib/schema/auth.zod";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/utils/loading";

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;
type FormData = LoginForm | SignupForm;

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(mode === "signin" ? loginSchema : signupSchema),
  });

  useEffect(() => {
    reset({});
  }, [mode, reset]);

  async function onSubmit(data: FormData) {
    setLoading(true);

    try {
      if (mode === "signin") {
        const res = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

        if (res.error) return toast.error(res.error.message);

        toast.success("Signed in");
        router.push("/");
        return;
      }

      if (!("username" in data) || !data.username?.trim()) {
        return toast.error("Username is required");
      }

      const res = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
      });

      if (res.error) return toast.error(res.error.message);

      toast.success("Account created");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? ""
              : "Create a new account to get started."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            {mode === "signup" && (
              <div className="space-y-1">
                <Input {...register("username")} placeholder="Username" />
                {"username" in errors && (
                  <p className="text-red-500 text-xs">
                    {errors.username?.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <Input {...register("email")} placeholder="Email" type="email" />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                {...register("password")}
                placeholder="Password"
                type="password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" disabled={loading} className="w-full mt-5">
              {loading ? (
                <div className="flex gap-2 items-center">
                  Please wait <Loading />
                </div>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              className="text-sm w-full"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Need an account?" : "Already have one?"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
