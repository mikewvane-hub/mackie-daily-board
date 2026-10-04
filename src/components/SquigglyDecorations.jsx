import React from 'react';

/**
 * Warm-grey & neutral-toned palette for subtle seasonal micro-illustrations.
 * No uniform squiggly lines on tabs or card headers.
 */
const WARM_NEUTRAL = {
  stroke: '#7D746B',      // Warm stone grey
  strokeSoft: '#968C81',  // Muted taupe grey
  fillLight: '#E5DFD5',   // Warm linen grey fill
  fillMedium: '#CFC6B9',  // Soft travertine grey
  fillDark: '#6A625A'     // Charcoal taupe for tiny eyes/stems
};

/**
 * Removed uniform squiggly underlines on tabs per user request.
 */
export function SquigglyUnderline() {
  return null;
}

/**
 * Removed uniform squiggly lines across card headers per user request.
 */
export function CardHeaderSquiggle() {
  return null;
}

/**
 * Individual small warm-grey / neutral-toned seasonal SVG motifs
 */
function MiniWarmPumpkin({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 26" fill="none" className={className} aria-hidden="true">
      {/* Curved stem */}
      <path
        d="M14 6 C14 3, 16.5 2, 17.5 3.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Back ribs */}
      <ellipse
        cx="9.5"
        cy="15.5"
        rx="5.5"
        ry="7.5"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.45"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <ellipse
        cx="18.5"
        cy="15.5"
        rx="5.5"
        ry="7.5"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.45"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      {/* Center rib */}
      <ellipse
        cx="14"
        cy="16"
        rx="4.8"
        ry="8"
        fill={WARM_NEUTRAL.fillLight}
        fillOpacity="0.7"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
    </svg>
  );
}

function MiniJackOLantern({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 26" fill="none" className={className} aria-hidden="true">
      {/* Stem */}
      <path
        d="M14 5.5 C14 3, 16 2, 17 3"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Pumpkin silhouette in warm stone grey */}
      <path
        d="M14 6.5 C8 6, 4 10, 4.5 16 C5 21.5, 9.5 23.5, 14 23 C18.5 23.5, 23 21.5, 23.5 16 C24 10, 20 6, 14 6.5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.4"
      />
      {/* Subtle rib lines */}
      <path
        d="M10.5 7 C8.5 12, 8.5 18, 10.5 22.5 M17.5 7 C19.5 12, 19.5 18, 17.5 22.5"
        stroke={WARM_NEUTRAL.strokeSoft}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Cute little carved triangle eyes & smile in warm charcoal-grey */}
      <path d="M10.5 12 L12 14.5 L9 14.5 Z" fill={WARM_NEUTRAL.fillDark} />
      <path d="M17.5 12 L19 14.5 L16 14.5 Z" fill={WARM_NEUTRAL.fillDark} />
      <path
        d="M10 17.5 Q14 20 18 17.5"
        stroke={WARM_NEUTRAL.fillDark}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniCuteGhost({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      {/* Soft warm-grey sheet ghost with scalloped hem */}
      <path
        d="M13 3.5 C8 3.5, 5.5 7.5, 5.5 13.5 L5.5 21.5 C5.5 22.2, 6.8 22.2, 7.5 21 C8.3 19.8, 9.5 19.8, 10.3 21 C11.1 22.2, 12.2 22.2, 13 21 C13.8 19.8, 14.9 19.8, 15.7 21 C16.5 22.2, 17.7 22.2, 18.5 21 C19.2 19.8, 20.5 22.2, 20.5 21.5 L20.5 13.5 C20.5 7.5, 18 3.5, 13 3.5 Z"
        fill={WARM_NEUTRAL.fillLight}
        fillOpacity="0.85"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      {/* Expressive tiny eyes & little 'o' mouth */}
      <circle cx="10.8" cy="11.2" r="1.2" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="15.2" cy="11.2" r="1.2" fill={WARM_NEUTRAL.fillDark} />
      <ellipse cx="13" cy="13.8" rx="1" ry="1.3" fill={WARM_NEUTRAL.fillDark} opacity="0.75" />
    </svg>
  );
}

function MiniAutumnLeaf({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      {/* Scalloped oak leaf in warm taupe/grey */}
      <path
        d="M6 21 L9.5 17.5 M20 5 C16.5 5, 14.5 7, 15 9 C12.5 8, 10.5 9.5, 11.2 11.8 C9 11.2, 7.5 13, 8.8 15.2 C7.8 16.5, 9.5 18.2, 11 17.2 C13.2 18.5, 15 17, 14.4 14.8 C16.7 15.5, 18.2 13.5, 17.2 11 C19.2 11.5, 21 9.5, 21 6 C21 5.3, 20.5 5, 20 5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.45"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 17.5 L18.5 7.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniDecemberPineTree({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      {/* Subtle warm-grey minimalist Christmas evergreen */}
      <path
        d="M13 3.5 L8 10.5 H11 L6.5 16.5 H10 L5.5 21.5 H20.5 L16 16.5 H19.5 L15 10.5 H18 L13 3.5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.45"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M13 21.5 V24" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="13" cy="2.3" r="1.1" fill={WARM_NEUTRAL.stroke} />
    </svg>
  );
}

function MiniDecemberOrnament({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <path d="M13 2.5 V5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" strokeLinecap="round" />
      <rect
        x="11"
        y="5"
        width="4"
        height="2.2"
        rx="0.6"
        fill={WARM_NEUTRAL.fillMedium}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.1"
      />
      <circle
        cx="13"
        cy="14.8"
        r="7.2"
        fill={WARM_NEUTRAL.fillLight}
        fillOpacity="0.65"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <path
        d="M6.2 14.8 Q13 12 19.8 14.8"
        stroke={WARM_NEUTRAL.strokeSoft}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniSnowflake({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <path
        d="M13 4 V22 M4 13 H22 M6.8 6.8 L19.2 19.2 M19.2 6.8 L6.8 19.2"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="13" cy="13" r="2" fill={WARM_NEUTRAL.fillMedium} stroke={WARM_NEUTRAL.stroke} strokeWidth="1" />
    </svg>
  );
}

function MiniBotanicalSprig({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <path d="M6 21 Q13 13 20 5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" strokeLinecap="round" />
      <ellipse
        cx="11"
        cy="12"
        rx="2.5"
        ry="4.2"
        transform="rotate(-35 11 12)"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.45"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.1"
      />
      <ellipse
        cx="16"
        cy="14"
        rx="2.5"
        ry="4.2"
        transform="rotate(40 16 14)"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.45"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.1"
      />
    </svg>
  );
}

/**
 * Small, subtle warm-grey / neutral badge icon placed next to major headings.
 * Automatically adapts to October (Halloween + Fall pumpkins/leaves/ghosts/jack-o'-lanterns),
 * November (Fall pumpkins & leaves), and December (Christmas trees/ornaments/snowflakes).
 */
export function CutesyBadgeDoodle({ season = 'Autumn', variant = 0 }) {
  const month = new Date().getMonth() + 1; // 1..12
  const isOctober = month === 10 && season === 'Autumn';
  const isDecember = month === 12 || season === 'Winter';

  if (isDecember) {
    const winterIcons = [MiniDecemberPineTree, MiniSnowflake, MiniDecemberOrnament];
    const Chosen = winterIcons[Math.abs(variant) % winterIcons.length];
    return <Chosen className="w-5 h-5 shrink-0 inline-block opacity-85" />;
  }

  if (season === 'Spring' || season === 'Summer') {
    return <MiniBotanicalSprig className="w-5 h-5 shrink-0 inline-block opacity-80" />;
  }

  if (isOctober) {
    // October: Mix of warm-grey pumpkins, leaves, tiny ghosts & jack-o'-lanterns
    const octoberIcons = [
      MiniWarmPumpkin,
      MiniCuteGhost,
      MiniAutumnLeaf,
      MiniJackOLantern
    ];
    const Chosen = octoberIcons[Math.abs(variant) % octoberIcons.length];
    return <Chosen className="w-5 h-5 shrink-0 inline-block opacity-85" />;
  }

  // Standard Fall (Sept / Nov): Warm-grey pumpkins & autumn leaves
  const fallIcons = [MiniWarmPumpkin, MiniAutumnLeaf];
  const Chosen = fallIcons[Math.abs(variant) % fallIcons.length];
  return <Chosen className="w-5 h-5 shrink-0 inline-block opacity-85" />;
}

/**
 * Sparse, subtle background accents in warm-grey / neutral tones along the outer margins.
 * Designed to feel airy and never over-populated.
 */
export function SeasonalBackgroundDoodles({ season = 'Autumn' }) {
  const month = new Date().getMonth() + 1;
  const isOctober = month === 10 && season === 'Autumn';
  const isDecember = month === 12 || season === 'Winter';

  if (isDecember) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        <div className="absolute top-20 left-5 opacity-25">
          <MiniDecemberPineTree className="w-9 h-9" />
        </div>
        <div className="absolute top-28 right-7 opacity-20">
          <MiniSnowflake className="w-8 h-8" />
        </div>
        <div className="hidden xl:block absolute bottom-24 left-6 opacity-20">
          <MiniDecemberOrnament className="w-8 h-8" />
        </div>
        <div className="hidden xl:block absolute bottom-16 right-8 opacity-20">
          <MiniDecemberPineTree className="w-8 h-8" />
        </div>
      </div>
    );
  }

  if (season === 'Spring' || season === 'Summer') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        <div className="absolute top-20 left-5 opacity-20">
          <MiniBotanicalSprig className="w-9 h-9" />
        </div>
        <div className="absolute bottom-16 right-8 opacity-20">
          <MiniBotanicalSprig className="w-9 h-9" />
        </div>
      </div>
    );
  }

  // Autumn / October (Halloween + Harvest): Subtle warm-grey pumpkins, leaves, and in October tiny ghosts & jack-o'-lanterns
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Top-Left margin: Warm-grey pumpkin & falling leaf */}
      <div className="absolute top-20 left-4 flex items-center gap-2 opacity-25 -rotate-6">
        <MiniWarmPumpkin className="w-8 h-8" />
        <MiniAutumnLeaf className="w-6 h-6 rotate-12" />
      </div>

      {/* Top-Right margin: Subtle ghost & jack-o'-lantern in October, or leaf & pumpkin in Nov */}
      <div className="absolute top-24 right-5 flex items-center gap-2.5 opacity-25 rotate-6">
        {isOctober ? (
          <>
            <MiniCuteGhost className="w-7 h-7 -rotate-6" />
            <MiniJackOLantern className="w-7 h-7" />
          </>
        ) : (
          <>
            <MiniAutumnLeaf className="w-7 h-7 -rotate-12" />
            <MiniWarmPumpkin className="w-7 h-7" />
          </>
        )}
      </div>

      {/* Bottom-Left margin (Desktop only so mobile stays super clean) */}
      <div className="hidden xl:flex absolute bottom-20 left-5 items-center gap-2 opacity-25 rotate-3">
        {isOctober ? (
          <>
            <MiniJackOLantern className="w-7 h-7 -rotate-6" />
            <MiniAutumnLeaf className="w-6 h-6" />
          </>
        ) : (
          <MiniWarmPumpkin className="w-8 h-8" />
        )}
      </div>

      {/* Bottom-Right margin (Desktop only) */}
      <div className="hidden xl:flex absolute bottom-14 right-6 items-center gap-2 opacity-25 -rotate-3">
        {isOctober ? (
          <>
            <MiniWarmPumpkin className="w-7 h-7" />
            <MiniCuteGhost className="w-7 h-7 rotate-6" />
          </>
        ) : (
          <MiniAutumnLeaf className="w-8 h-8" />
        )}
      </div>
    </div>
  );
}
