/**
 * Seed script: Creates a demo studio owner and inserts real HK yoga studios.
 * Run: node supabase/seed-studios.js
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://dgjsyvgagwbzrsfwsxzj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnanN5dmdhZ3dienJzZndzeHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDEyNTcsImV4cCI6MjEwMTU3NzI1N30.SyUuNw0Br25qjfQfxTMlQXSqGAE4nTgP4Y9KfIErOsY"
);

const studios = [
  {
    name: "Yoga Movement",
    description: "Modern studio inspired by natural elements, offering dynamic classes including Resistance Yoga and HIIT Yoga. Beautifully designed spaces with thoughtful amenities to elevate your wellness routine.",
    address: "16/F, H Queen's Building, 80 Queens Road Central, Central",
    city: "Central",
    latitude: 22.2833,
    longitude: 114.1558,
    phone: "9169 6799",
    website: "https://www.yogamovement.com",
    photos: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"],
    amenities: ["Showers", "Changing Rooms", "Mats Provided", "Lockers"]
  },
  {
    name: "IKIGAI Yoga & Meditation",
    description: "Over 250 group classes per week across 3 studios, taught by 20+ teachers in English and Cantonese. Six class categories: Relax, Energise, Strengthen, Align, Meditate, and Warm/Hot. Private yoga, sound healing, infrared sauna, and 200-hour teacher training available.",
    address: "Multiple locations: Central, Causeway Bay, Tsim Sha Tsui",
    city: "Central",
    latitude: 22.2810,
    longitude: 114.1560,
    phone: "9013 3701",
    website: "https://www.ikigai.hk",
    photos: ["https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800"],
    amenities: ["Showers", "Infrared Sauna", "Mats Provided", "Lockers", "Meditation Room"]
  },
  {
    name: "PURE Yoga",
    description: "Hong Kong's leading yoga studio with 11 locations across the city. Internationally-renowned teachers, state-of-the-art facilities, and a wide range of classes including Reformer Pilates, aerial, hot, wall rope and Hatha yoga. Teacher training and corporate programmes available.",
    address: "Multiple locations across Hong Kong Island and Kowloon",
    city: "Central",
    latitude: 22.2825,
    longitude: 114.1565,
    phone: "2971 0055",
    website: "https://www.pure-yoga.com",
    photos: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800"],
    amenities: ["Showers", "Towels", "Mats Provided", "Lockers", "Cafe"]
  },
  {
    name: "Be Earth Yoga",
    description: "Sustainable yoga studio with bamboo flooring, soft lighting, and natural-material mats. Small classes for different levels and styles. $550 for 10 days of unlimited yoga — one of the best deals in Central.",
    address: "2/F, On Building, 162 Queen's Road Central, Central",
    city: "Central",
    latitude: 22.2840,
    longitude: 114.1545,
    phone: "2833 5323",
    website: "https://beearthyoga.com",
    photos: ["https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800"],
    amenities: ["Mats Provided", "Changing Rooms", "Eco-Friendly Materials"]
  },
  {
    name: "Flowga Studio",
    description: "Hong Kong's first beat-driven, candlelit hot yoga studio in Lan Kwai Fong. Infrared tech panels keep the air at 35-40°C without dryness. Open-level classes welcome everyone from beginners to seasoned yogis.",
    address: "Unit F, 1/F, Winner Building, 37 D'Aguilar Street, Central",
    city: "Central",
    latitude: 22.2805,
    longitude: 114.1550,
    phone: "9129 1366",
    website: "https://flowga-studio.squarespace.com",
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800"],
    amenities: ["Hot Yoga Room", "Infrared Heating", "Showers", "Changing Rooms"]
  },
  {
    name: "The Yoga Room",
    description: "Boutique studio in Sheung Wan running for 15+ years. 100+ classes per week across 4 floors — Hatha, Vinyasa, hot yoga, anti-gravity, prenatal, Chair Yoga, mat Pilates, TRX. First class free for new students.",
    address: "3/F, 4/F, 6/F & 16/F, Xiu Ping Commercial Building, 104 Jervois Street, Sheung Wan",
    city: "Sheung Wan",
    latitude: 22.2855,
    longitude: 114.1515,
    phone: "6685 9097",
    website: "https://www.yogaroomhk.com",
    photos: ["https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800"],
    amenities: ["Showers", "Mats Provided", "Lockers", "TRX Equipment", "Pilates Equipment"]
  },
  {
    name: "Yoga Bagel",
    description: "Small, laid-back studio in Sheung Wan with intimate class sizes. Passionate instructors covering Hatha, core, Ashtanga, power, wheel, mobility and strength, hips and hamstring, and singing bowl sessions.",
    address: "3/F, 59 Wing Lok Street, Sheung Wan",
    city: "Sheung Wan",
    latitude: 22.2860,
    longitude: 114.1520,
    phone: "9298 1851",
    website: "https://www.yogabagel.com",
    photos: ["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800"],
    amenities: ["Mats Provided", "Singing Bowls", "Changing Rooms"]
  },
  {
    name: "Anahata Yoga",
    description: "Long-established yoga therapy studio with programmes for back care, core yoga, and slimming. Small group classes with personal attention to form and posture. Online classes and equipment shop available.",
    address: "20/F, One Lyndhurst Tower, 1 Lyndhurst Terrace, Central",
    city: "Central",
    latitude: 22.2820,
    longitude: 114.1540,
    phone: "2905 1822",
    website: "https://anahatayoga.com.hk",
    photos: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"],
    amenities: ["Mats Provided", "Online Classes", "Equipment Shop", "Changing Rooms"]
  },
  {
    name: "XYZ Studio",
    description: "Luxury boutique fitness studio with candlelit Cocoon room for beginner-friendly and grounding classes (Hatha, Vinyasa, handstands) and Mycelium room for advanced dynamic practices. Also famed for spin classes.",
    address: "12/F, China Building, 29 Queen's Road Central, Central",
    city: "Central",
    latitude: 22.2830,
    longitude: 114.1565,
    phone: "2865 0999",
    website: "https://www.youarexyz.com",
    photos: ["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800"],
    amenities: ["Candlelit Studio", "Showers", "Towels", "Lockers", "Premium Amenities"]
  },
  {
    name: "One Yoga Studio",
    description: "Believes yoga is for everyone — a journey to self-discovery. Offering various styles across Central, Tsim Sha Tsui and North Point. RYT200 Teacher Training course available. Trial: 3 classes for $300.",
    address: "Multiple locations: Central, Tsim Sha Tsui, North Point",
    city: "Central",
    latitude: 22.2790,
    longitude: 114.1555,
    phone: "6365 6124",
    website: "https://www.oneyoga-studio.com",
    photos: ["https://images.unsplash.com/photo-1593164842264-854604db2260?w=800"],
    amenities: ["Mats Provided", "Changing Rooms", "Teacher Training"]
  },
  {
    name: "Flex Studio",
    description: "Hong Kong's only Classical Pilates and Xtend Barre licensed studio, also offering Hatha, Power Sculpt, back care yoga and stretch sessions. Small classes with multidisciplinary teaching approach. Running for 15+ years.",
    address: "Shop 2205 & 2209, 22/F, One Island South, 2 Heung Yip Road, Wong Chuk Hang (also Central: 3/F, 15-17 Wyndham Street)",
    city: "Wong Chuk Hang",
    latitude: 22.2480,
    longitude: 114.1680,
    phone: "2813 2212",
    website: "https://flexhk.com",
    photos: ["https://images.unsplash.com/photo-1545389336-cf090694435e?w=800"],
    amenities: ["Pilates Equipment", "Showers", "Mats Provided", "Lockers"]
  },
  {
    name: "MOVE Studio",
    description: "Women-owned boutique studio with patient, experienced instructors. Traditional yoga, dance, and fitness in uniquely designed signature classes. Small group sizes ensure guidance throughout.",
    address: "7/F, Parekh House, 63 Wyndham Street, Central",
    city: "Central",
    latitude: 22.2815,
    longitude: 114.1545,
    phone: "6875 0732",
    website: "https://www.movestudiohk.com",
    photos: ["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800"],
    amenities: ["Mats Provided", "Changing Rooms", "Dance Studio"]
  },
  {
    name: "SOW Yoga",
    description: "Floor-to-ceiling windows with views of Tai Hang's Lin Fa Kung Temple. Gentle relaxation yoga alongside intensive Hatha, flow and core styles. Trial: 2 classes for $400 or 5 for $800.",
    address: "2/F, The Lane House at Little Tai Hang, 11 Lin Fa Kung Street East, Tai Hang",
    city: "Tai Hang",
    latitude: 22.2785,
    longitude: 114.1925,
    phone: "6810 2092",
    website: "https://www.sow-yoga.com",
    photos: ["https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800"],
    amenities: ["Mats Provided", "Changing Rooms", "Natural Light"]
  },
  {
    name: "SUKHA Yoga & Wellness",
    description: "Schedule designed for busy professionals — classes primarily at lunchtime and after work. Aerial, Backbend and Inversion yoga for experienced practitioners; Relaxing Stretch for those needing to reset.",
    address: "5/F, Kai Kwong House, 13 Wyndham Street, Central",
    city: "Central",
    latitude: 22.2810,
    longitude: 114.1550,
    phone: "9011 4133",
    website: "https://www.sukhahk.com",
    photos: ["https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800"],
    amenities: ["Aerial Yoga", "Mats Provided", "Showers", "Changing Rooms"]
  },
  {
    name: "Kita Yoga",
    description: "Intimate Vinyasa-focused studio at The Upper House. Intentionally small classes from beginner foundations to Kita Sculpt. Private lessons available. Intro class $300, unlimited monthly from $2,000.",
    address: "Sky Lounge, The Upper House, 88 Queensway, Admiralty",
    city: "Admiralty",
    latitude: 22.2765,
    longitude: 114.1650,
    phone: "9159 6190",
    website: "https://kita-yoga.com",
    photos: ["https://images.unsplash.com/photo-1593810450967-f9dfc0e44b4a?w=800"],
    amenities: ["Mats Provided", "Luxury Amenities", "Private Sessions"]
  },
  {
    name: "Studio La Lune",
    description: "A yoga studio built for women. Specialised classes including Yoga for Menstrual Health, prenatal and postnatal yoga, aerial yoga, and sound healing. Supportive community in an intentionally designed space.",
    address: "4/F, Kai Kwong House, 13 Wyndham Street, Central",
    city: "Central",
    latitude: 22.2810,
    longitude: 114.1550,
    phone: "9226 8464",
    website: "https://studiolalunehk.com",
    photos: ["https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800"],
    amenities: ["Aerial Yoga", "Mats Provided", "Sound Healing", "Women-Only Space"]
  },
  {
    name: "Prajna Yoga",
    description: "Award-winning yoga studio in Lai Chi Kok with classes capped at 18 students. Fully equipped with showers, lockers, and a yoga boutique. Also offers comprehensive yoga teacher training programmes.",
    address: "Shop 2, 3/F, Sing Shun Centre, 495 Castle Peak Road, Lai Chi Kok",
    city: "Lai Chi Kok",
    latitude: 22.3360,
    longitude: 114.1470,
    phone: "6699 6601",
    website: "https://prajna-yoga.com",
    photos: ["https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800"],
    amenities: ["Showers", "Lockers", "Yoga Boutique", "Mats Provided"]
  },
  {
    name: "Lemon Drop Studio",
    description: "Boutique yoga studio in Sai Wan with excellent teachers and a friendly community. Natural light-filled space offering HIIT, Hatha yoga, and Pilates. Warm environment perfect for amateurs and beyond.",
    address: "Room 2515, Hong Kong Plaza, 188 Connaught Road West, Sai Wan",
    city: "Sai Wan",
    latitude: 22.2870,
    longitude: 114.1380,
    phone: "",
    website: "https://www.ldshk.com",
    photos: ["https://images.unsplash.com/photo-1545389336-cf090694435e?w=800"],
    amenities: ["Mats Provided", "Pilates Equipment", "Changing Rooms", "Natural Light"]
  },
  {
    name: "Santi Space",
    description: "Cosy boutique yoga studio in Wan Chai focused on mental health through yoga. Classes include Mindfulness Yin, Aerial Stretch, and Meridian Yoga Therapy. Workshops for specialized activities available.",
    address: "5A, Lockhart Centre, 301-307 Lockhart Road, Wan Chai",
    city: "Wan Chai",
    latitude: 22.2780,
    longitude: 114.1740,
    phone: "",
    website: "https://www.santispacehk.com",
    photos: ["https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800"],
    amenities: ["Aerial Yoga", "Mats Provided", "Natural Light", "Workshop Space"]
  },
  {
    name: "The Breathing House",
    description: "Yoga studio focused on breathwork and meditation in Tsuen Wan. Hatha and Wheel Yoga classes to improve mental and physical wellbeing. Deep Stretch and Back Care sessions for flexibility and strength.",
    address: "Wing Hing Industrial Building, 83-93 Chai Wan Kok Street, Tsuen Wan",
    city: "Tsuen Wan",
    latitude: 22.3710,
    longitude: 114.1130,
    phone: "",
    website: "https://www.facebook.com/thebreathinghousehk/",
    photos: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"],
    amenities: ["Mats Provided", "Breathwork Focus", "Changing Rooms"]
  }
];

const classes = [
  // Yoga Movement
  { name: "Resistance Yoga", description: "Build strength using resistance bands integrated into yoga flow", style_id: 6, difficulty: "intermediate", duration_min: 60 },
  { name: "HIIT Yoga", description: "High-intensity interval training blended with yoga poses", style_id: 6, difficulty: "advanced", duration_min: 45 },
  { name: "Zen Flow", description: "Calming, slow-paced flow to restore balance and peace", style_id: 5, difficulty: "beginner", duration_min: 60 },
  { name: "Hot Power", description: "Powerful flow in a heated room to detoxify and build strength", style_id: 9, difficulty: "intermediate", duration_min: 60 },

  // IKIGAI
  { name: "Warm Vinyasa", description: "Dynamic vinyasa flow in a gently heated room", style_id: 2, difficulty: "intermediate", duration_min: 60 },
  { name: "Yin & Sound", description: "Deep yin stretches accompanied by live sound healing", style_id: 4, difficulty: "beginner", duration_min: 75 },
  { name: "Aerial Yoga", description: "Traditional yoga poses using aerial silk hammocks", style_id: 1, difficulty: "intermediate", duration_min: 60 },
  { name: "Mindfulness Meditation", description: "Guided meditation for mental clarity and stress reduction", style_id: 5, difficulty: "beginner", duration_min: 45 },

  // PURE Yoga
  { name: "Hot Hatha", description: "Classic Hatha postures in a heated studio for deep detoxification", style_id: 9, difficulty: "intermediate", duration_min: 60 },
  { name: "Wall Rope Yoga", description: "Use wall ropes for traction, alignment, and deeper stretches", style_id: 8, difficulty: "intermediate", duration_min: 75 },
  { name: "Aerial Flow", description: "Dynamic aerial yoga combining silk hammocks with flowing sequences", style_id: 1, difficulty: "intermediate", duration_min: 60 },
  { name: "Yogalates", description: "Fusion of yoga and Pilates for core strength and flexibility", style_id: 1, difficulty: "intermediate", duration_min: 60 },
  { name: "Prenatal Yoga", description: "Gentle yoga for expecting mothers — safe poses for all trimesters", style_id: 10, difficulty: "beginner", duration_min: 60 },

  // Be Earth
  { name: "Alignment Flow", description: "Focus on proper alignment in each pose with mindful transitions", style_id: 1, difficulty: "beginner", duration_min: 60 },
  { name: "Heated Stretch", description: "Deep stretching in a gently heated room for maximum flexibility", style_id: 9, difficulty: "beginner", duration_min: 60 },
  { name: "AntiGravity Yoga", description: "Zero-compression inversions and floating poses using hammocks", style_id: 1, difficulty: "intermediate", duration_min: 60 },

  // Flowga
  { name: "Hot Vinyasa", description: "Beat-driven vinyasa flow in infrared-heated candlelit studio", style_id: 9, difficulty: "intermediate", duration_min: 60 },
  { name: "Hot Core Flow", description: "Core-focused hot yoga session to strengthen and sculpt", style_id: 9, difficulty: "advanced", duration_min: 45 },
  { name: "Candlelight Yin", description: "Slow, meditative yin practice by candlelight", style_id: 4, difficulty: "beginner", duration_min: 60 },

  // The Yoga Room
  { name: "Morning Hatha", description: "Energizing morning Hatha practice to start your day", style_id: 1, difficulty: "beginner", duration_min: 60 },
  { name: "Hot Flow", description: "Dynamic flow in a heated room — sweat, stretch, and strengthen", style_id: 9, difficulty: "intermediate", duration_min: 60 },
  { name: "TRX Yoga", description: "Yoga poses enhanced with TRX suspension training", style_id: 6, difficulty: "intermediate", duration_min: 45 },
  { name: "Prenatal Gentle", description: "Nurturing yoga for pregnancy — gentle poses and breathing", style_id: 10, difficulty: "beginner", duration_min: 60 },

  // Yoga Bagel
  { name: "Power Hour", description: "One hour of powerful asana practice to build strength and stamina", style_id: 6, difficulty: "intermediate", duration_min: 60 },
  { name: "Core & Restore", description: "Half core work, half restorative yoga — the best of both worlds", style_id: 5, difficulty: "beginner", duration_min: 60 },
  { name: "Wheel Yoga", description: "Use the yoga wheel to deepen backbends and open the heart", style_id: 1, difficulty: "intermediate", duration_min: 60 },

  // Anahata
  { name: "Back Care Yoga", description: "Therapeutic yoga for back pain relief and spinal health", style_id: 8, difficulty: "beginner", duration_min: 60 },
  { name: "Core Yoga", description: "Strengthen your core with targeted yoga sequences", style_id: 6, difficulty: "intermediate", duration_min: 45 },
  { name: "Slimming Yoga", description: "Dynamic sequences designed for weight management and toning", style_id: 2, difficulty: "intermediate", duration_min: 60 },

  // XYZ
  { name: "Cocoon Hatha", description: "Beginner-friendly Hatha in the candlelit Cocoon room", style_id: 1, difficulty: "beginner", duration_min: 60 },
  { name: "Handstand Workshop", description: "Learn handstand technique in a supportive small group", style_id: 6, difficulty: "advanced", duration_min: 90 },
  { name: "Mycelium Flow", description: "Advanced dynamic vinyasa in the Mycelium room", style_id: 2, difficulty: "advanced", duration_min: 60 },

  // One Yoga
  { name: "Relaxing Stretch", description: "Gentle stretching class to release tension and improve flexibility", style_id: 5, difficulty: "beginner", duration_min: 60 },
  { name: "Aerial Stretch", description: "Use the aerial hammock for deep, supported stretching", style_id: 1, difficulty: "beginner", duration_min: 60 },
  { name: "RYT200 Prep Flow", description: "Vinyasa flow class aligned with teacher training curriculum", style_id: 2, difficulty: "intermediate", duration_min: 75 },

  // Flex Studio
  { name: "Back Care Stretch", description: "Stretch and release for back tension — holds poses longer", style_id: 5, difficulty: "beginner", duration_min: 60 },
  { name: "Power Sculpt", description: "Yoga-based strength and sculpting workout", style_id: 6, difficulty: "intermediate", duration_min: 45 },
  { name: "Classical Pilates Mat", description: "Traditional Pilates mat work for core strength and alignment", style_id: 8, difficulty: "intermediate", duration_min: 55 },

  // MOVE Studio
  { name: "Flow & Tone", description: "Vinyasa flow with bodyweight toning exercises", style_id: 2, difficulty: "intermediate", duration_min: 60 },
  { name: "Signature Stretch", description: "MOVE's uniquely designed deep stretching experience", style_id: 5, difficulty: "beginner", duration_min: 60 },

  // SOW Yoga
  { name: "Gentle Relaxation", description: "Wind down with gentle yoga — perfect after a long day", style_id: 5, difficulty: "beginner", duration_min: 60 },
  { name: "Core & Flow", description: "Build core strength with flowing vinyasa sequences", style_id: 2, difficulty: "intermediate", duration_min: 60 },

  // SUKHA
  { name: "Lunchtime Flow", description: "45-minute flow designed for the lunch break", style_id: 2, difficulty: "beginner", duration_min: 45 },
  { name: "Backbend & Inversion", description: "Progressive backbend and inversion practice for experienced yogis", style_id: 2, difficulty: "advanced", duration_min: 75 },

  // Kita Yoga
  { name: "Foundations Vinyasa", description: "Learn the building blocks of vinyasa yoga", style_id: 2, difficulty: "beginner", duration_min: 60 },
  { name: "Kita Sculpt", description: "High-intensity yoga sculpt using bodyweight and light weights", style_id: 6, difficulty: "advanced", duration_min: 45 },

  // Studio La Lune
  { name: "Menstrual Health Yoga", description: "Yoga poses and breathing to support your monthly cycle", style_id: 5, difficulty: "beginner", duration_min: 60 },
  { name: "Postnatal Recovery", description: "Gentle yoga for new mothers — rebuild core and pelvic strength", style_id: 10, difficulty: "beginner", duration_min: 60 },
  { name: "Aerial Sound Bath", description: "Floating sound healing in aerial hammocks", style_id: 4, difficulty: "beginner", duration_min: 60 },

  // Prajna Yoga
  { name: "Ashtanga Led", description: "Traditional Ashtanga primary series — led with full instruction", style_id: 3, difficulty: "intermediate", duration_min: 90 },
  { name: "Yin Yang", description: "Half dynamic yang flow, half restorative yin", style_id: 4, difficulty: "beginner", duration_min: 75 },

  // Lemon Drop
  { name: "HIIT & Flow", description: "High-intensity intervals mixed with yoga flow for recovery", style_id: 6, difficulty: "intermediate", duration_min: 45 },
  { name: "Hatha Foundations", description: "Classic Hatha — perfect for beginners learning the basics", style_id: 1, difficulty: "beginner", duration_min: 60 },

  // Santi Space
  { name: "Mindfulness Yin", description: "Deep yin stretches with mindfulness meditation woven throughout", style_id: 4, difficulty: "beginner", duration_min: 60 },
  { name: "Meridian Yoga Therapy", description: "Yoga targeting meridian lines — a Traditional Chinese Medicine approach", style_id: 8, difficulty: "beginner", duration_min: 75 },

  // The Breathing House
  { name: "Breath & Hatha", description: "Hatha yoga with special emphasis on pranayama breathing techniques", style_id: 1, difficulty: "beginner", duration_min: 60 },
  { name: "Wheel & Stretch", description: "Yoga wheel-assisted backbends and deep opening stretches", style_id: 4, difficulty: "intermediate", duration_min: 60 },
];

// How many classes go to each studio (studio index → number of classes)
const classDistribution = [4, 4, 5, 3, 3, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2];

async function seed() {
  console.log("🔐 Creating demo studio owner...");

  // 1. Sign up a demo studio owner
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: "demo.studio@yogahub.com",
    password: "DemoStudio1!",
    options: {
      data: { full_name: "Demo Studio Owner", role: "owner" }
    }
  });

  if (signUpError && !signUpError.message.includes("already registered")) {
    console.error("Signup failed:", signUpError);
    return;
  }
  console.log("  Signup: done");

  // 2. Sign in as demo owner to get a session
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: "demo.studio@yogahub.com",
    password: "DemoStudio1!",
  });

  if (signInError) {
    console.error("Login failed — email confirmation may be needed:", signInError.message);
    console.log("  Please confirm the email for demo.studio@yogahub.com then re-run this script.");
    return;
  }

  const ownerId = signInData.user.id;
  console.log(`  Logged in as: ${ownerId}`);

  // 3. Update profile to owner role
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "owner" })
    .eq("id", ownerId);

  if (profileError) console.error("Profile update failed:", profileError);
  else console.log("  Profile set to owner ✓");

  // 4. Insert studios
  console.log("\n🏢 Inserting studios...");
  const createdStudios = [];

  for (let i = 0; i < studios.length; i++) {
    const studio = studios[i];
    const { data, error } = await supabase
      .from("studios")
      .insert({
        owner_id: ownerId,
        name: studio.name,
        description: studio.description,
        address: studio.address,
        city: studio.city,
        latitude: studio.latitude,
        longitude: studio.longitude,
        phone: studio.phone,
        website: studio.website,
        photos: studio.photos,
        amenities: studio.amenities,
      })
      .select("id, name")
      .single();

    if (error) {
      console.error(`  ✗ ${studio.name}:`, error.message);
    } else {
      console.log(`  ✓ ${data.name} (id: ${data.id})`);
      createdStudios.push(data);
    }
  }

  // 5. Insert classes for each studio
  console.log(`\n📚 Inserting classes...`);
  let classIndex = 0;

  for (let s = 0; s < createdStudios.length; s++) {
    const studio = createdStudios[s];
    const count = classDistribution[s] || 2;

    for (let c = 0; c < count && classIndex < classes.length; c++) {
      const cls = classes[classIndex];
      const { error } = await supabase
        .from("classes")
        .insert({
          studio_id: studio.id,
          name: cls.name,
          description: cls.description,
          style_id: cls.style_id,
          difficulty: cls.difficulty,
          duration_min: cls.duration_min,
          price: Math.floor(Math.random() * 200) + 150, // $150 - $350
        });

      if (error) {
        console.error(`  ✗ ${studio.name} / ${cls.name}:`, error.message);
      } else {
        console.log(`  ✓ ${studio.name} / ${cls.name}`);
      }
      classIndex++;
    }
  }

  console.log(`\n✅ Done! ${createdStudios.length} studios with ${classIndex} classes.`);
}

seed().catch(console.error);
