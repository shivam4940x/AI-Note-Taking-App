"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "@/lib/validation/auth.zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";
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

        if (res.error) {
          toast.error(res.error.message);
          return;
        }

        toast.success("Signed in");
        router.push("/");
        return;
      }

      if (mode === "signup") {
        if (!("username" in data) || !data.username?.trim()) {
          toast.error("Username is required");
          return;
        }

        const res = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.username,
        });

        if (res.error) {
          toast.error(res.error.message);
          return;
        }

        toast.success("Account created");
        await fetch("/api/notes/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Welcome 👋",
            content: `
<h2>Welcome to your notes! 👋</h2>

<p>Here are a few things you can try:</p>

<ul>
  <li>Write your thoughts</li>
  <li>Organize notes and ideas</li>
  <li>Use AI to summarize or improve content</li>
  <li>Generate tags automatically</li>
</ul>

<p>Go ahead, try summarizing this note yourself! 🚀</p>

      `.trim(),
          }),
        })
          .catch((error) => {
            console.error("Error creating welcome note:", error);
          })
          .finally(() => {
            router.push("/");
          });
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const session = await authClient.getSession();
      if (session.data) {
        // router.push("/");
      }
    };
    fetchData();
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="w-full max-w-sm p-6 bg-neutral-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div>
              <input
                {...register("username")}
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
              />
              {"username" in errors && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.username?.message}
                </p>
              )}
            </div>
          )}

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 disabled:opacity-50 hover:bg-purple-700 text-white font-medium rounded transition"
          >
            {loading ? (
              <div className="flex gap-2 w-full items-center justify-center">
                Please wait... <Loading />
              </div>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          disabled={loading}
          className="mt-4 w-full text-sm text-purple-400 hover:underline text-center disabled:opacity-50"
        >
          {mode === "signin" ? "Need an account?" : "Already have one?"}
        </button>
      </div>
    </div>
  );
}
