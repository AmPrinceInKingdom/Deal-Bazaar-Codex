"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { UserProfile } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm({
  profile,
  userId,
  email,
}: {
  profile: UserProfile | null;
  userId: string;
  email?: string;
}) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("users").upsert({
      id: userId,
      full_name: fullName,
      phone,
      role: profile?.role ?? "customer",
    });
    setIsSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Profile updated");
  };

  return (
    <div className="surface p-6">
      <h2 className="text-xl font-bold">Profile Information</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input value={email ?? ""} disabled />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        <Button onClick={saveProfile} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
