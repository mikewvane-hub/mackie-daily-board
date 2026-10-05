// Evidence-based Postpartum Fitness Timeline (ACOG & Pelvic Floor PT Guidelines)
// + Default Saved Workout Routines for Mackie's Personal Health & Fitness Hub

export const WORKOUT_CATEGORIES = [
  { id: 'ALL', label: 'All Routines' },
  { id: 'Walking & Cardio', label: 'Walking & Cardio' },
  { id: 'Core & Pelvic Floor', label: 'Core & Pelvic Floor' },
  { id: 'Stretching & Mobility', label: 'Stretching & Mobility' },
  { id: 'Strength & Toning', label: 'Strength & Toning' },
  { id: 'Pilates & Yoga', label: 'Pilates & Yoga' }
];

export const DEFAULT_WORKOUT_ROUTINES = [
  {
    id: 'wk-stroller-walk-30',
    title: '30-Min Stroller Walk & Diaphragmatic Breathing',
    category: 'Walking & Cardio',
    duration: '30 mins',
    intensity: 'Gentle–Moderate',
    postpartumPhase: 'Weeks 3+',
    notes: 'Focus on tall posture, relaxed shoulders, and exhaling gently to engage deep transverse abdominis on inclines.',
    exercises: [
      '5 min easy warm-up walk at a conversational pace',
      '20 min brisk flat or gentle neighborhood stroller walk (focus on rib-over-pelvis alignment)',
      '5 min cool-down walk + 5 deep 360° rib-cage breaths',
      'Post-walk: 60 sec standing calf & hip flexor stretch'
    ]
  },
  {
    id: 'wk-early-pp-breath-pelvic',
    title: 'Early Postpartum 360° Breath & Pelvic Floor Reconnection',
    category: 'Core & Pelvic Floor',
    duration: '15 mins',
    intensity: 'Gentle',
    postpartumPhase: 'Weeks 1–4',
    notes: 'Safe starting Week 1 postpartum to restore mind-to-muscle connection with the pelvic floor and deep core.',
    exercises: [
      '360° Diaphragmatic Breathing (Supine or Side-Lying): 2 sets × 8 slow breaths',
      'Gentle Pelvic Floor Elevations (Inhale relax/lengthen, Exhale gentle lift): 2 sets × 8 reps',
      'Quick Flicks (Fast-twitch pelvic floor contract & full release): 2 sets × 8 reps',
      'Supine Heel Slides (Maintaining neutral pelvis): 2 sets × 6 reps per leg',
      'Supported Knees-Side-to-Side Lumbar Release: 60 seconds'
    ]
  },
  {
    id: 'wk-nursing-posture-stretch',
    title: '15-Min Nursing Mom Neck, Chest & Hip Opener Flow',
    category: 'Stretching & Mobility',
    duration: '15 mins',
    intensity: 'Gentle',
    postpartumPhase: 'All Weeks',
    notes: 'Relieves upper back, neck, and chest tightness from feeding & holding Baby Aiden.',
    exercises: [
      'Doorway Chest & Pec Opener Stretch: 45 seconds per side',
      'Seated Upper Trap & Neck Ear-to-Shoulder Release: 40 seconds per side',
      'Thoracic Cat-Cow with 360° Breath: 10 slow reps',
      'Thread-the-Needle Upper Back Rotation: 5 breaths per side',
      'Half-Kneeling Hip Flexor & Psoas Stretch: 45 seconds per side',
      'Child’s Pose with Lat Side-Reach: 60 seconds'
    ]
  },
  {
    id: 'wk-deep-core-diastasis',
    title: 'Postpartum Deep Core & Diastasis Recti Restore',
    category: 'Core & Pelvic Floor',
    duration: '20 mins',
    intensity: 'Moderate',
    postpartumPhase: 'Weeks 4–12',
    notes: 'Targets the transverse abdominis (TVA) and obliques without doming or coning along the linea alba.',
    exercises: [
      'Supine TVA Exhale Engagement + Bent Knee March: 3 sets × 8 alternating reps',
      'Glute Bridges with Exhale Pelvic Tilt: 3 sets × 12 reps',
      'Quadruped Bird-Dog (Opposite arm/leg reach, neutral spine): 3 sets × 8 reps per side',
      'Side-Lying Clamshells with Mini-Band or Bodyweight: 3 sets × 12 reps per side',
      'Modified Side Plank (From knees, lifting hips): 2 sets × 20 seconds per side'
    ]
  },
  {
    id: 'wk-lower-body-glute-sculpt',
    title: 'Lower Body Glute, Leg & Pelvic Stability Sculpt',
    category: 'Strength & Toning',
    duration: '30 mins',
    intensity: 'Moderate',
    postpartumPhase: 'Weeks 6+',
    notes: 'Rebuilds glute and hamstring strength to support the pelvis and lower back.',
    exercises: [
      '5 min dynamic warm-up: Glute bridges & bodyweight box squats',
      'Goblet or Bodyweight Tempo Squats (Exhale on the way up): 3 sets × 10 reps',
      'Romanian Deadlifts (Dumbbells or Bodyweight hip hinge): 3 sets × 10 reps',
      'Reverse Lunges or Split Squats: 3 sets × 8 reps per leg',
      'Single-Leg Elevated Glute Bridges: 2 sets × 10 reps per side',
      'Standing Calf Raises + 3 min lower body stretch'
    ]
  },
  {
    id: 'wk-upper-body-posture-tone',
    title: 'Upper Body Posture, Back & Arm Dumbbell Toning',
    category: 'Strength & Toning',
    duration: '25 mins',
    intensity: 'Moderate',
    postpartumPhase: 'Weeks 6+',
    notes: 'Strengthens the upper back, rear delts, biceps, and shoulders for carrying car seats and strollers.',
    exercises: [
      'Arm Circles & Band Pull-Aparts Warm-Up: 2 mins',
      'Seated or Standing Dumbbell Overhead Press: 3 sets × 10 reps',
      'Single-Arm Supported Dumbbell Rows: 3 sets × 10 reps per arm',
      'Dumbbell Bicep Curls to Lateral Raises: 3 sets × 10 reps',
      'Incline Push-Ups (Hands on bench/counter, core braced): 3 sets × 8–10 reps',
      'Tricep Overhead Extensions: 2 sets × 12 reps'
    ]
  },
  {
    id: 'wk-low-impact-pilates',
    title: '25-Min Low-Impact Mat Pilates & Core Flow',
    category: 'Pilates & Yoga',
    duration: '25 mins',
    intensity: 'Moderate',
    postpartumPhase: 'Weeks 6+',
    notes: 'Controlled mat Pilates focused on core control, glute endurance, and spinal articulation.',
    exercises: [
      'Pilates Imprint & Release + Rib Cage Arms: 8 reps',
      'Tabletop Toe Taps with Corset Exhale: 3 sets × 10 alternating reps',
      'Articulating Shoulder Bridge with Heel Lifts: 3 sets × 10 reps',
      'Side-Lying Leg Series (Lifts, Circles, Inner Thigh Lifts): 10 reps each per side',
      'Swimming Prep (Prone or Quadruped alternating lifts): 2 sets × 10 reps',
      'Mermaid Side Stretch & Spine Twist Cool-Down: 3 mins'
    ]
  },
  {
    id: 'wk-power-walk-intervals',
    title: '40-Min Downtown D.C. Power Walk & Incline Intervals',
    category: 'Walking & Cardio',
    duration: '40 mins',
    intensity: 'Energizing',
    postpartumPhase: 'Weeks 8+',
    notes: 'Great for the National Mall, Wharf waterfront, or treadmill incline intervals.',
    exercises: [
      '5 min easy warm-up stroll',
      '6 rounds: 3 mins brisk power walk + 2 mins moderate recovery pace',
      '5 min cool-down walk',
      '5 min post-walk hamstring, quad, and hip opener stretch'
    ]
  }
];

export const POSTPARTUM_TIMELINE_PHASES = [
  {
    id: 'pre-birth',
    weekRange: 'Pre-Birth (3rd Trimester Prep)',
    minWeek: -10,
    maxWeek: 0,
    badge: 'Preparing for Baby Aiden',
    summary: 'Maintain gentle mobility, pelvic floor relaxation (birth prep), and daily light walks as November 3rd approaches.',
    walkingRec: {
      frequency: '5–6 days / week',
      duration: '20–30 minutes per day',
      details: 'Comfortable conversational pace on flat ground; split into two 15-minute walks if pelvic pressure increases.'
    },
    stretches: [
      'Deep Squat / Garland Pose (supported with bolster) to lengthen the pelvic floor',
      'Cat-Cow & Pelvic Tilts on a birth ball (5–10 mins daily)',
      'Side-Lying Thoracic Openers & Hip Internal Rotation stretches',
      'Child’s Pose with wide knees to relieve low back tension'
    ],
    exercises: [
      '360° Birth-Prep Breathing (Inhale to soften and drop the pelvic floor)',
      'Seated Birth Ball Figure-8s and Hip Circles',
      'Side-Lying Clamshells & Glute Bridges for sacroiliac (SI) joint comfort',
      'Light upper-body band rows for posture support'
    ],
    watchFor: 'Avoid supine exercises if dizzy; prioritize pelvic floor lengthening and relaxation over tight kegels right before delivery.'
  },
  {
    id: 'weeks-1-2',
    weekRange: 'Weeks 1–2 Postpartum',
    minWeek: 1,
    maxWeek: 2,
    badge: 'Rest, Bonding & Gentle Breath',
    summary: 'Prioritize rest, tissue healing, hydration, and gentle reconnection with your breath and pelvic floor.',
    walkingRec: {
      frequency: '3–5 days / week (as comfortable)',
      duration: '5–10 minutes (1–2x/day)',
      details: 'Very gentle, slow indoor or flat outdoor strolls for fresh air. Stop immediately if pelvic heaviness or bleeding increases.'
    },
    stretches: [
      'Gentle Neck Rolls & Shoulder Shrugs after nursing sessions',
      'Supported Chest Opener (lying over a rolled towel between shoulder blades)',
      'Ankle Pumps & Circles in bed to support circulation',
      'Gentle Supine Knee-to-Side rocks (pain-free range)'
    ],
    exercises: [
      '360° Diaphragmatic Breathing (5 minutes, 2x daily)',
      'Gentle Pelvic Floor Contract & Full Release (5–8 gentle reps lying down)',
      'Supine Heel Slides (sliding one heel along the bed/mat while exhaling)',
      'Postural Reset: Stacking ribs over hips while holding Baby Aiden'
    ],
    watchFor: 'If lochia (postpartum bleeding) turns bright red or increases after walking, scale back duration and rest horizontal.'
  },
  {
    id: 'weeks-3-4',
    weekRange: 'Weeks 3–4 Postpartum',
    minWeek: 3,
    maxWeek: 4,
    badge: 'Gradual Mobility & Core Foundation',
    summary: 'Gradually build walking duration and introduce unloaded supine & quadruped deep core activation.',
    walkingRec: {
      frequency: '4–5 days / week',
      duration: '15–20 minutes per walk',
      details: 'Easy flat stroller or solo walks. Focus on pushing the stroller close to your body with neutral wrists and relaxed shoulders.'
    },
    stretches: [
      'Doorway Pectoral & Anterior Shoulder Stretch (45s each side)',
      'Gentle Cat-Cow Spinal Articulation (8–10 slow breaths)',
      'Half-Kneeling Hip Flexor Stretch (relieves sitting/nursing tightness)',
      'Seated Figure-4 Piriformis & Glute Stretch'
    ],
    exercises: [
      'Early Postpartum 360° Breath & Pelvic Floor Reconnection (2 sets × 8–10 reps)',
      'Supine Bent-Knee Fallouts (controlling pelvis with deep core)',
      'Two-Leg Glute Bridges with Exhale Lift (2 sets × 10 reps)',
      'Quadruped Exhale TVA Hugs (drawing baby/belly gently toward spine on exhale)'
    ],
    watchFor: 'Avoid crunches, sit-ups, front planks, or heavy lifting (> baby’s weight in car seat) while linea alba and pelvic floor heal.'
  },
  {
    id: 'weeks-5-6',
    weekRange: 'Weeks 5–6 Postpartum',
    minWeek: 5,
    maxWeek: 6,
    badge: '6-Week OB Clearance Milestone',
    summary: 'Prepare for your 6-week OB/GYN postpartum checkup and diastasis recti / pelvic floor assessment.',
    walkingRec: {
      frequency: '5 days / week',
      duration: '20–30 minutes per day',
      details: 'Moderate conversational pace. You can begin gentle hills once lochia has stopped and you feel zero pelvic heaviness.'
    },
    stretches: [
      'Thread-the-Needle Thoracic Spine Opener',
      'Standing Calf, Hamstring & Quad Stretch post-walk',
      'Child’s Pose with Side Lat Reach',
      '90/90 Seated Hip Mobility Switches'
    ],
    exercises: [
      'Quadruped Bird-Dog (Opposite arm & leg reach: 3 sets × 8 reps)',
      'Bodyweight Box Squats (Inhale down, exhale & lift pelvic floor on the way up)',
      'Side-Lying Clamshells & Straight-Leg Abductions (3 sets × 10 reps)',
      'Standing Resistance Band Rows & Pallof Anti-Rotation Press'
    ],
    watchFor: 'Ask your OB at your 6-week visit to check for diastasis recti width/depth and pelvic floor tone before resuming weighted workouts.'
  },
  {
    id: 'weeks-7-8',
    weekRange: 'Weeks 7–8 Postpartum',
    minWeek: 7,
    maxWeek: 8,
    badge: 'Low-Impact Strength & Core Rebuild',
    summary: 'With OB clearance, reintroduce light-to-moderate dumbbells, resistance bands, and low-impact functional strength.',
    walkingRec: {
      frequency: '5–6 days / week',
      duration: '30–35 minutes per day',
      details: 'Brisk stroller or solo walks (~3.0–3.5 mph pace) + 2–3 days/week of 20–25 min low-impact strength.'
    },
    stretches: [
      'World’s Greatest Lunge with Thoracic Twist',
      'Foam Roll Upper Back (Thoracic Extension) & Quads',
      'Deep Hip Flexor & Quad Couch Stretch',
      'Downward Dog to Cobra Gentle Flow'
    ],
    exercises: [
      'Goblet Squats & Dumbbell Romanian Deadlifts (Light–Moderate weight, 3 × 10)',
      'Supine Dead Bug Regressions (Alternating heel taps with flat ribcage)',
      'Incline Push-Ups (Hands elevated on bench/couch) & Dumbbell Overhead Press',
      'Modified Side Planks from Knees (3 × 20–30s per side)'
    ],
    watchFor: 'Watch the midline of your abdomen during exercises—if you see coning/doming, regress the lever length and focus on exhale tension.'
  },
  {
    id: 'weeks-9-10',
    weekRange: 'Weeks 9–10 Postpartum',
    minWeek: 9,
    maxWeek: 10,
    badge: 'Progressive Strength & Endurance',
    summary: 'Build muscular endurance, unilateral leg stability, and full-body low-impact conditioning.',
    walkingRec: {
      frequency: '5–6 days / week',
      duration: '35–45 minutes per day',
      details: 'Brisk power walks or incline treadmill walks, paired with 3 days/week of 25–30 min strength or Pilates.'
    },
    stretches: [
      'Dynamic Leg Swings & Hip Openers before workouts',
      'Pigeon Pose / Supine Figure-4 Glute Release',
      'Standing Chest & Lat Doorway Stretch',
      'Butterfly Groin & Adductor Stretch'
    ],
    exercises: [
      'Reverse Lunges, Split Squats & Step-Ups (3 sets × 8–10 per leg)',
      'Full Dead Bugs (Opposite arm and leg extension if linea alba stays flat)',
      'Single-Arm Dumbbell Rows, Chest Press & Farmer’s Carries',
      '25-Min Low-Impact Mat Pilates & Core Flow'
    ],
    watchFor: 'Ensure adequate caloric and water intake (+400–500 kcal/day and 100+ oz water) so increasing activity supports breast milk supply.'
  },
  {
    id: 'weeks-11-12',
    weekRange: 'Weeks 11–12 Postpartum',
    minWeek: 11,
    maxWeek: 12,
    badge: 'Pre-Impact Readiness & Core Control',
    summary: 'Test single-leg stability, load tolerance, and pelvic floor resilience in preparation for 12+ week return-to-impact.',
    walkingRec: {
      frequency: '5–6 days / week',
      duration: '40–45 minutes per day',
      details: 'Power walk intervals, stationary bike, or elliptical + 3–4 days/week of structured strength training.'
    },
    stretches: [
      'Full-Body 10-Min Dynamic Mobility Warm-Up',
      'Thoracic Windmills & Bretzel Stretch',
      'Calf, Soleus & Achilles Tendon Prep Stretches (for return to running/hops)',
      ' Evening Parasympathetic Stretch & Breath Flow'
    ],
    exercises: [
      'Single-Leg Romanian Deadlifts & Single-Leg Glute Bridges (3 × 10 per side)',
      'Full Forearm Planks (30–45s holds with zero abdominal doming)',
      'Low-Amplitude Pogo Hops / Quick March-in-Place (Pelvic floor impact readiness test)',
      'Full-Body Dumbbell Strength Circuits (30–35 mins)'
    ],
    watchFor: '12-Week Readiness Check: Can you balance on 1 leg for 10s, do 10 single-leg squats, and hop in place without leakage or heaviness?'
  },
  {
    id: 'weeks-12-plus',
    weekRange: '12+ Weeks Postpartum (Cycle & Full Training)',
    minWeek: 13,
    maxWeek: 520,
    badge: 'Full Training & Cycle Sync Unlocked',
    summary: 'Gradual return to running/high-impact training, full strength workouts, and Oura Ring / Manual Cycle & Sleep Tracking!',
    walkingRec: {
      frequency: '5–7 days / week (Walk, Run, or Cardio)',
      duration: '30–60 minutes per day',
      details: 'Combine daily 30–45 min walks or walk/jog intervals with 3–4 strength/Pilates sessions synced to your cycle & Oura readiness.'
    },
    stretches: [
      'Cycle-Synced Mobility: Dynamic warm-ups in Follicular/Ovulatory phases',
      'Restorative Yin Yoga & Hip Openers during Luteal & Menstrual phases',
      'Post-Run/Walk Calf, Hamstring, Quad & Hip Flexor Routine',
      'Daily 5-Min Nursing/Carrying Thoracic Opener'
    ],
    exercises: [
      'Progressive Walk-to-Run Intervals (e.g., 1 min jog / 2 min walk × 8 rounds)',
      'Full Lower & Upper Body Strength Training (Squats, Deadlifts, Lunges, Rows, Presses)',
      'Full Mat/Reformer Pilates & Core Conditioning',
      'Cycle-Synced Intensity: Higher intensity in Follicular/Ovulatory; steady strength & walks in Luteal'
    ],
    watchFor: 'At 12+ weeks postpartum, track your cycle return below (via Oura Ring or 1-tap Cycle Start) and adjust workout intensity using your sleep & readiness scores.'
  }
];

export const CYCLE_PHASES_GUIDE = [
  {
    phase: 'Menstrual Phase',
    days: 'Days 1–5',
    hormones: 'Estrogen & Progesterone at baseline',
    workoutFocus: 'Gentle walks (20–30 mins), restorative stretching, mobility, and light core breathwork.',
    color: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    phase: 'Follicular Phase',
    days: 'Days 6–13',
    hormones: 'Rising Estrogen • High Energy & Recovery',
    workoutFocus: 'Best window for progressive strength training, brisk incline walks, jog intervals, and sculpting routines.',
    color: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    phase: 'Ovulatory Window',
    days: 'Days 14–16',
    hormones: 'Peak Estrogen & LH Surge',
    workoutFocus: 'Peak strength and stamina! Great for challenging lower/upper body workouts and 40-min power walks.',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    phase: 'Luteal Phase',
    days: 'Days 17–28',
    hormones: 'Higher Progesterone • Resting Temp +0.2°C to +0.5°C',
    workoutFocus: 'Moderate strength, mat Pilates, steady stroller walks, and extra hydration/electrolytes.',
    color: 'bg-stone-100 text-stone-800 border-stone-300'
  }
];
