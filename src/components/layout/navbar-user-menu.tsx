"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function NavbarUserMenu({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1"
      >
        {role === "owner" ? "🏠" : "🧘"} {userName.split(" ")[0]}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              👤 Profile
            </Link>
            <Link
              href="/my-bookings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              📅 My Bookings
            </Link>
            {role === "owner" && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                📊 Dashboard
              </Link>
            )}
            <hr className="my-1" />
            <form action={signOut}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
