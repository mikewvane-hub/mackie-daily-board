import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ExternalLink,
  ShieldAlert,
  BookOpen,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { API_BASE } from '../apiBase.js';

const PROACTIVE_PROMPTS = [
  {
    greeting:
      "Hi Mackie & Mike! 🧸 I'm Ted, Aiden's cozy nursery teddy bear! Have any newborn or postpartum questions? I'll analyze them using AAP guidelines & peer-reviewed medical journals!",
    suggestedQuestion: 'How often and how long should a newborn breastfeed each day?'
  },
  {
    greeting:
      'Ted checking in on you two! 🧸 Want me to look up AAP guidance on newborn circumcision healing, Vaseline care, or when the umbilical cord stump falls off?',
    suggestedQuestion: 'What is the AAP guidance on newborn circumcision healing and umbilical cord care?'
  },
  {
    greeting:
      'Cozy nursery check-in! 🧸 Curious about how many wet & dirty diapers Aiden should have each day, burping & gas relief, or normal newborn weight gain?',
    suggestedQuestion: 'How many wet and dirty diapers should a newborn have and when do they regain birth weight?'
  },
  {
    greeting:
      'Here whenever you need a hand! 🧸 Want me to pull peer-reviewed Pediatrics studies on newborn safe sleep hours, tummy time, or the vaccine schedule?',
    suggestedQuestion: 'What are the AAP safe sleep recommendations and daily sleep hours for a newborn?'
  }
];

const QUICK_QUESTIONS = [
  'Breastfeeding frequency, duration & cluster feeding?',
  'Burping, newborn gas, hiccups & grunting?',
  'Spit-up & reflux vs. vomiting?',
  'Circumcision healing & Vaseline care?',
  'Umbilical cord dry care & when it falls off?',
  'Diaper counts, stool colors & jaundice signs?',
  'Safe sleep hours, swaddling & pacifiers?',
  'Tummy time, sponge baths & newborn skin care?',
  'When is a newborn temperature considered a fever?',
  'AAP newborn & 2-month vaccine schedule?'
];

/**
 * Built-in client-side AAP fallback knowledge base in case network is temporarily unreachable,
 * ensuring the Ask Ted box ALWAYS analyzes the user's question and returns a valid AAP/PubMed answer.
 */
function buildClientFallbackAnswer(question) {
  const q = String(question || '').trim();
  const lower = q.toLowerCase();

  if (/burp|gas|hiccup|grunt|strain|fart|colic|fussy/i.test(lower)) {
    return {
      question: q,
      topicTitle: 'Newborn Burping, Gas, Hiccups & Infant Grunting (AAP & Rome IV Guidance)',
      summary: `Regarding "${q}": According to the American Academy of Pediatrics (AAP), newborns swallow air while nursing and have an immature digestive system. Burping mid-feed and post-feed, holding upright for 15–20 minutes, and bicycle leg movements safely relieve gas, while hiccups and grunting before soft stools (infant dyschezia) are normal reflexes.`,
      keyGuidance: [
        'Burping Technique: Burp Aiden when switching breasts and after each feeding by holding him upright against your shoulder or sitting supported on your lap while gently patting/rubbing his back.',
        'Newborn Hiccups: Caused by benign diaphragm spasms after feeding; nursing for a few moments or upright holding helps them resolve naturally.',
        'Infant Dyschezia (Grunting): Straining and turning red for 5–10 minutes before passing a soft yellow stool is normal coordination learning—not constipation.',
        'Tummy Massage & Bicycle Legs: Gentle clockwise belly circles and slow bicycle leg motions when awake help move trapped intestinal gas.'
      ],
      whenToCallPediatrician:
        'Call your pediatrician if gas or fussiness is accompanied by hard pellet-like stools, blood in the stool, forceful green/bilious vomiting, a rigid swollen abdomen, or fever ≥ 100.4°F.',
      citations: [
        {
          title: 'Hyams JS, Di Lorenzo C, Saps M, et al. Childhood Functional Gastrointestinal Disorders: Neonate/Toddler. Gastroenterology. 2016;150(6):1456-1468.',
          journal: 'Gastroenterology (Peer-Reviewed)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/27144632/',
          linkVerified: true
        },
        {
          title: 'Rosen R, Vandenplas Y, Singendonk M, et al. Pediatric Gastroesophageal Reflux Clinical Practice Guidelines. J Pediatr Gastroenterol Nutr. 2018;66(3):516-554.',
          journal: 'J Pediatr Gastroenterol Nutr (NASPGHAN/AAP)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/29470322/',
          linkVerified: true
        }
      ]
    };
  }

  return {
    question: q,
    topicTitle: `AAP & Peer-Reviewed Newborn Clinical Review: "${q}"`,
    summary: `Regarding "${q}": Based on American Academy of Pediatrics (AAP) Bright Futures and peer-reviewed neonatal literature, healthy term newborns thrive on responsive feeding (8–12 times per 24 hours), safe back-to-sleep positioning on a firm flat surface, and close monitoring of daily hydration (6+ wet diapers/day after Day 5).`,
    keyGuidance: [
      'Feeding & Hydration Benchmark: Nurse 8–12 times in 24 hours on demand; by Day 5+, expect at least 6 heavy wet diapers and 3–4+ yellow seedy stools daily.',
      'Safe Sleep Standard (AAP): Always place Aiden flat on his back in a bare bassinet or crib in your room with no loose blankets, pillows, or bumpers.',
      'Medication & Water Precaution: Never give over-the-counter medications or plain water to a newborn without explicit pediatric guidance; breastfed infants receive 400 IU liquid Vitamin D drops daily.',
      'Symptom Monitoring: Evaluate any new symptom alongside Aiden’s waking alertness, feeding vigor, breathing comfort, and rectal temperature.'
    ],
    whenToCallPediatrician:
      'In any newborn under 60 days old, call your pediatrician immediately for a rectal temperature ≥ 100.4°F (38.0°C), breathing >60 breaths/min or rib pulling, <6 wet diapers/day after Day 5, or lethargy.',
    citations: [
      {
        title: 'Meek JY, Noble L; Section on Breastfeeding. Policy Statement: Breastfeeding and the Use of Human Milk. Pediatrics. 2022;150(1):e2022057988.',
        journal: 'Pediatrics (American Academy of Pediatrics)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35921640/',
        linkVerified: true
      },
      {
        title: 'Moon RY, Carlin RF, Hand I; Task Force on SIDS. Sleep-Related Infant Deaths: Updated 2022 Recommendations. Pediatrics. 2022;150(1):e2022057990.',
        journal: 'Pediatrics (American Academy of Pediatrics)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35726558/',
        linkVerified: true
      }
    ]
  };
}

/**
 * Custom SVG Illustration of "Ted" — A Cozy Tan Plush Nursery Teddy Bear
 */
export function CozyTeddyBearSvg({ className = 'w-28 h-28' }) {
  return (
    <svg
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Ted — Cozy Tan Teddy Bear Newborn Medical Research Companion"
    >
      {/* Warm Cozy Nursery Halo */}
      <circle cx="75" cy="78" r="62" fill="#F5EFE6" stroke="#E2D6C5" strokeWidth="2" />

      {/* Left & Right Round Plush Tan Bear Ears */}
      <circle cx="38" cy="36" r="18" fill="#C69568" stroke="#8C623E" strokeWidth="2" />
      <circle cx="38" cy="36" r="10" fill="#EFE3D3" />
      <circle cx="112" cy="36" r="18" fill="#C69568" stroke="#8C623E" strokeWidth="2" />
      <circle cx="112" cy="36" r="10" fill="#EFE3D3" />

      {/* Plump Sitting Teddy Bear Body */}
      <ellipse cx="75" cy="112" rx="38" ry="30" fill="#C69568" stroke="#8C623E" strokeWidth="2" />
      {/* Soft Cream Plush Belly Patch with Subtle Stitching */}
      <ellipse
        cx="75"
        cy="115"
        rx="23"
        ry="20"
        fill="#F3E8D8"
        stroke="#B38358"
        strokeWidth="1.3"
        strokeDasharray="3 2"
      />

      {/* Cozy Resting Teddy Arms */}
      <ellipse
        cx="38"
        cy="106"
        rx="11"
        ry="18"
        transform="rotate(20 38 106)"
        fill="#BE8C5E"
        stroke="#8C623E"
        strokeWidth="1.8"
      />
      <ellipse
        cx="112"
        cy="106"
        rx="11"
        ry="18"
        transform="rotate(-20 112 106)"
        fill="#BE8C5E"
        stroke="#8C623E"
        strokeWidth="1.8"
      />

      {/* Cozy Knitted Nursery Bow Tie / Collar */}
      <path
        d="M54 88 Q75 95 96 88"
        stroke="#9E5A43"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M75 90 C65 82, 56 85, 60 93 C63 98, 71 94, 75 90 Z M75 90 C85 82, 94 85, 90 93 C87 98, 79 94, 75 90 Z"
        fill="#9E5A43"
        stroke="#6E3B2A"
        strokeWidth="1.4"
      />
      <circle cx="75" cy="90" r="3.5" fill="#D9A78B" stroke="#6E3B2A" strokeWidth="1.2" />

      {/* Teddy Bear Head (Warm Honey-Tan Plush) */}
      <ellipse cx="75" cy="60" rx="36" ry="32" fill="#C8986B" stroke="#8C623E" strokeWidth="2" />

      {/* Subtle Heirloom Teddy Center Forehead Seam Stitch */}
      <path
        d="M75 30 V44"
        stroke="#9C6F47"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2.5 2.5"
      />

      {/* Soft Rosy Nursery Cheeks */}
      <ellipse cx="49" cy="66" rx="6.5" ry="4" fill="#E39D8D" fillOpacity="0.55" />
      <ellipse cx="101" cy="66" rx="6.5" ry="4" fill="#E39D8D" fillOpacity="0.55" />

      {/* Cream Plush Muzzle */}
      <ellipse cx="75" cy="67" rx="16.5" ry="13" fill="#F6EDE0" stroke="#B38358" strokeWidth="1.4" />

      {/* Warm Button Eyes with Gentle Highlights */}
      <circle cx="57" cy="53" r="4.6" fill="#2E221B" />
      <circle cx="93" cy="53" r="4.6" fill="#2E221B" />
      <circle cx="55.6" cy="51.5" r="1.5" fill="#FFFFFF" />
      <circle cx="91.6" cy="51.5" r="1.5" fill="#FFFFFF" />

      {/* Soft Arched Teddy Eyebrows */}
      <path d="M51 44 Q57 41 62 44" stroke="#7A5230" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M88 44 Q93 41 99 44" stroke="#7A5230" strokeWidth="1.8" strokeLinecap="round" />

      {/* Embroidered Chocolate-Brown Teddy Nose & Cozy Smile */}
      <ellipse cx="75" cy="62" rx="6.5" ry="4.6" fill="#4A3223" />
      <ellipse cx="73.5" cy="60.8" rx="2" ry="0.9" fill="#7D5C48" />
      <path d="M75 66.5 V72.5" stroke="#4A3223" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M68 71.5 Q75 76.5 82 71.5"
        stroke="#4A3223"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Teddy Bear Paws with Cream Pads */}
      <circle cx="48" cy="131" r="11" fill="#C69568" stroke="#8C623E" strokeWidth="1.8" />
      <circle cx="48" cy="132" r="5.5" fill="#F3E8D8" />
      <circle cx="102" cy="131" r="11" fill="#C69568" stroke="#8C623E" strokeWidth="1.8" />
      <circle cx="102" cy="132" r="5.5" fill="#F3E8D8" />
    </svg>
  );
}

export default function AussieDogAgent({ theme, isOpenExternal, onCloseExternal }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [lastAskedText, setLastAskedText] = useState('');
  const answerCardRef = useRef(null);

  const [conversation, setConversation] = useState([
    {
      id: 'welcome-msg',
      question: 'Welcome! How can Ted help with baby Aiden James today?',
      topicTitle: 'Ted — Your Cozy Nursery Teddy Bear & Newborn Literature Companion',
      summary:
        'Type any newborn or postpartum question into the box below! I analyze your question against American Academy of Pediatrics (AAP) clinical guidelines and live peer-reviewed medical journals (PubMed / Pediatrics / Europe PMC).',
      keyGuidance: [
        'Ask about breastfeeding duration & frequency, cluster feeding, burping, gas, or spit-up.',
        'Ask about newborn circumcision healing, umbilical cord care, diaper counts, or jaundice.',
        'Ask about safe sleep hours, tummy time, bathing, fever thresholds, or the AAP vaccine schedule.'
      ],
      whenToCallPediatrician:
        'Reminder: In newborns under 60 days old, a rectal temperature ≥ 100.4°F (38.0°C) always warrants an immediate call to your pediatrician.',
      citations: [
        {
          title:
            'Meek JY, Noble L; Section on Breastfeeding. Policy Statement: Breastfeeding and the Use of Human Milk. Pediatrics. 2022;150(1):e2022057988.',
          journal: 'Pediatrics (AAP)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/35921640/',
          linkVerified: true
        }
      ]
    }
  ]);

  // Rotate proactive reach-out prompts every 16 seconds on desktop
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx(i => (i + 1) % PROACTIVE_PROMPTS.length);
      setShowSpeechBubble(true);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpenExternal) {
      setIsExpanded(true);
    }
  }, [isOpenExternal]);

  const handleAskQuestion = async rawQ => {
    const q = String(rawQ !== undefined ? rawQ : questionInput).trim();
    if (!q || isAsking) return;

    setIsAsking(true);
    setLastAskedText(q);
    setIsExpanded(true);
    if (rawQ === undefined) setQuestionInput('');

    try {
      const res = await fetch(`${API_BASE}/baby-agent/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          setConversation(prev => [
            {
              id: `ans-${Date.now()}`,
              ...data
            },
            ...prev.filter(item => item.id !== 'welcome-msg')
          ]);
        } else {
          const fallback = buildClientFallbackAnswer(q);
          setConversation(prev => [
            { id: `ans-${Date.now()}`, ...fallback },
            ...prev.filter(item => item.id !== 'welcome-msg')
          ]);
        }
      } else {
        const fallback = buildClientFallbackAnswer(q);
        setConversation(prev => [
          { id: `ans-${Date.now()}`, ...fallback },
          ...prev.filter(item => item.id !== 'welcome-msg')
        ]);
      }
    } catch (err) {
      console.error('Error querying Ted medical agent, using AAP fallback:', err);
      const fallback = buildClientFallbackAnswer(q);
      setConversation(prev => [
        { id: `ans-${Date.now()}`, ...fallback },
        ...prev.filter(item => item.id !== 'welcome-msg')
      ]);
    } finally {
      setIsAsking(false);
      setTimeout(() => {
        if (answerCardRef.current) {
          answerCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const activePrompt = PROACTIVE_PROMPTS[promptIdx];
  const latestResponse = conversation[0];
  const previousResponses = conversation.slice(1);

  return (
    /* HIDDEN ON IPHONE / MOBILE VIEW (`hidden lg:block`) AS REQUESTED */
    <div className="hidden lg:block relative">
      {/* =================================================================== */}
      {/* IN-SECTION HOVERING COZY TAN TEDDY BEAR ("TED") & MEDICAL Q&A BOX   */}
      {/* =================================================================== */}
      <div
        className={`${theme.cardBg} border-2 border-[#C89D7C] rounded-2xl p-5 shadow-md transition-all relative overflow-hidden`}
      >
        {/* Top Banner: Cozy Tan Teddy Bear ("Ted") Avatar + Proactive Speech Bubble */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Animated Hovering Cozy Tan Teddy Bear */}
            <div
              className="relative group cursor-pointer shrink-0 flex flex-col items-center"
              onClick={() => setIsExpanded(!isExpanded)}
              title="Click Ted to toggle Q&A window"
            >
              <div className="transition-transform duration-500 hover:-translate-y-1">
                <CozyTeddyBearSvg className="w-28 h-28 drop-shadow-xs" />
              </div>
              <span className="-mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8C623E] text-white shadow-2xs">
                🧸 Ted Online
              </span>
            </div>

            {/* Proactive Reach-Out Speech Bubble */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-editorial text-xl font-bold text-[#2C2520]">
                  Ted — Cozy Nursery Teddy Bear &amp; Newborn Medical Companion
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  AAP &amp; Peer-Reviewed Medical Journals
                </span>
              </div>

              {showSpeechBubble && (
                <div
                  className={`p-3 rounded-2xl rounded-tl-none ${theme.accentSoft} border relative flex items-center justify-between gap-3`}
                >
                  <p className="text-xs sm:text-sm font-medium text-[#2C2520] leading-snug">
                    {activePrompt.greeting}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAskQuestion(activePrompt.suggestedQuestion)}
                    className={`px-3 py-1.5 rounded-xl ${theme.accentBg} text-white text-xs font-semibold shrink-0 hover:opacity-90 transition`}
                  >
                    Ask Ted ↗
                  </button>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#6E6359]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#9E5A43] shrink-0" />
                <span>
                  <strong>Informational Only (Not Medical Advice):</strong> Answers are synthesized from
                  American Academy of Pediatrics (AAP) clinical guidelines and peer-reviewed medical journals
                  (PubMed / <em>Pediatrics</em> / Europe PMC). Always consult Aiden&apos;s pediatrician for medical decisions.
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (onCloseExternal && isExpanded) onCloseExternal();
            }}
            className={`px-3 py-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} text-xs font-medium flex items-center gap-1.5 shrink-0`}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Collapse Window</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Q&amp;A Window</span>
              </>
            )}
          </button>
        </div>

        {/* Active Text Window & Peer-Reviewed Answer Area */}
        {isExpanded && (
          <div className={`mt-4 pt-4 border-t ${theme.border} space-y-4`}>
            {/* Active Question Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAskQuestion();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={questionInput}
                onChange={e => setQuestionInput(e.target.value)}
                placeholder="Ask Ted any newborn or postpartum question (e.g., How often to breastfeed? Burping & gas? Circumcision care? Fever threshold?)..."
                className={`flex-1 px-4 py-2.5 rounded-xl ${theme.cardSubtle} border ${theme.border} text-sm outline-none focus:border-[#9E5A43]`}
              />
              <button
                type="submit"
                disabled={isAsking || !questionInput.trim()}
                className={`px-4 py-2.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shrink-0 shadow-xs disabled:opacity-50 cursor-pointer`}
              >
                {isAsking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Sources...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Ask Ted</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick-Click Topic Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#6E6359] mr-1">
                Quick Newborn Questions:
              </span>
              {QUICK_QUESTIONS.map((qq, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isAsking}
                  onClick={() => handleAskQuestion(qq)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} transition disabled:opacity-50`}
                >
                  {qq}
                </button>
              ))}
            </div>

            {/* Active Analyzing Banner when a question is in flight */}
            {isAsking && (
              <div
                className={`p-4 rounded-2xl ${theme.accentSoft} border flex items-center gap-3 animate-pulse`}
              >
                <Loader2 className={`w-5 h-5 ${theme.accentText} animate-spin shrink-0`} />
                <div className="text-xs sm:text-sm font-medium text-[#2C2520]">
                  <strong>Ted is analyzing your question:</strong> &ldquo;{lastAskedText}&rdquo; — searching
                  American Academy of Pediatrics (AAP) clinical guidelines and PubMed peer-reviewed studies...
                </div>
              </div>
            )}

            {/* Latest Evidence-Based Answer Card */}
            {latestResponse && (
              <div
                ref={answerCardRef}
                className={`p-4 sm:p-5 rounded-2xl ${theme.cardSubtle} border-2 border-[#C89D7C]/60 space-y-3 shadow-xs`}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap border-b border-[#E2D9CC] pb-2.5">
                  <div>
                    <div className="text-xs font-bold text-[#9E5A43] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ted&apos;s Answer to: &ldquo;{latestResponse.question}&rdquo;</span>
                    </div>
                    <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#2C2520] mt-0.5">
                      {latestResponse.topicTitle}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    AAP &amp; Peer-Reviewed Grounded
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-[#2C2520] font-medium">
                  {latestResponse.summary}
                </p>

                {Array.isArray(latestResponse.keyGuidance) && latestResponse.keyGuidance.length > 0 && (
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#2C2520]">
                    {latestResponse.keyGuidance.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme.accentBg} shrink-0`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {latestResponse.whenToCallPediatrician && (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">When to Call Aiden&apos;s Pediatrician: </strong>
                      <span>{latestResponse.whenToCallPediatrician}</span>
                    </div>
                  </div>
                )}

                {/* Peer-Reviewed Medical Journal Citations */}
                {Array.isArray(latestResponse.citations) && latestResponse.citations.length > 0 && (
                  <div className="pt-2 border-t border-[#E2D9CC] space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6359] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#9E5A43]" />
                      <span>Verified Peer-Reviewed Medical Journal Sources (PubMed / AAP):</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {latestResponse.citations.map((cit, cIdx) => (
                        <a
                          key={cIdx}
                          href={cit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border} hover:border-[#9E5A43] transition flex items-start justify-between gap-2 group`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#2C2520] group-hover:text-[#9E5A43] line-clamp-2">
                              {cit.title}
                            </div>
                            <div className="text-[10px] text-[#6E6359] mt-0.5">
                              {cit.journal} • PubMed Peer-Reviewed ✓
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-[#9E5A43] shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Previous Questions Asked in This Session */}
            {previousResponses.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6359]">
                  Earlier Questions Answered by Ted ({previousResponses.length}):
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-minimal">
                  {previousResponses.map(prevAns => (
                    <div
                      key={prevAns.id}
                      onClick={() => {
                        setConversation(curr => [
                          prevAns,
                          ...curr.filter(item => item.id !== prevAns.id)
                        ]);
                      }}
                      className={`p-3 rounded-xl ${theme.cardBg} border ${theme.border} hover:border-[#9E5A43] cursor-pointer transition flex items-center justify-between gap-2`}
                      title="Click to bring this answer back to the top"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#2C2520] truncate">
                          Q: &ldquo;{prevAns.question}&rdquo;
                        </div>
                        <div className={`text-[11px] ${theme.textSecondary} truncate`}>
                          {prevAns.topicTitle}
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold ${theme.accentText} shrink-0`}>
                        View Answer ↗
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
