export const BABY_PROFILE = {
  fullName: 'Aiden James Vane',
  firstName: 'Aiden',
  middleName: 'James',
  lastName: 'Vane',
  gender: 'Boy',
  dueDateISO: '2026-11-03T08:00:00-05:00',
  dueDateLabel: 'November 3, 2026'
};

/**
 * Positive quotes & specific fetal/newborn growth updates for Mackie as November 3rd approaches (and beyond)
 */
export const WEEKLY_PREGNANCY_ENCOURAGEMENTS = [
  {
    weekLeft: 5,
    gestationalWeek: 35,
    sizeComparison: 'a Honeydew Melon (~5.25 lbs, 18.2 in)',
    developingThisWeek:
      'Aiden’s kidneys are fully developed, his liver is processing waste, and he is rapidly laying down cozy baby fat around his shoulders and cheeks to stay warm after birth!',
    quoteForMackie:
      'You are doing so wonderfully this week, Mackie! Every breath and heartbeat is nurturing Aiden James as he gets stronger and readier to meet you.'
  },
  {
    weekLeft: 4,
    gestationalWeek: 36,
    sizeComparison: 'a Head of Romaine Lettuce (~5.75 lbs, 18.7 in)',
    developingThisWeek:
      'Aiden is practicing rhythmic breathing movements, sucking and swallowing, and his hearing is crystal clear — he already recognizes and calms to the sound of your voice!',
    quoteForMackie:
      'Doing amazing this week, Mama! Your warmth, calm, and strength are Aiden’s favorite place in the world right now.'
  },
  {
    weekLeft: 3,
    gestationalWeek: 37,
    sizeComparison: 'a Bunch of Swiss Chard (~6.3 lbs, 19.1 in)',
    developingThisWeek:
      'Aiden is officially entering Early Term! His lungs are producing surfactant for smooth first breaths, his grip is firm, and he’s practicing blinking and turning toward soft light.',
    quoteForMackie:
      'You’ve carried Aiden James with so much grace, Mackie. Take slow, restful moments for yourself this week — you are already an incredible mom.'
  },
  {
    weekLeft: 2,
    gestationalWeek: 38,
    sizeComparison: 'a Winter Melon (~6.8 lbs, 19.6 in)',
    developingThisWeek:
      'Aiden’s brain and nervous system are fine-tuning sleep-wake cycles, his vocal cords are ready for his first cry, and he’s shedding most of his lanugo Peach fuzz.',
    quoteForMackie:
      'So proud of you this week, Mackie! Just a couple of weeks until you hold sweet Aiden James in your arms.'
  },
  {
    weekLeft: 1,
    gestationalWeek: 39,
    sizeComparison: 'a Mini Watermelon (~7.25 lbs, 20.0 in)',
    developingThisWeek:
      'Full Term! Aiden’s chest is prominent, his immune system is receiving your protective antibodies across the placenta, and his brain is growing 30% larger in these final weeks.',
    quoteForMackie:
      'You are glowing with quiet strength, Mackie. Rest up, breathe deeply — Aiden James is almost here!'
  },
  {
    weekLeft: 0,
    gestationalWeek: 40,
    sizeComparison: 'a Small Pumpkin (~7.5+ lbs, 20.2 in)',
    developingThisWeek:
      'Due Week! Aiden has 300 soft bones ready for delivery, reflexes primed to root and latch, and eyes eager to lock onto yours (8–12 inches away—the exact distance from your arms to your face!).',
    quoteForMackie:
      'Happy Due Week, Mackie! Whether today or in the coming days, you and Aiden James are an unstoppable team.'
  }
];

export const AAP_VACCINE_SCHEDULE = [
  {
    id: 'hepb-birth',
    ageStage: 'Birth (Hospital)',
    name: 'Hepatitis B (HepB) — Dose 1',
    purpose: 'Given within 24 hours of birth before hospital discharge to protect against Hepatitis B virus.',
    aapTiming: 'Birth'
  },
  {
    id: 'rsv-birth',
    ageStage: 'Birth / Autumn–Winter Season',
    name: 'RSV Protection (Beyfortus / Nirsevimab)',
    purpose: 'Recommended by AAP for infants born during Oct–March RSV season (if maternal RSV vaccine was not given at 32–36 weeks).',
    aapTiming: 'Birth – 1 Week (Nov Birth)'
  },
  {
    id: 'hepb-2',
    ageStage: '1 – 2 Months',
    name: 'Hepatitis B (HepB) — Dose 2',
    purpose: 'Second dose in the 3-dose Hepatitis B immunization series.',
    aapTiming: '1–2 Months'
  },
  {
    id: 'dtap-1',
    ageStage: '2 Months Well-Child Visit',
    name: 'DTaP (Diphtheria, Tetanus & Pertussis) — Dose 1',
    purpose: 'Critical protection against whooping cough (pertussis), tetanus, and diphtheria.',
    aapTiming: '2 Months (Week 8)'
  },
  {
    id: 'ipv-1',
    ageStage: '2 Months Well-Child Visit',
    name: 'IPV (Inactivated Poliovirus) — Dose 1',
    purpose: 'First dose protecting against polio.',
    aapTiming: '2 Months (Week 8)'
  },
  {
    id: 'hib-1',
    ageStage: '2 Months Well-Child Visit',
    name: 'Hib (Haemophilus influenzae type b) — Dose 1',
    purpose: 'Protects against severe bacterial meningitis and pneumonia in infants.',
    aapTiming: '2 Months (Week 8)'
  },
  {
    id: 'pcv-1',
    ageStage: '2 Months Well-Child Visit',
    name: 'PCV15 / PCV20 (Pneumococcal Conjugate) — Dose 1',
    purpose: 'Protects against pneumococcal ear infections, bloodstream infections, and meningitis.',
    aapTiming: '2 Months (Week 8)'
  },
  {
    id: 'rv-1',
    ageStage: '2 Months Well-Child Visit',
    name: 'Rotavirus (RV) Oral Drops — Dose 1',
    purpose: 'Oral liquid drops (no needle!) protecting against severe infant diarrheal dehydration.',
    aapTiming: '2 Months (Week 8)'
  },
  {
    id: '4mo-series',
    ageStage: '4 Months Well-Child Visit',
    name: '4-Month Boosters (DTaP #2, IPV #2, Hib #2, PCV #2, Rotavirus #2)',
    purpose: 'Second round of primary infant immunizations to build lasting immunity.',
    aapTiming: '4 Months (Week 16)'
  },
  {
    id: '6mo-series',
    ageStage: '6 Months Well-Child Visit',
    name: '6-Month Series (DTaP #3, Hib #3, PCV #3, HepB #3,IPV #3 + Annual Flu)',
    purpose: 'Completes early infant primary series + first eligible Influenza vaccine at 6 months.',
    aapTiming: '6 Months'
  }
];

/**
 * American Academy of Pediatrics (AAP) Week-by-Week Newborn Milestones, Concerns & Care Protocols
 */
export const AAP_WEEKLY_GUIDES = [
  {
    id: 'week-1',
    label: 'Week 1 (Days 1–7)',
    shortLabel: 'Week 1',
    subtitle: 'Golden Hour, Colostrum to Mature Milk Transition & First Pediatric Visit (Days 3–5)',
    milestones: [
      'Recognizes Mom’s and Dad’s voices and calms when held skin-to-skin.',
      'Focuses on faces 8 to 12 inches away (exact distance from breast to Mom’s eyes).',
      'Strong newborn reflexes: rooting reflex, sucking reflex, Moro (startle) reflex, and palmar grasp.',
      'Lifts or turns head briefly from side to side when lying on Mom’s chest.'
    ],
    commonConcerns: [
      'Physiological Weight Loss: Normal to lose 5%–7% (up to 10% max) of birth weight in Days 1–4 before milk comes in; begins gaining ~0.5–1 oz/day once mature milk arrives.',
      'Newborn Jaundice (Bilirubin): Mild yellowing of face/eyes peaks around Days 3–5. Frequent nursing (8–12x/day) clears bilirubin through stool. Call pediatrician if yellow spreads to belly/legs or baby is sleepy.',
      'Stool Transition: Thick black meconium (Days 1–2) → greenish-brown transitional poop (Days 3–4) → seedy mustard-yellow breastfed poop (Day 5+).',
      'Brick-Dust Urine: Pink/orange uric acid crystals on diaper in Days 1–3 can occur while colostrum volume is small; should disappear by Day 4–5 as wet diapers reach 6+/day.'
    ],
    feedingPatterns:
      '8 to 12+ breastfeeds per 24 hours (every 1.5–3 hours) on demand. Days 1–3 deliver nutrient-dense golden colostrum (stomach size: cherry to walnut); Days 3–5 transition to mature milk. Nurse 10–20 mins per side and start 400 IU Vitamin D drops daily.',
    sleepHours:
      '16 to 17 hours total per 24 hours in short 1.5–3 hour stretches. Always place Aiden on his BACK on a firm, flat, bare bassinet mattress. Wake to feed if he sleeps longer than 3–4 hours until back to birth weight.',
    bathFrequency:
      'Sponge baths only (1–2 times this week) using a warm, damp washcloth and mild fragrance-free cleanser. Do NOT submerge in water while umbilical cord stump and circumcision are healing.',
    tummyTime:
      'Start Day 1 home from hospital! 2 to 3 short sessions per day for 2–3 minutes each while awake (reclined chest-to-chest on Mom or Dad counts and is wonderful in Week 1!).',
    skinCare:
      'Keep natural vernix on skin initially. Dry, peeling skin on wrists, ankles, and feet is completely normal — no lotion needed. Use plain petrolatum or zinc oxide barrier cream for diaper area.',
    circumcisionCare:
      'Days 1–7 Healing: Apply a generous dollop of plain white Vaseline (petroleum jelly) to the tip of the penis or sterile gauze at EVERY diaper change so it never sticks to the diaper. Clean gently with warm water only. A soft yellowish film over the tip on Days 2–5 is normal healing tissue (fibrin), NOT pus.',
    umbilicalCordCare:
      'AAP Dry Cord Care: Keep stump clean and dry—do NOT use rubbing alcohol. Fold the top front of Aiden’s diaper down below the stump so urine and friction stay away.',
    vaccineFocus:
      'Hepatitis B Dose #1 (given in hospital within 24 hrs of birth) + RSV Monoclonal Antibody (Beyfortus/nirsevimab) protection for November birth.'
  },
  {
    id: 'week-2',
    label: 'Week 2 (Days 8–14)',
    shortLabel: 'Week 2',
    subtitle: 'Regaining Birth Weight, 10–14 Day Growth Spurt & Cord Detachment Window',
    milestones: [
      'Regains (or surpasses) birth weight by Day 10 to 14!',
      'Briefly tracks a slow-moving high-contrast object or parent’s face toward the midline.',
      'Quiets down when picked up, swaddled, or hearing rhythmic shushing.',
      'Makes soft cooing/throaty newborn sounds during alert windows (30–45 min wake windows).'
    ],
    commonConcerns: [
      'First Growth Spurt & Cluster Feeding (Days 10–14): Aiden may want to nurse every hour for several hours in the evening. This is nature’s way of signaling your body to increase milk volume—not a sign of low supply!',
      'Umbilical Stump Loosening: The cord stump shrivels, turns dark brown/black, and may leave a tiny spot of dried blood on the onesie right as it detaches.',
      'Circumcision Completion: By Day 7–10, redness resolves and the mucosal surface toughens up.',
      'Frequent Sneezing & Hiccups: Normal newborn reflexes clearing nasal passages (not a cold unless accompanied by cough or fever ≥ 100.4°F).'
    ],
    feedingPatterns:
      '8 to 12 breastfeeds per 24 hours (~15–20 mins per breast). Expect 6–8+ heavy wet diapers and 3–4+ yellow seedy stools daily. Once birth weight is regained (confirmed by pediatrician), you can let him sleep one slightly longer 4-hour stretch at night if he wakes on his own.',
    sleepHours:
      '15.5 to 16.5 hours per 24 hours. Day/night confusion is common; expose Aiden to natural daylight and normal household sounds during daytime feeds, and keep nighttime feeds dim and quiet.',
    bathFrequency:
      '2 to 3 times per week. Once the umbilical cord stump has completely fallen off and the navel base is dry for 24–48 hours (and circumcision is healed), Aiden can graduate to his first gentle infant tub bath!',
    tummyTime:
      '2 to 3 times per day for 3 to 5 minutes per session on a firm play mat or blanket after diaper changes when alert.',
    skinCare:
      'Milia (tiny white pearly dots on the nose/chin) may appear — never squeeze them; they vanish on their own. Trim sharp newborn fingernails gently with a baby emery board while he sleeps.',
    circumcisionCare:
      'Usually fully healed by Day 7–10! Once the glans looks smooth and pink without raw areas, you can stop applying Vaseline at every diaper change (though occasional barrier ointment is fine).',
    umbilicalCordCare:
      'Stump typically falls off between Days 10–18. Never pull a hanging thread of cord — let it detach naturally. Keep the newly exposed belly button clean and dry.',
    vaccineFocus:
      'Verify Hepatitis B #1 and RSV immunizations are recorded in Aiden’s D.C. immunization record; next vaccines scheduled for 1–2 month visit.'
  },
  {
    id: 'week-3',
    label: 'Week 3 (Days 15–21)',
    shortLabel: 'Week 3',
    subtitle: '3-Week Growth Spurt, Longer Alert Windows & Early Neck Strength',
    milestones: [
      'Holds head up for a few seconds during tummy time and turns head cheek-to-cheek.',
      'Studies high-contrast black-and-white patterns and parent facial expressions intently.',
      'Startles to loud noises and blinks at bright light.',
      'Begins uncurling slightly from the tight fetal posture.'
    ],
    commonConcerns: [
      'Evening "Witching Hour" Fussiness: Fussiness often begins ramping up in late afternoon/evening starting around Week 2–3. Try the 5 S’s (Swaddle, Side/Stomach hold while awake in arms, Shush, Swing gently, Suck).',
      'Infant Gas & Grunting (Infant Dyschezia): Newborns often grunt, turn red, and strain for 5–10 minutes just to coordinate relaxing their pelvic floor to pass soft yellow stool—this is NOT constipation as long as poop is soft!',
      'Baby Acne Debut: Small red/white bumps on cheeks and forehead triggered by maternal hormones often start around Week 3.'
    ],
    feedingPatterns:
      '8 to 12 breastfeeds per 24 hours. Burp Aiden halfway through a feed (when switching breasts) and at the end of the feed by holding him upright against your shoulder or supporting his chin sitting on your lap.',
    sleepHours:
      '15 to 16 hours per 24 hours. Wake windows last ~45–60 minutes (including feeding time) before sleepy cues appear (red eyebrows, staring off, yawning).',
    bathFrequency:
      '2 to 3 times per week in an infant tub with 2 inches of warm water (test water with your wrist/elbow: ~98°F–100°F). Pat skin dry gently—do not rub.',
    tummyTime:
      '3 times per day for 5 minutes each session (~15 minutes total daily). Place a high-contrast card or mirror a few inches from his eyes.',
    skinCare:
      'For baby acne, wash face once daily with plain warm water only—avoid oils or adult acne washes. Change wet/soiled diapers promptly and let skin air-dry before applying zinc oxide.',
    circumcisionCare:
      'Fully healed! Simply wash normally with warm water during baths and wipe front-to-back during diaper changes.',
    umbilicalCordCare:
      'Cord stump has usually detached by Week 3. If still attached past 3 weeks, mention it at your pediatric checkup.',
    vaccineFocus:
      'No shots this week — Hep B Dose #2 is upcoming at the 1-Month or 2-Month pediatric visit.'
  },
  {
    id: 'week-4',
    label: 'Week 4 (1 Month)',
    shortLabel: 'Week 4 (1 Mo)',
    subtitle: '1-Month Well-Child Checkup, Visual Tracking & Emerging Smiles',
    milestones: [
      'Follows a moving face or toy smoothly to the midline and slightly past.',
      'Makes eye-to-eye contact for longer stretches and begins practicing early pre-smile facial movements.',
      'Lifts head 45 degrees briefly during tummy time.',
      'Hands begin opening up more frequently instead of staying tightly fisted all day.'
    ],
    commonConcerns: [
      'Cradle Cap (Seborrheic Dermatitis): Flaky, yellowish scales on the scalp may appear around 4 weeks. Loosen gently with a drop of baby oil/mineral oil and a soft baby brush before bath.',
      'Spit-Up / Happy Spitter: As milk intake per feed increases (3–4 oz per feed), mild effortless spit-up is common due to an immature lower esophageal sphincter.',
      'Preventing Flat Spots (Positional Plagiocephaly): Alternate which end of the bassinet Aiden’s head faces each night so he turns his head to both the left and right sides equally.'
    ],
    feedingPatterns:
      '8 to 10 breastfeeds per 24 hours. Breastfeeding becomes noticeably more efficient as Aiden’s suck-swallow-breathe coordination matures! Continue 400 IU Vitamin D drops daily.',
    sleepHours:
      '14.5 to 16 hours per 24 hours. May begin giving one 4-to-5 hour stretch of nighttime sleep.',
    bathFrequency:
      '2 to 3 times per week. A warm bath followed by a quiet feeding and swaddle can become a soothing bedtime cue.',
    tummyTime:
      '3 to 4 sessions per day totaling 15 to 20 minutes daily. Roll Aiden gently onto and off his tummy rather than lifting straight up to engage core muscles.',
    skinCare:
      'Apply fragrance-free, hypoallergenic cream/ointment (like plain CeraVe Baby or Aquaphor) right after bath while skin is slightly damp if autumn/winter indoor heat dries his skin.',
    circumcisionCare:
      'Healed routine maintenance — gently wipe clean during diaper changes.',
    umbilicalCordCare:
      'Navel is fully healed and tucked in.',
    vaccineFocus:
      '1-Month Well-Child Visit: Pediatrician may administer Hepatitis B (HepB) Dose #2 now (or combine at the 2-Month visit).'
  },
  {
    id: 'month-2',
    label: 'Month 2 (Weeks 5–8)',
    shortLabel: 'Weeks 5–8 (2 Mo)',
    subtitle: 'First Real Social Smiles, Cooing Conversations & 2-Month Immunizations',
    milestones: [
      'Heart-melting first TRUE social smiles in response to Mom’s and Dad’s smiles and voices!',
      'Coos with vowel sounds ("ah-goo", "ooo") and takes turns "talking" back and forth.',
      'Holds head up steadier at a 45° angle during tummy time and pushes up on forearms.',
      'Tracks objects 180 degrees from one side all the way to the other.'
    ],
    commonConcerns: [
      'Peak of Fussiness (Week 6): Newborn evening crying typically peaks around 6 weeks of age and then steadily improves by 8–12 weeks.',
      'Sudden Stool Spacing in Breastfed Babies: Around 6–8 weeks, colostrum’s laxative effect fades and breast milk is absorbed so completely that some exclusively breastfed babies poop every 2–4 days (still normal as long as stool is soft mustard yellow and baby is comfortable).',
      'Post-2-Month Vaccine Care: Mild sleepiness, fussiness, or thigh soreness for 24–48 hours after 2-month shots; ask pediatrician for weight-based acetaminophen dose chart at the visit.'
    ],
    feedingPatterns:
      '7 to 9 breastfeeds per 24 hours. Expect a 6-week growth spurt where Aiden nurses more frequently for 2–3 days to boost your milk supply to match his growing appetite.',
    sleepHours:
      '14 to 16 hours per 24 hours (typically 4–6 hour longest night stretch + 4–5 daytime naps). Circadian melatonin production begins maturing around Week 8!',
    bathFrequency:
      '2 to 3 times per week. Be sure to clean inside neck folds, behind ears, and underarm creases where milk droplets collect.',
    tummyTime:
      'Build up to 20 to 30+ minutes total per day (split into 4–5 fun 5–7 minute sessions).',
    skinCare:
      'Baby acne usually clears completely by Weeks 6–8! Keep drool/milk wiped from chin and neck folds to prevent moisture irritation.',
    circumcisionCare: 'Routine hygiene.',
    umbilicalCordCare: 'Healed.',
    vaccineFocus:
      '2-Month AAP Immunization Visit: DTaP #1, IPV #1, Hib #1, PCV #1, Oral Rotavirus #1 (and HepB #2 if not given at 1 month).'
  },
  {
    id: 'month-3',
    label: 'Month 3–4 (Weeks 9–16)',
    shortLabel: 'Months 3–4',
    subtitle: 'Rolling Prep, Laughs & Babbles, Hand-to-Toy Batting & 4-Month Boosters',
    milestones: [
      'Pushes up onto forearms/wrists with chest lifted high during tummy time; holds head steady when held upright.',
      'Discovers his hands! Brings hands together at midline, bats at dangling toys, and grasps rattles.',
      'Chuckles, squeals with delight, and babbles chains of sounds.',
      'May begin rolling from tummy to back around 3.5–4 months!'
    ],
    commonConcerns: [
      'Transitioning Out of the Swaddle (CRITICAL AAP Safety Milestone): As soon as Aiden shows ANY sign of attempting to roll (often 8–12+ weeks), transition immediately out of swaddles to an arms-free wearable sleep sack.',
      'Increased Drooling & Hands in Mouth: Salivary glands mature around 3 months and babies explore the world with their mouths (often mistaken for early teething, though first tooth averages ~6 months).',
      '3-Month Nursing Distractibility: Aiden becomes so curious about the room that he may pop on and off the breast to look around — nursing in a calm, dim room helps!'
    ],
    feedingPatterns:
      '6 to 8 breastfeeds per 24 hours (often faster, 7–12 minutes per side because he transfers milk much more powerfully). Exclusive breast milk continues (no solids or water needed until ~6 months).',
    sleepHours:
      '14 to 15 hours per 24 hours (9–10 hours nighttime sleep with 1–2 night feeds + 3–4 daytime naps).',
    bathFrequency:
      '2 to 3 times per week (or warm water rinse as part of bedtime routine followed by moisturizing lotion).',
    tummyTime:
      '30 to 45+ minutes total per day across wake windows — reach and pivot games with rattle toys.',
    skinCare:
      'Apply barrier ointment on chin/chest if drooling causes mild chapping.',
    circumcisionCare: 'Routine hygiene.',
    umbilicalCordCare: 'Healed.',
    vaccineFocus:
      '4-Month AAP Immunization Visit: DTaP #2, IPV #2, Hib #2, PCV #2, Oral Rotavirus #2.'
  }
];
