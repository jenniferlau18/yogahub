"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  userId: string;
  initialData: {
    full_name: string;
    phone: string;
    role: string;
  };
  userEmail: string;
};

export function ProfileForm({ userId, initialData, userEmail }: Props) {
  const [fullName, setFullName] = useState(initialData.full_name);
  const [phone, setPhone] = useState(initialData.phone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("id", userId);

    if (error) {
      setMessage("❌ Failed to save. Please try again.");
    } else {
      setMessage("✅ Profile updated!");
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Info</CardTitle>
        <CardDescription>
          {initialData.role === "owner" ? "🏠 Studio Owner" : "🧘 Student"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={userEmail} disabled className="bg-gray-50" />
          <p className="text-xs text-gray-400">Email cannot be changed</p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+65 9123 4567"
          />
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-sm p-3 rounded-md ${
              message.startsWith("✅")
                ? "text-green-600 bg-green-50"
                : "text-red-500 bg-red-50"
            }`}
          >
            {message}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => signOut()}
          className="text-gray-500"
        >
          Sign Out
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#7C9082] hover:bg-[#6B7D71]"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
