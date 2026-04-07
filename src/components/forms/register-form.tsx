"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { registerSchema, type RegisterSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          phone: values.phone,
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Registration successful. Please verify your email.");
    router.push("/login");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Full name</label>
        <Input {...form.register("fullName")} />
        <p className="mt-1 text-xs text-danger">
          {form.formState.errors.fullName?.message}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input type="email" {...form.register("email")} />
          <p className="mt-1 text-xs text-danger">{form.formState.errors.email?.message}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <Input {...form.register("phone")} />
          <p className="mt-1 text-xs text-danger">{form.formState.errors.phone?.message}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <Input type="password" {...form.register("password")} />
          <p className="mt-1 text-xs text-danger">
            {form.formState.errors.password?.message}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Confirm password</label>
          <Input type="password" {...form.register("confirmPassword")} />
          <p className="mt-1 text-xs text-danger">
            {form.formState.errors.confirmPassword?.message}
          </p>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
