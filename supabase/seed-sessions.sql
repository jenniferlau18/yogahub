-- =============================================================
-- YogaHub — Generate Class Sessions (Aug 8 – Aug 28, 2026)
-- Run in Supabase SQL Editor
-- =============================================================

DO $$
DECLARE
  cls RECORD;
  session_date DATE;
  session_count INT;
  time_slot TIME;
  day_offset INT;
  current_dt TIMESTAMPTZ;
BEGIN
  -- Delete any existing sessions for these studios
  DELETE FROM class_sessions
  WHERE class_id IN (SELECT id FROM classes WHERE studio_id IN (
    SELECT id FROM studios WHERE owner_id = 'd9d52fc3-ea51-4c42-ad2b-e343ea77011b'
  ));

  FOR cls IN SELECT id, capacity, duration_minutes FROM classes LOOP
    -- Each class gets 3-6 sessions over the 3-week window
    session_count := 3 + floor(random() * 4)::INT;

    FOR i IN 1..session_count LOOP
      -- Random day offset (1-21 days from Aug 7)
      day_offset := 1 + floor(random() * 21)::INT;
      session_date := '2026-08-07'::DATE + day_offset;

      -- Pick a time slot based on the session number (morning, afternoon, evening)
      CASE (i % 3)
        WHEN 0 THEN time_slot := ('07:00'::TIME + (floor(random() * 4)::INT || ' hours')::INTERVAL);
        WHEN 1 THEN time_slot := ('12:00'::TIME + (floor(random() * 4)::INT || ' hours')::INTERVAL);
        WHEN 2 THEN time_slot := ('17:00'::TIME + (floor(random() * 3)::INT || ' hours')::INTERVAL);
      END CASE;

      current_dt := (session_date || ' ' || time_slot)::TIMESTAMPTZ AT TIME ZONE 'Asia/Hong_Kong';

      -- Skip if this would create a duplicate (same class + same start time)
      IF NOT EXISTS (
        SELECT 1 FROM class_sessions
        WHERE class_id = cls.id AND start_time = current_dt
      ) THEN
        INSERT INTO class_sessions (
          class_id,
          start_time,
          end_time,
          available_spots,
          status,
          created_at
        ) VALUES (
          cls.id,
          current_dt,
          current_dt + (cls.duration_minutes || ' minutes')::INTERVAL,
          cls.capacity,
          'scheduled',
          now()
        );
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE '✅ Sessions generated. Total: %',
    (SELECT count(*) FROM class_sessions);
END $$;
