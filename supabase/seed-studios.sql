-- =============================================================
-- YogaHub — Real Hong Kong Yoga Studios Seed Data
-- 
-- HOW TO RUN:
-- 1. Go to https://supabase.com/dashboard/project/dgjsyvgagwbzrsfwsxzj
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file
-- 5. Click "Run"
-- =============================================================

-- STEP 1: Update your profile to studio owner role
UPDATE profiles SET role = 'owner'
WHERE id = 'd9d52fc3-ea51-4c42-ad2b-e343ea77011b'
AND NOT EXISTS (SELECT 1 FROM studios WHERE owner_id = 'd9d52fc3-ea51-4c42-ad2b-e343ea77011b');

-- STEP 2: Only run inserts if studios don't exist yet
DO $$
DECLARE
  owner_uid UUID := 'd9d52fc3-ea51-4c42-ad2b-e343ea77011b';
  studio_count INT;
  v_studio_id BIGINT;
BEGIN
  SELECT COUNT(*) INTO studio_count FROM studios WHERE owner_id = owner_uid;
  IF studio_count > 0 THEN
    RAISE NOTICE 'Studios already exist (%). Delete them first to re-seed.', studio_count;
    RETURN;
  END IF;

  -- ---- YOGA MOVEMENT ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Yoga Movement',
    'Modern studio inspired by natural elements, offering dynamic classes including Resistance Yoga and HIIT Yoga. Beautifully designed spaces with thoughtful amenities to elevate your wellness routine.',
    '16/F, H Queens Building, 80 Queens Road Central, Central',
    'Central', 22.2833, 114.1558, '9169 6799', 'https://www.yogamovement.com',
    ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
    ARRAY['Showers', 'Changing Rooms', 'Mats Provided', 'Lockers'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Resistance Yoga', 'Build strength using resistance bands integrated into yoga flow', 6, 'intermediate', 60, 250),
    (v_studio_id, 'HIIT Yoga', 'High-intensity interval training blended with yoga poses', 6, 'advanced', 45, 280),
    (v_studio_id, 'Zen Flow', 'Calming, slow-paced flow to restore balance and peace', 5, 'beginner', 60, 200),
    (v_studio_id, 'Hot Power', 'Powerful flow in a heated room to detoxify and build strength', 9, 'intermediate', 60, 260);

  -- ---- IKIGAI ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'IKIGAI Yoga & Meditation',
    'Over 250 group classes per week across 3 studios, taught by 20+ teachers in English and Cantonese. Six class categories: Relax, Energise, Strengthen, Align, Meditate, and Warm/Hot.',
    'Multiple locations: Central, Causeway Bay, Tsim Sha Tsui',
    'Central', 22.2810, 114.1560, '9013 3701', 'https://www.ikigai.hk',
    ARRAY['https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800'],
    ARRAY['Showers', 'Infrared Sauna', 'Mats Provided', 'Lockers', 'Meditation Room'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Warm Vinyasa', 'Dynamic vinyasa flow in a gently heated room', 2, 'intermediate', 60, 220),
    (v_studio_id, 'Yin & Sound', 'Deep yin stretches accompanied by live sound healing', 4, 'beginner', 75, 250),
    (v_studio_id, 'Aerial Yoga', 'Traditional yoga poses using aerial silk hammocks', 1, 'intermediate', 60, 300),
    (v_studio_id, 'Mindfulness Meditation', 'Guided meditation for mental clarity and stress reduction', 5, 'beginner', 45, 180);

  -- ---- PURE YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'PURE Yoga',
    'Hong Kongs leading yoga studio with 11 locations across the city. Internationally-renowned teachers, state-of-the-art facilities, and a wide range of classes.',
    'Multiple locations across Hong Kong Island and Kowloon',
    'Central', 22.2825, 114.1565, '2971 0055', 'https://www.pure-yoga.com',
    ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
    ARRAY['Showers', 'Towels', 'Mats Provided', 'Lockers', 'Cafe'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Hot Hatha', 'Classic Hatha postures in a heated studio for deep detoxification', 9, 'intermediate', 60, 280),
    (v_studio_id, 'Wall Rope Yoga', 'Use wall ropes for traction, alignment, and deeper stretches', 8, 'intermediate', 75, 320),
    (v_studio_id, 'Aerial Flow', 'Dynamic aerial yoga combining silk hammocks with flowing sequences', 1, 'intermediate', 60, 300),
    (v_studio_id, 'Yogalates', 'Fusion of yoga and Pilates for core strength and flexibility', 1, 'intermediate', 60, 250),
    (v_studio_id, 'Prenatal Yoga', 'Gentle yoga for expecting mothers — safe poses for all trimesters', 10, 'beginner', 60, 220);

  -- ---- BE EARTH YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Be Earth Yoga',
    'Sustainable yoga studio with bamboo flooring, soft lighting, and natural-material mats. Small classes for different levels and styles. $550 for 10 days of unlimited yoga.',
    '2/F, On Building, 162 Queens Road Central, Central',
    'Central', 22.2840, 114.1545, '2833 5323', 'https://beearthyoga.com',
    ARRAY['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800'],
    ARRAY['Mats Provided', 'Changing Rooms', 'Eco-Friendly Materials'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Alignment Flow', 'Focus on proper alignment in each pose with mindful transitions', 1, 'beginner', 60, 180),
    (v_studio_id, 'Heated Stretch', 'Deep stretching in a gently heated room for maximum flexibility', 9, 'beginner', 60, 200),
    (v_studio_id, 'AntiGravity Yoga', 'Zero-compression inversions and floating poses using hammocks', 1, 'intermediate', 60, 280);

  -- ---- FLOWGA STUDIO ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Flowga Studio',
    'Hong Kongs first beat-driven, candlelit hot yoga studio in Lan Kwai Fong. Infrared tech panels keep the air at 35-40°C without dryness. Open-level classes welcome everyone.',
    'Unit F, 1/F, Winner Building, 37 D''Aguilar Street, Central',
    'Central', 22.2805, 114.1550, '9129 1366', 'https://flowga-studio.squarespace.com',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800'],
    ARRAY['Hot Yoga Room', 'Infrared Heating', 'Showers', 'Changing Rooms'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Hot Vinyasa', 'Beat-driven vinyasa flow in infrared-heated candlelit studio', 9, 'intermediate', 60, 300),
    (v_studio_id, 'Hot Core Flow', 'Core-focused hot yoga session to strengthen and sculpt', 9, 'advanced', 45, 280),
    (v_studio_id, 'Candlelight Yin', 'Slow, meditative yin practice by candlelight', 4, 'beginner', 60, 220);

  -- ---- THE YOGA ROOM ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'The Yoga Room',
    'Boutique studio in Sheung Wan running for 15+ years. 100+ classes per week across 4 floors. Hatha, Vinyasa, hot yoga, anti-gravity, prenatal, Chair Yoga, mat Pilates, TRX.',
    '3/F, 4/F, 6/F & 16/F, Xiu Ping Commercial Building, 104 Jervois Street, Sheung Wan',
    'Sheung Wan', 22.2855, 114.1515, '6685 9097', 'https://www.yogaroomhk.com',
    ARRAY['https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800'],
    ARRAY['Showers', 'Mats Provided', 'Lockers', 'TRX Equipment', 'Pilates Equipment'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Morning Hatha', 'Energizing morning Hatha practice to start your day', 1, 'beginner', 60, 180),
    (v_studio_id, 'Hot Flow', 'Dynamic flow in a heated room — sweat, stretch, and strengthen', 9, 'intermediate', 60, 250),
    (v_studio_id, 'TRX Yoga', 'Yoga poses enhanced with TRX suspension training', 6, 'intermediate', 45, 280),
    (v_studio_id, 'Prenatal Gentle', 'Nurturing yoga for pregnancy — gentle poses and breathing', 10, 'beginner', 60, 220);

  -- ---- YOGA BAGEL ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Yoga Bagel',
    'Small, laid-back studio in Sheung Wan with intimate class sizes. Hatha, core, Ashtanga, power, wheel, mobility and strength, hips and hamstring, and singing bowl sessions.',
    '3/F, 59 Wing Lok Street, Sheung Wan',
    'Sheung Wan', 22.2860, 114.1520, '9298 1851', 'https://www.yogabagel.com',
    ARRAY['https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800'],
    ARRAY['Mats Provided', 'Singing Bowls', 'Changing Rooms'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Power Hour', 'One hour of powerful asana practice to build strength and stamina', 6, 'intermediate', 60, 220),
    (v_studio_id, 'Core & Restore', 'Half core work, half restorative yoga — the best of both worlds', 5, 'beginner', 60, 200),
    (v_studio_id, 'Wheel Yoga', 'Use the yoga wheel to deepen backbends and open the heart', 1, 'intermediate', 60, 250);

  -- ---- ANAHATA YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Anahata Yoga',
    'Long-established yoga therapy studio with programmes for back care, core yoga, and slimming. Small group classes with personal attention to form and posture.',
    '20/F, One Lyndhurst Tower, 1 Lyndhurst Terrace, Central',
    'Central', 22.2820, 114.1540, '2905 1822', 'https://anahatayoga.com.hk',
    ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'],
    ARRAY['Mats Provided', 'Online Classes', 'Equipment Shop', 'Changing Rooms'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Back Care Yoga', 'Therapeutic yoga for back pain relief and spinal health', 8, 'beginner', 60, 250),
    (v_studio_id, 'Core Yoga', 'Strengthen your core with targeted yoga sequences', 6, 'intermediate', 45, 220),
    (v_studio_id, 'Slimming Yoga', 'Dynamic sequences designed for weight management and toning', 2, 'intermediate', 60, 230);

  -- ---- XYZ STUDIO ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'XYZ Studio',
    'Luxury boutique fitness studio with candlelit Cocoon room for beginner-friendly classes and Mycelium room for advanced dynamic practices. Also famed for spin classes.',
    '12/F, China Building, 29 Queens Road Central, Central',
    'Central', 22.2830, 114.1565, '2865 0999', 'https://www.youarexyz.com',
    ARRAY['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'],
    ARRAY['Candlelit Studio', 'Showers', 'Towels', 'Lockers', 'Premium Amenities'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Cocoon Hatha', 'Beginner-friendly Hatha in the candlelit Cocoon room', 1, 'beginner', 60, 280),
    (v_studio_id, 'Handstand Workshop', 'Learn handstand technique in a supportive small group', 6, 'advanced', 90, 350),
    (v_studio_id, 'Mycelium Flow', 'Advanced dynamic vinyasa in the Mycelium room', 2, 'advanced', 60, 300);

  -- ---- ONE YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'One Yoga Studio',
    'Believes yoga is for everyone — a journey to self-discovery. Various styles across Central, Tsim Sha Tsui and North Point. RYT200 Teacher Training course available.',
    'Multiple locations: Central, Tsim Sha Tsui, North Point',
    'Central', 22.2790, 114.1555, '6365 6124', 'https://www.oneyoga-studio.com',
    ARRAY['https://images.unsplash.com/photo-1593164842264-854604db2260?w=800'],
    ARRAY['Mats Provided', 'Changing Rooms', 'Teacher Training'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Relaxing Stretch', 'Gentle stretching class to release tension and improve flexibility', 5, 'beginner', 60, 180),
    (v_studio_id, 'Aerial Stretch', 'Use the aerial hammock for deep, supported stretching', 1, 'beginner', 60, 280),
    (v_studio_id, 'RYT200 Prep Flow', 'Vinyasa flow class aligned with teacher training curriculum', 2, 'intermediate', 75, 250);

  -- ---- FLEX STUDIO ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Flex Studio',
    'Hong Kongs only Classical Pilates and Xtend Barre licensed studio, also offering Hatha, Power Sculpt, back care yoga and stretch sessions. Running for 15+ years.',
    'Shop 2205 & 2209, 22/F, One Island South, 2 Heung Yip Road, Wong Chuk Hang',
    'Wong Chuk Hang', 22.2480, 114.1680, '2813 2212', 'https://flexhk.com',
    ARRAY['https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'],
    ARRAY['Pilates Equipment', 'Showers', 'Mats Provided', 'Lockers'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Back Care Stretch', 'Stretch and release for back tension — holds poses longer', 5, 'beginner', 60, 220),
    (v_studio_id, 'Power Sculpt', 'Yoga-based strength and sculpting workout', 6, 'intermediate', 45, 250),
    (v_studio_id, 'Classical Pilates Mat', 'Traditional Pilates mat work for core strength and alignment', 8, 'intermediate', 55, 280);

  -- ---- MOVE STUDIO ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'MOVE Studio',
    'Women-owned boutique studio with patient, experienced instructors. Traditional yoga, dance, and fitness in uniquely designed signature classes.',
    '7/F, Parekh House, 63 Wyndham Street, Central',
    'Central', 22.2815, 114.1545, '6875 0732', 'https://www.movestudiohk.com',
    ARRAY['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'],
    ARRAY['Mats Provided', 'Changing Rooms', 'Dance Studio'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Flow & Tone', 'Vinyasa flow with bodyweight toning exercises', 2, 'intermediate', 60, 220),
    (v_studio_id, 'Signature Stretch', 'MOVE''s uniquely designed deep stretching experience', 5, 'beginner', 60, 200);

  -- ---- SOW YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'SOW Yoga',
    'Floor-to-ceiling windows with views of Tai Hangs Lin Fa Kung Temple. Gentle relaxation yoga alongside intensive Hatha, flow and core styles.',
    '2/F, The Lane House at Little Tai Hang, 11 Lin Fa Kung Street East, Tai Hang',
    'Tai Hang', 22.2785, 114.1925, '6810 2092', 'https://www.sow-yoga.com',
    ARRAY['https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800'],
    ARRAY['Mats Provided', 'Changing Rooms', 'Natural Light'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Gentle Relaxation', 'Wind down with gentle yoga — perfect after a long day', 5, 'beginner', 60, 200),
    (v_studio_id, 'Core & Flow', 'Build core strength with flowing vinyasa sequences', 2, 'intermediate', 60, 220);

  -- ---- SUKHA YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'SUKHA Yoga & Wellness',
    'Schedule designed for busy professionals — classes primarily at lunchtime and after work. Aerial, Backbend and Inversion yoga for experienced practitioners.',
    '5/F, Kai Kwong House, 13 Wyndham Street, Central',
    'Central', 22.2810, 114.1550, '9011 4133', 'https://www.sukhahk.com',
    ARRAY['https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800'],
    ARRAY['Aerial Yoga', 'Mats Provided', 'Showers', 'Changing Rooms'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Lunchtime Flow', '45-minute flow designed for the lunch break', 2, 'beginner', 45, 180),
    (v_studio_id, 'Backbend & Inversion', 'Progressive backbend and inversion practice for experienced yogis', 2, 'advanced', 75, 280);

  -- ---- KITA YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Kita Yoga',
    'Intimate Vinyasa-focused studio at The Upper House. Small classes from beginner foundations to Kita Sculpt. Private lessons available.',
    'Sky Lounge, The Upper House, 88 Queensway, Admiralty',
    'Admiralty', 22.2765, 114.1650, '9159 6190', 'https://kita-yoga.com',
    ARRAY['https://images.unsplash.com/photo-1593810450967-f9dfc0e44b4a?w=800'],
    ARRAY['Mats Provided', 'Luxury Amenities', 'Private Sessions'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Foundations Vinyasa', 'Learn the building blocks of vinyasa yoga', 2, 'beginner', 60, 300),
    (v_studio_id, 'Kita Sculpt', 'High-intensity yoga sculpt using bodyweight and light weights', 6, 'advanced', 45, 350);

  -- ---- STUDIO LA LUNE ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Studio La Lune',
    'A yoga studio built for women. Specialised classes including Yoga for Menstrual Health, prenatal and postnatal yoga, aerial yoga, and sound healing.',
    '4/F, Kai Kwong House, 13 Wyndham Street, Central',
    'Central', 22.2810, 114.1550, '9226 8464', 'https://studiolalunehk.com',
    ARRAY['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800'],
    ARRAY['Aerial Yoga', 'Mats Provided', 'Sound Healing', 'Women-Only Space'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Menstrual Health Yoga', 'Yoga poses and breathing to support your monthly cycle', 5, 'beginner', 60, 220),
    (v_studio_id, 'Postnatal Recovery', 'Gentle yoga for new mothers — rebuild core and pelvic strength', 10, 'beginner', 60, 250),
    (v_studio_id, 'Aerial Sound Bath', 'Floating sound healing in aerial hammocks', 4, 'beginner', 60, 300);

  -- ---- PRAJNA YOGA ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Prajna Yoga',
    'Award-winning yoga studio in Lai Chi Kok with classes capped at 18 students. Fully equipped with showers, lockers, and a yoga boutique. Teacher training available.',
    'Shop 2, 3/F, Sing Shun Centre, 495 Castle Peak Road, Lai Chi Kok',
    'Lai Chi Kok', 22.3360, 114.1470, '6699 6601', 'https://prajna-yoga.com',
    ARRAY['https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800'],
    ARRAY['Showers', 'Lockers', 'Yoga Boutique', 'Mats Provided'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Ashtanga Led', 'Traditional Ashtanga primary series — led with full instruction', 3, 'intermediate', 90, 300),
    (v_studio_id, 'Yin Yang', 'Half dynamic yang flow, half restorative yin', 4, 'beginner', 75, 220);

  -- ---- LEMON DROP STUDIO ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Lemon Drop Studio',
    'Boutique yoga studio in Sai Wan with excellent teachers and a friendly community. Natural light-filled space offering HIIT, Hatha yoga, and Pilates.',
    'Room 2515, Hong Kong Plaza, 188 Connaught Road West, Sai Wan',
    'Sai Wan', 22.2870, 114.1380, '', 'https://www.ldshk.com',
    ARRAY['https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'],
    ARRAY['Mats Provided', 'Pilates Equipment', 'Changing Rooms', 'Natural Light'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'HIIT & Flow', 'High-intensity intervals mixed with yoga flow for recovery', 6, 'intermediate', 45, 200),
    (v_studio_id, 'Hatha Foundations', 'Classic Hatha — perfect for beginners learning the basics', 1, 'beginner', 60, 180);

  -- ---- SANTI SPACE ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'Santi Space',
    'Cosy boutique yoga studio in Wan Chai focused on mental health through yoga. Mindfulness Yin, Aerial Stretch, Meridian Yoga Therapy, and specialised workshops.',
    '5A, Lockhart Centre, 301-307 Lockhart Road, Wan Chai',
    'Wan Chai', 22.2780, 114.1740, '', 'https://www.santispacehk.com',
    ARRAY['https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800'],
    ARRAY['Aerial Yoga', 'Mats Provided', 'Natural Light', 'Workshop Space'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Mindfulness Yin', 'Deep yin stretches with mindfulness meditation woven throughout', 4, 'beginner', 60, 200),
    (v_studio_id, 'Meridian Yoga Therapy', 'Yoga targeting meridian lines — a Traditional Chinese Medicine approach', 8, 'beginner', 75, 250);

  -- ---- THE BREATHING HOUSE ----
  INSERT INTO studios (owner_id, name, description, address, city, latitude, longitude, phone, website, photos, amenities)
  VALUES (owner_uid, 'The Breathing House',
    'Yoga studio focused on breathwork and meditation in Tsuen Wan. Hatha and Wheel Yoga classes. Deep Stretch and Back Care sessions for flexibility and strength.',
    'Wing Hing Industrial Building, 83-93 Chai Wan Kok Street, Tsuen Wan',
    'Tsuen Wan', 22.3710, 114.1130, '', 'https://www.facebook.com/thebreathinghousehk/',
    ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'],
    ARRAY['Mats Provided', 'Breathwork Focus', 'Changing Rooms'])
  RETURNING id INTO v_studio_id;
  INSERT INTO classes (studio_id, name, description, style_id, difficulty, duration_min, price) VALUES
    (v_studio_id, 'Breath & Hatha', 'Hatha yoga with special emphasis on pranayama breathing techniques', 1, 'beginner', 60, 150),
    (v_studio_id, 'Wheel & Stretch', 'Yoga wheel-assisted backbends and deep opening stretches', 4, 'intermediate', 60, 200);

  RAISE NOTICE '✅ Done! 20 studios with 60 classes inserted.';
END $$;
