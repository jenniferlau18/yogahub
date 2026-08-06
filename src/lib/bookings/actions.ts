"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function bookSession(sessionId: number) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  // 1. Check if session exists and has spots
  const { data: session } = await supabase
    .from("class_sessions")
    .select("id, available_spots, status, start_time")
    .eq("id", sessionId)
    .single();

  if (!session) return { error: "Session not found." };
  if (session.status === "cancelled") return { error: "This session has been cancelled." };
  if (session.available_spots <= 0) return { error: "Sorry, this session is fully booked." };

  // 2. Check for double-booking (relies on unique index)
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("student_id", user.id)
    .eq("session_id", sessionId)
    .neq("status", "cancelled")
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: "You already have a booking for this session." };
  }

  // 3. Create booking and decrement spots in a transaction-like flow
  const { error: bookingError } = await supabase.from("bookings").insert({
    student_id: user.id,
    session_id: sessionId,
    status: "confirmed",
  });

  if (bookingError) {
    // Check if it's a unique violation (double booking)
    if (bookingError.code === "23505") {
      return { error: "You already have a booking for this session." };
    }
    return { error: bookingError.message };
  }

  // 4. Decrement available spots
  const { error: updateError } = await supabase
    .from("class_sessions")
    .update({ available_spots: session.available_spots - 1 })
    .eq("id", sessionId);

  if (updateError) {
    // Rollback — unlikely but try to clean up
    await supabase.from("bookings").delete().eq("student_id", user.id).eq("session_id", sessionId);
    return { error: "Could not finalize booking. Please try again." };
  }

  revalidatePath("/my-bookings");
  return { success: true };
}

export async function cancelBooking(bookingId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in." };

  // Get the booking to find the session
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, session_id, status")
    .eq("id", bookingId)
    .eq("student_id", user.id)
    .single();

  if (!booking) return { error: "Booking not found." };
  if (booking.status === "cancelled") return { error: "Already cancelled." };

  // Get the session to increment spots
  const { data: session } = await supabase
    .from("class_sessions")
    .select("id, available_spots")
    .eq("id", booking.session_id)
    .single();

  // Cancel the booking
  const { error: cancelError } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (cancelError) return { error: cancelError.message };

  // Release the spot back
  if (session) {
    await supabase
      .from("class_sessions")
      .update({ available_spots: session.available_spots + 1 })
      .eq("id", session.id);
  }

  revalidatePath("/my-bookings");
  return { success: true };
}
