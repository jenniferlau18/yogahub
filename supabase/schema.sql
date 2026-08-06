-- =====================================================
-- YogaHub Database Schema
-- Copy this entire file into your Supabase SQL Editor
-- (SQL Editor is in the left sidebar of your Supabase dashboard)
-- =====================================================

-- ---------------------------------------------------
-- 1. PROFILES TABLE
-- Extends the built-in auth.users table with extra info
-- ---------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'owner', 'admin')) DEFAULT 'student',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------
-- 2. YOGA STYLES TABLE
-- Types of yoga offered (Hatha, Vinyasa, etc.)
-- ---------------------------------------------------
CREATE TABLE yoga_styles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed some common yoga styles
INSERT INTO yoga_styles (name, description) VALUES
  ('Hatha', 'A gentle, slow-paced practice focusing on basic postures and breathing. Great for beginners.'),
  ('Vinyasa', 'A dynamic, flowing practice that links breath with movement. Builds strength and flexibility.'),
  ('Ashtanga', 'A rigorous, structured sequence of postures. Physically demanding and disciplined.'),
  ('Yin', 'Deep, passive stretching held for longer periods. Targets connective tissues and promotes relaxation.'),
  ('Restorative', 'Gentle, supported poses using props. Deeply relaxing and healing.'),
  ('Power', 'A fitness-based, athletic style of yoga. Fast-paced and strength-building.'),
  ('Kundalini', 'Focuses on breath work, chanting, and meditation to awaken energy.'),
  ('Iyengar', 'Precision-focused practice using props like blocks and straps for proper alignment.'),
  ('Hot Yoga', 'Practiced in a heated room (35-40°C). Promotes flexibility and detoxification.'),
  ('Prenatal', 'Gentle practice designed for pregnant women. Focuses on breathing and pelvic floor strength.');

-- ---------------------------------------------------
-- 3. STUDIOS TABLE
-- Yoga studio listings from owners
-- ---------------------------------------------------
CREATE TABLE studios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  website TEXT,
  photos TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------
-- 4. CLASSES TABLE
-- Class templates that studios offer
-- ---------------------------------------------------
CREATE TABLE classes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  studio_id BIGINT NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  style_id BIGINT REFERENCES yoga_styles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  capacity INT NOT NULL DEFAULT 15,
  duration_minutes INT NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------
-- 5. CLASS SESSIONS TABLE
-- Actual scheduled instances of classes (date + time)
-- ---------------------------------------------------
CREATE TABLE class_sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  available_spots INT NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'cancelled', 'completed')) DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------
-- 6. BOOKINGS TABLE
-- Students booking class sessions
-- ---------------------------------------------------
CREATE TABLE bookings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id BIGINT NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('confirmed', 'cancelled', 'attended')) DEFAULT 'confirmed',
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ
);

-- Prevent double-booking: one student can't book the same session twice
CREATE UNIQUE INDEX one_booking_per_session ON bookings (student_id, session_id) WHERE status != 'cancelled';

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- These rules control who can see and edit what
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE yoga_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES POLICIES ----
-- Everyone can read all profiles (so you can see studio names, etc.)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ---- YOGA STYLES POLICIES ----
-- Everyone can read yoga styles
CREATE POLICY "Yoga styles are viewable by everyone" ON yoga_styles
  FOR SELECT USING (true);

-- ---- STUDIOS POLICIES ----
-- Everyone can read all studios
CREATE POLICY "Studios are viewable by everyone" ON studios
  FOR SELECT USING (true);

-- Only the owner can create studios
CREATE POLICY "Owners can create studios" ON studios
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Only the owner can update their studio
CREATE POLICY "Owners can update own studios" ON studios
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only the owner can delete their studio
CREATE POLICY "Owners can delete own studios" ON studios
  FOR DELETE USING (auth.uid() = owner_id);

-- ---- CLASSES POLICIES ----
-- Everyone can read classes
CREATE POLICY "Classes are viewable by everyone" ON classes
  FOR SELECT USING (true);

-- Only the studio owner can manage classes
CREATE POLICY "Studio owners can create classes" ON classes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM studios WHERE studios.id = classes.studio_id AND studios.owner_id = auth.uid()
    )
  );

CREATE POLICY "Studio owners can update classes" ON classes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM studios WHERE studios.id = classes.studio_id AND studios.owner_id = auth.uid()
    )
  );

CREATE POLICY "Studio owners can delete classes" ON classes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM studios WHERE studios.id = classes.studio_id AND studios.owner_id = auth.uid()
    )
  );

-- ---- CLASS SESSIONS POLICIES ----
-- Everyone can read sessions
CREATE POLICY "Sessions are viewable by everyone" ON class_sessions
  FOR SELECT USING (true);

-- Only the studio owner can manage sessions
CREATE POLICY "Studio owners can create sessions" ON class_sessions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      JOIN studios ON studios.id = classes.studio_id
      WHERE classes.id = class_sessions.class_id AND studios.owner_id = auth.uid()
    )
  );

CREATE POLICY "Studio owners can update sessions" ON class_sessions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM classes
      JOIN studios ON studios.id = classes.studio_id
      WHERE classes.id = class_sessions.class_id AND studios.owner_id = auth.uid()
    )
  );

CREATE POLICY "Studio owners can delete sessions" ON class_sessions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM classes
      JOIN studios ON studios.id = classes.studio_id
      WHERE classes.id = class_sessions.class_id AND studios.owner_id = auth.uid()
    )
  );

-- ---- BOOKINGS POLICIES ----
-- Students can read their own bookings
CREATE POLICY "Students can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = student_id);

-- Studio owners can see bookings for their studio's sessions
CREATE POLICY "Owners can view bookings for their studios" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_sessions
      JOIN classes ON classes.id = class_sessions.class_id
      JOIN studios ON studios.id = classes.studio_id
      WHERE class_sessions.id = bookings.session_id AND studios.owner_id = auth.uid()
    )
  );

-- Students can book (create bookings) for themselves
CREATE POLICY "Students can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can cancel their own bookings (update status)
CREATE POLICY "Students can cancel own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = student_id);

-- Studio owners can update booking status (e.g., mark as attended)
CREATE POLICY "Owners can update bookings in their studios" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM class_sessions
      JOIN classes ON classes.id = class_sessions.class_id
      JOIN studios ON studios.id = classes.studio_id
      WHERE class_sessions.id = bookings.session_id AND studios.owner_id = auth.uid()
    )
  );
