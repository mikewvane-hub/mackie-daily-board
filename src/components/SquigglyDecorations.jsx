import React, { useState, useEffect } from 'react';

/**
 * Warm-grey & neutral-toned seasonal minimalist palette for subtle holiday & seasonal illustrations.
 */
const WARM_NEUTRAL = {
  stroke: '#786E65',      // Warm stone grey
  strokeSoft: '#968C81',  // Muted taupe grey
  fillLight: '#EBE5DC',   // Warm linen grey fill
  fillMedium: '#D2C8BA',  // Soft travertine grey
  fillAccent: '#B89F8D',  // Warm clay-taupe accent
  fillDark: '#5C534B'     // Charcoal taupe for eyes, buckles, cats & silhouettes
};

// Shared reactive state for holiday motif mode & manual/auto cycling across all components
let globalHolidayState = {
  holidayMode: 'Auto', // 'Auto' | 'Halloween' | 'Thanksgiving' | 'Christmas'
  cycleOffset: 0
};

export function setHolidayMotifMode(mode) {
  globalHolidayState = {
    ...globalHolidayState,
    holidayMode: mode,
    cycleOffset: globalHolidayState.cycleOffset + 1
  };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mackie-motif-update', { detail: globalHolidayState }));
  }
}

export function cycleHolidayMotifs() {
  globalHolidayState = {
    ...globalHolidayState,
    cycleOffset: globalHolidayState.cycleOffset + 1
  };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mackie-motif-update', { detail: globalHolidayState }));
  }
  return globalHolidayState;
}

function useHolidayMotifState() {
  const [state, setState] = useState(globalHolidayState);

  useEffect(() => {
    const handler = e => {
      if (e.detail) setState({ ...e.detail });
    };
    window.addEventListener('mackie-motif-update', handler);
    const autoTimer = setInterval(() => {
      globalHolidayState = {
        ...globalHolidayState,
        cycleOffset: globalHolidayState.cycleOffset + 1
      };
      setState({ ...globalHolidayState });
    }, 9000);
    return () => {
      window.removeEventListener('mackie-motif-update', handler);
      clearInterval(autoTimer);
    };
  }, []);

  return state;
}

export function SquigglyUnderline() {
  return null;
}

export function CardHeaderSquiggle() {
  return null;
}

/* ========================================================================== */
/* 1. HALLOWEEN / OCTOBER MOTIFS                                              */
/*    Ghosts, Candy Corn, Witch, Wolf & Moon, Potions, Scarecrows,            */
/*    Trick-or-Treaters, Cauldrons, Witch Brooms, Black Cats, Jack-o-Lanterns */
/* ========================================================================== */

function MiniCuteGhost({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Ghost</title>
      <path
        d="M14 3.5 C8.5 3.5, 6 7.8, 6 14 L6 22.5 C6 23.3, 7.3 23.2, 8.2 21.8 C9 20.5, 10.2 20.5, 11.1 21.8 C12 23, 13.1 23, 14 21.8 C14.9 20.5, 16 20.5, 16.9 21.8 C17.8 23, 19 23, 19.8 21.8 C20.7 20.5, 22 23.3, 22 22.5 L22 14 C22 7.8, 19.5 3.5, 14 3.5 Z"
        fill={WARM_NEUTRAL.fillLight}
        fillOpacity="0.9"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="11.5" r="1.25" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="16.5" cy="11.5" r="1.25" fill={WARM_NEUTRAL.fillDark} />
      <ellipse cx="14" cy="14.3" rx="1.1" ry="1.4" fill={WARM_NEUTRAL.fillDark} opacity="0.8" />
    </svg>
  );
}

function MiniCandyCorn({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Candy Corn</title>
      <path
        d="M14 4 C15.2 4, 22 19.5, 21.5 22 C21 24.2, 7 24.2, 6.5 22 C6 19.5, 12.8 4, 14 4 Z"
        fill={WARM_NEUTRAL.fillLight}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M10.3 12.2 H17.7 L20.1 18 H7.9 L10.3 12.2 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.58"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.1"
      />
      <path
        d="M7.9 18 H20.1 L21.4 21.8 C20.8 23.8, 7.2 23.8, 6.6 21.8 L7.9 18 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.8"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.1"
      />
    </svg>
  );
}

function MiniWitch({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Witch</title>
      <path
        d="M14.5 3.5 C15.5 3.5, 18.5 5, 19.5 6.2 C17 6.5, 16 8.5, 18 16.5 L9.5 16.5 C11 10, 12.5 5.5, 14.5 3.5 Z"
        fill={WARM_NEUTRAL.fillDark}
        fillOpacity="0.78"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9.3 15.2 H18.2" stroke={WARM_NEUTRAL.fillLight} strokeWidth="1.8" />
      <rect x="12.5" y="13.8" width="2.8" height="2.6" rx="0.4" stroke={WARM_NEUTRAL.fillLight} strokeWidth="1.1" fill={WARM_NEUTRAL.fillAccent} />
      <ellipse
        cx="14"
        cy="17"
        rx="10"
        ry="2.6"
        fill={WARM_NEUTRAL.fillDark}
        fillOpacity="0.82"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <path
        d="M9.5 18.8 C9.5 22.8, 18.5 22.8, 18.5 18.8"
        fill={WARM_NEUTRAL.fillLight}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.25"
      />
      <path d="M8.5 18.5 Q7 22 8.5 24 M19.5 18.5 Q21 22 19.5 24" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12.2" cy="20" r="0.8" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="15.8" cy="20" r="0.8" fill={WARM_NEUTRAL.fillDark} />
    </svg>
  );
}

function MiniWolfAndMoon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Wolf &amp; Moon</title>
      <circle
        cx="15.5"
        cy="12.5"
        r="8.5"
        fill={WARM_NEUTRAL.fillLight}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <circle cx="18.5" cy="9.5" r="1.4" fill={WARM_NEUTRAL.fillMedium} opacity="0.6" />
      <circle cx="13.5" cy="8.2" r="1" fill={WARM_NEUTRAL.fillMedium} opacity="0.5" />
      <path
        d="M6 24.5 L8.5 19.5 L9.2 15.2 L8.3 13.2 L10.2 14 L11.4 12.6 L11.8 14.2 L14.8 12.2 C15.2 13, 14.5 14.5, 13.2 15.2 L14.2 19.2 L16.5 24.5 Z"
        fill={WARM_NEUTRAL.fillDark}
        fillOpacity="0.85"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniPotionBottle({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Potion Bottle</title>
      <rect x="12" y="3.5" width="4" height="3" rx="0.8" fill={WARM_NEUTRAL.fillAccent} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" />
      <path d="M10.5 6.5 H17.5 M11.5 6.5 V10.5 M16.5 6.5 V10.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" strokeLinecap="round" />
      <circle
        cx="14"
        cy="17.2"
        r="7.2"
        fill={WARM_NEUTRAL.fillLight}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.35"
      />
      <path
        d="M7.5 17.5 Q11 15.5 14 17.5 T20.5 17.5 A6.5 6.5 0 0 1 7.5 17.5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.85"
      />
      <circle cx="12.5" cy="14.2" r="1" fill={WARM_NEUTRAL.stroke} />
      <circle cx="15.5" cy="12.8" r="0.8" fill={WARM_NEUTRAL.stroke} />
      <circle cx="14.2" cy="19.8" r="1.1" fill={WARM_NEUTRAL.stroke} />
    </svg>
  );
}

function MiniScarecrow({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Scarecrow</title>
      <path
        d="M6 11.5 Q14 9.5 22 11.5 L18.5 5.5 C16.5 4.5, 11.5 4.5, 9.5 5.5 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.65"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M4.5 11.5 Q14 13.5 23.5 11.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.5 12.2 L5.5 14.5 M8.8 12.5 L7.2 15 M20.5 12.2 L22.5 14.5 M19.2 12.5 L20.8 15" stroke={WARM_NEUTRAL.strokeSoft} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14" cy="17.2" r="5.5" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <circle cx="12" cy="16" r="0.9" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="16" cy="16" r="0.9" fill={WARM_NEUTRAL.fillDark} />
      <path d="M14 16.5 L15 18.2 H13 Z" fill={WARM_NEUTRAL.fillAccent} />
      <path d="M11.2 19.5 Q14 21.2 16.8 19.5" stroke={WARM_NEUTRAL.fillDark} strokeWidth="1.1" strokeDasharray="1.5 1.5" strokeLinecap="round" />
    </svg>
  );
}

function MiniTrickOrTreater({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Trick-or-Treater</title>
      <circle cx="12.5" cy="8.5" r="3.8" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <path d="M9.5 6 L10.2 3.8 L11.8 5.2 M15.5 6 L14.8 3.8 L13.2 5.2" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="11.3" cy="8.5" r="0.8" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="13.7" cy="8.5" r="0.8" fill={WARM_NEUTRAL.fillDark} />
      <path d="M8 23.5 L9.5 12.5 H15.5 L17 23.5 Z" fill={WARM_NEUTRAL.fillMedium} fillOpacity="0.65" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M15.5 14.5 L20.5 15.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="21.3" cy="18.2" rx="2.8" ry="2.3" fill={WARM_NEUTRAL.fillAccent} fillOpacity="0.7" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" />
      <path d="M19 17.5 C19 15, 23.5 15, 23.5 17.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
    </svg>
  );
}

function MiniCauldron({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Cauldron</title>
      <circle cx="11.5" cy="6.5" r="1.3" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
      <circle cx="15.5" cy="5" r="1" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
      <circle cx="14" cy="8.5" r="1.5" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
      <rect x="6.5" y="10" width="15" height="2.4" rx="1.2" fill={WARM_NEUTRAL.fillDark} fillOpacity="0.8" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" />
      <path
        d="M7.5 12.4 C5.5 16.5, 7 22, 14 22 C21 22, 22.5 16.5, 20.5 12.4 Z"
        fill={WARM_NEUTRAL.fillDark}
        fillOpacity="0.75"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <path d="M9.5 21.5 L8 24 M18.5 21.5 L20 24" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MiniWitchBroom({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Witch Broom</title>
      <path
        d="M22.5 4.5 C19.5 7.5, 16.5 10.5, 13.5 13.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13.5 13.5 C11.5 14, 9 16, 5 20.5 C7.5 22.5, 9.5 23.5, 11.5 25 C16 21, 18 18.5, 18.5 16.5 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.6"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M12 14.2 L15.8 18 M7.5 21.2 L11.5 17.2 M9.5 23 L13.5 19" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function MiniBlackCat({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Black Cat</title>
      <path
        d="M9 11 C9 8.5, 11 7, 13 7 C15 7, 17 8.5, 17 11 C17 12.5, 16 13.5, 16.5 15.5 C17.2 18, 17.5 21, 17 23 H9.5 C9 20.5, 9.5 17.5, 10 15.5 C10.5 13.5, 9 12.5, 9 11 Z"
        fill={WARM_NEUTRAL.fillDark}
        fillOpacity="0.82"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.25"
      />
      <path d="M9.5 8.5 L9 4.5 L12 7.2 Z M16.5 8.5 L17 4.5 L14 7.2 Z" fill={WARM_NEUTRAL.fillDark} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.15" strokeLinejoin="round" />
      <path d="M16.8 22 C20.5 22, 22.5 18.5, 21.5 15.5 C21 14, 19.5 14.5, 20 16" stroke={WARM_NEUTRAL.fillDark} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="11.5" cy="10.2" r="0.95" fill={WARM_NEUTRAL.fillLight} />
      <circle cx="14.5" cy="10.2" r="0.95" fill={WARM_NEUTRAL.fillLight} />
    </svg>
  );
}

function MiniWarmPumpkin({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 26" fill="none" className={className} aria-hidden="true">
      <title>Pumpkin</title>
      <path
        d="M14 6 C14 3, 16.5 2, 17.5 3.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse
        cx="9.5"
        cy="15.5"
        rx="5.5"
        ry="7.5"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <ellipse
        cx="18.5"
        cy="15.5"
        rx="5.5"
        ry="7.5"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.5"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <ellipse
        cx="14"
        cy="16"
        rx="4.8"
        ry="8"
        fill={WARM_NEUTRAL.fillLight}
        fillOpacity="0.75"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
    </svg>
  );
}

function MiniJackOLantern({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 26" fill="none" className={className} aria-hidden="true">
      <title>Jack-o&apos;-Lantern</title>
      <path
        d="M14 5.5 C14 3, 16 2, 17 3"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 6.5 C8 6, 4 10, 4.5 16 C5 21.5, 9.5 23.5, 14 23 C18.5 23.5, 23 21.5, 23.5 16 C24 10, 20 6, 14 6.5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.55"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.4"
      />
      <path
        d="M10.5 7 C8.5 12, 8.5 18, 10.5 22.5 M17.5 7 C19.5 12, 19.5 18, 17.5 22.5"
        stroke={WARM_NEUTRAL.strokeSoft}
        strokeWidth="1"
        strokeLinecap="round"
      />
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

/* ========================================================================== */
/* 2. THANKSGIVING / NOVEMBER MOTIFS                                          */
/*    Turkeys, Pilgrims, Multiple Leaves, Harvest Pumpkins & Oak Leaves       */
/* ========================================================================== */

function MiniTurkey({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Thanksgiving Turkey</title>
      <path
        d="M5 16 C4 10, 7 6, 10 8 C11 4.5, 17 4.5, 18 8 C21 6, 24 10, 23 16 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.55"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M10 8 L12 15 M14 5.5 V15 M18 8 L16 15" stroke={WARM_NEUTRAL.strokeSoft} strokeWidth="1" />
      <circle cx="14" cy="17.5" r="5" fill={WARM_NEUTRAL.fillMedium} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <circle cx="14" cy="12" r="2.8" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.25" />
      <path d="M13.2 12.2 L14.8 12.2 L14 13.6 Z" fill={WARM_NEUTRAL.fillDark} />
      <path d="M14.6 12.8 Q15.5 14 14.8 14.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M12.2 22.5 V25 M15.8 22.5 V25" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MiniPilgrim({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Pilgrim</title>
      <path
        d="M9 6 H19 L20.2 14.5 H7.8 L9 6 Z"
        fill={WARM_NEUTRAL.fillDark}
        fillOpacity="0.8"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.1 12.5 H19.9" stroke={WARM_NEUTRAL.fillLight} strokeWidth="2" />
      <rect x="12.3" y="11" width="3.4" height="3" rx="0.4" fill={WARM_NEUTRAL.fillAccent} stroke={WARM_NEUTRAL.fillLight} strokeWidth="1.1" />
      <path d="M4.5 14.8 H23.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 15.2 C9.5 20.5, 18.5 20.5, 18.5 15.2" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.25" />
      <circle cx="12.2" cy="17" r="0.8" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="15.8" cy="17" r="0.8" fill={WARM_NEUTRAL.fillDark} />
      <path d="M8.5 20.5 L14 23.5 L19.5 20.5" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function MiniMultipleLeaves({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Multiple Autumn Leaves</title>
      <path
        d="M5 19 L8 16 M12 6 L10 9.5 L6.5 8.5 L8 12 L5.5 13.5 L9 15.5 L11.5 14.5 L13.5 11.5 L12 6 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.55"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 23 L16.5 20 M22.5 9.5 C19.5 9.5, 18 11, 18.5 13 C16.5 12.2, 15 13.5, 15.5 15.5 C14 15.2, 13 16.8, 14 18.5 C15.8 19.5, 17.5 18.5, 17 16.8 C19 17.2, 20.5 15.8, 19.8 13.8 C21.5 14, 23 12.5, 22.5 9.5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.7"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M15 4 C18 5, 18.5 8, 15.5 9.5 C13.5 8, 13.5 5.5, 15 4 Z"
        fill={WARM_NEUTRAL.fillLight}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.1"
      />
    </svg>
  );
}

function MiniAutumnLeaf({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <title>Oak Leaf</title>
      <path
        d="M6 21 L9.5 17.5 M20 5 C16.5 5, 14.5 7, 15 9 C12.5 8, 10.5 9.5, 11.2 11.8 C9 11.2, 7.5 13, 8.8 15.2 C7.8 16.5, 9.5 18.2, 11 17.2 C13.2 18.5, 15 17, 14.4 14.8 C16.7 15.5, 18.2 13.5, 17.2 11 C19.2 11.5, 21 9.5, 21 6 C21 5.3, 20.5 5, 20 5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.5"
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

/* ========================================================================== */
/* 3. CHRISTMAS / DECEMBER MOTIFS                                             */
/*    Snowmen/Frosty, Christmas Trees, Decorations, Snowflakes,               */
/*    Mittens, Presents, Santa, Reindeer                                      */
/* ========================================================================== */

function MiniFrostySnowman({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Frosty the Snowman</title>
      <rect x="10.5" y="2.8" width="7" height="4.2" rx="0.6" fill={WARM_NEUTRAL.fillDark} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
      <path d="M8.5 7 H19.5" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="14" cy="10.8" r="3.8" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.25" />
      <circle cx="14" cy="19.5" r="5.5" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <path d="M10.5 13.8 Q14 15 17.5 13.8 M16 14.2 L17.2 18.2" stroke={WARM_NEUTRAL.fillAccent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12.7" cy="10" r="0.7" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="15.3" cy="10" r="0.7" fill={WARM_NEUTRAL.fillDark} />
      <path d="M14 10.8 L17.2 11.4 L14 11.8 Z" fill={WARM_NEUTRAL.fillAccent} />
      <circle cx="14" cy="17.8" r="0.8" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="14" cy="20.5" r="0.8" fill={WARM_NEUTRAL.fillDark} />
    </svg>
  );
}

function MiniDecemberPineTree({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <title>Christmas Tree</title>
      <path
        d="M13 3.5 L8 10.5 H11 L6.5 16.5 H10 L5.5 21.5 H20.5 L16 16.5 H19.5 L15 10.5 H18 L13 3.5 Z"
        fill={WARM_NEUTRAL.fillMedium}
        fillOpacity="0.55"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M13 21.5 V24" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="13" cy="2.3" r="1.2" fill={WARM_NEUTRAL.fillAccent} stroke={WARM_NEUTRAL.stroke} strokeWidth="0.8" />
      <circle cx="11.5" cy="13.5" r="0.9" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="15" cy="18" r="0.9" fill={WARM_NEUTRAL.fillDark} />
    </svg>
  );
}

function MiniDecemberOrnament({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <title>Christmas Decoration</title>
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
        fillOpacity="0.75"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
      />
      <path
        d="M6.2 14.8 Q13 12 19.8 14.8 M6.2 16.8 Q13 14 19.8 16.8"
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
      <title>Snowflake</title>
      <path
        d="M13 3.5 V22.5 M3.5 13 H22.5 M6.3 6.3 L19.7 19.7 M19.7 6.3 L6.3 19.7"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="13" cy="13" r="2.2" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
    </svg>
  );
}

function MiniMittens({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Mittens</title>
      <rect x="8.5" y="5" width="9" height="3.2" rx="1" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.25" />
      <path
        d="M9 8.2 V17.5 C9 21, 17 21, 17 17.5 V14.5 L20 12.5 C21.2 11.5, 20 9.8, 18.5 10.6 L17 11.8 V8.2 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.55"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M10.5 13.5 H15.5" stroke={WARM_NEUTRAL.fillLight} strokeWidth="1.1" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

function MiniPresent({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Present</title>
      <path
        d="M14 8.5 C11 5, 8.5 6.5, 10.5 8.5 C12 9.5, 14 8.5, 14 8.5 C14 8.5, 16 9.5, 17.5 8.5 C19.5 6.5, 17 5, 14 8.5 Z"
        fill={WARM_NEUTRAL.fillAccent}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.25"
      />
      <rect x="6" y="8.5" width="16" height="3.2" rx="0.8" fill={WARM_NEUTRAL.fillMedium} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <rect x="7" y="11.7" width="14" height="11.3" rx="1" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <path d="M14 8.5 V23 M7 17 H21" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.8" />
    </svg>
  );
}

function MiniSanta({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Santa Claus</title>
      <path
        d="M8.5 10.5 C9.5 5.5, 16.5 4, 21 8.5 L18.5 10.5 Z"
        fill={WARM_NEUTRAL.fillAccent}
        fillOpacity="0.7"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="21.8" cy="8.8" r="1.8" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.15" />
      <rect x="7.5" y="10" width="12" height="2.8" rx="1.4" fill={WARM_NEUTRAL.fillLight} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.2" />
      <circle cx="13.5" cy="14.5" r="3.5" fill={WARM_NEUTRAL.fillMedium} fillOpacity="0.4" />
      <circle cx="12" cy="14" r="0.75" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="15" cy="14" r="0.75" fill={WARM_NEUTRAL.fillDark} />
      <path
        d="M8.5 15.5 C7.5 19.5, 10 23.5, 13.5 24 C17 23.5, 19.5 19.5, 18.5 15.5 Q16 17 13.5 16 Q11 17 8.5 15.5 Z"
        fill={WARM_NEUTRAL.fillLight}
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniReindeer({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <title>Reindeer</title>
      <path
        d="M10.5 11 L8 5.5 M8.8 7.5 L6 8 M9.5 9 L11.5 6.8 M17.5 11 L20 5.5 M19.2 7.5 L22 8 M18.5 9 L16.5 6.8"
        stroke={WARM_NEUTRAL.stroke}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <ellipse cx="7.8" cy="12.5" rx="2" ry="1.1" transform="rotate(-25 7.8 12.5)" fill={WARM_NEUTRAL.fillMedium} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
      <ellipse cx="20.2" cy="12.5" rx="2" ry="1.1" transform="rotate(25 20.2 12.5)" fill={WARM_NEUTRAL.fillMedium} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.1" />
      <ellipse cx="14" cy="16.5" rx="5.2" ry="5.8" fill={WARM_NEUTRAL.fillMedium} fillOpacity="0.6" stroke={WARM_NEUTRAL.stroke} strokeWidth="1.3" />
      <circle cx="12" cy="15" r="0.85" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="16" cy="15" r="0.85" fill={WARM_NEUTRAL.fillDark} />
      <circle cx="14" cy="18.8" r="1.9" fill={WARM_NEUTRAL.fillAccent} stroke={WARM_NEUTRAL.stroke} strokeWidth="1.15" />
    </svg>
  );
}

function MiniBotanicalSprig({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" className={className} aria-hidden="true">
      <title>Botanical Sprig</title>
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

export const HALLOWEEN_MOTIFS = [
  { name: 'Ghost', Comp: MiniCuteGhost },
  { name: 'Candy Corn', Comp: MiniCandyCorn },
  { name: 'Witch', Comp: MiniWitch },
  { name: 'Wolf & Moon', Comp: MiniWolfAndMoon },
  { name: 'Potion', Comp: MiniPotionBottle },
  { name: 'Scarecrow', Comp: MiniScarecrow },
  { name: 'Trick-or-Treater', Comp: MiniTrickOrTreater },
  { name: 'Cauldron', Comp: MiniCauldron },
  { name: 'Witch Broom', Comp: MiniWitchBroom },
  { name: 'Black Cat', Comp: MiniBlackCat },
  { name: 'Jack-o-Lantern', Comp: MiniJackOLantern },
  { name: 'Pumpkin', Comp: MiniWarmPumpkin }
];

export const THANKSGIVING_MOTIFS = [
  { name: 'Turkey', Comp: MiniTurkey },
  { name: 'Pilgrim', Comp: MiniPilgrim },
  { name: 'Multiple Leaves', Comp: MiniMultipleLeaves },
  { name: 'Harvest Pumpkin', Comp: MiniWarmPumpkin },
  { name: 'Oak Leaf', Comp: MiniAutumnLeaf }
];

export const CHRISTMAS_MOTIFS = [
  { name: 'Frosty Snowman', Comp: MiniFrostySnowman },
  { name: 'Christmas Tree', Comp: MiniDecemberPineTree },
  { name: 'Decoration', Comp: MiniDecemberOrnament },
  { name: 'Snowflake', Comp: MiniSnowflake },
  { name: 'Mittens', Comp: MiniMittens },
  { name: 'Present', Comp: MiniPresent },
  { name: 'Santa', Comp: MiniSanta },
  { name: 'Reindeer', Comp: MiniReindeer }
];

export function getActiveMotifSet(season = 'Autumn', holidayMode = 'Auto') {
  if (holidayMode === 'Halloween') return HALLOWEEN_MOTIFS;
  if (holidayMode === 'Thanksgiving') return THANKSGIVING_MOTIFS;
  if (holidayMode === 'Christmas') return CHRISTMAS_MOTIFS;

  const month = new Date().getMonth() + 1; // 1..12
  if (month === 12 || season === 'Winter') return CHRISTMAS_MOTIFS;
  if (month === 11 && season === 'Autumn') return THANKSGIVING_MOTIFS;
  if (month === 10 && season === 'Autumn') return HALLOWEEN_MOTIFS;
  if (season === 'Spring' || season === 'Summer') {
    return [{ name: 'Botanical', Comp: MiniBotanicalSprig }];
  }
  return [...HALLOWEEN_MOTIFS, ...THANKSGIVING_MOTIFS];
}

/**
 * Small warm-grey / neutral motif pair placed next to section headings & card titles.
 * Automatically cycles through all the motifs in the active holiday/season set!
 */
export function CutesyBadgeDoodle({ season = 'Autumn', variant = 0 }) {
  const { holidayMode, cycleOffset } = useHolidayMotifState();
  const motifs = getActiveMotifSet(season, holidayMode);
  const idx1 = Math.abs(variant * 2 + cycleOffset) % motifs.length;
  const idx2 = Math.abs(variant * 2 + 1 + cycleOffset) % motifs.length;
  const First = motifs[idx1].Comp;
  const Second = motifs[idx2].Comp;

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0 opacity-85">
      <First className="w-5 h-5" />
      {motifs.length > 1 && <Second className="w-4 h-4 opacity-75" />}
    </span>
  );
}

/**
 * Subtle horizontal aesthetic motif garland placed between sections so the seasonal
 * characters (ghosts, candy corn, witch, wolf & moon, potions, scarecrows, trick-or-treaters,
 * cauldrons, witch brooms, black cats / turkeys, pilgrims, multiple leaves / Frosty,
 * Christmas trees, ornaments, snowflakes, mittens, presents, Santa, reindeer) enrich the page aesthetic.
 */
export function SeasonalMotifRibbon({ season = 'Autumn', rowSeed = 0 }) {
  const { holidayMode, cycleOffset } = useHolidayMotifState();
  const motifs = getActiveMotifSet(season, holidayMode);
  if (motifs.length <= 1) return null;

  const count = Math.min(8, motifs.length);
  const items = Array.from({ length: count }, (_, i) => {
    return motifs[(i + cycleOffset + rowSeed * 3) % motifs.length];
  });

  return (
    <div
      className="flex items-center justify-center gap-5 sm:gap-8 py-1 opacity-65 select-none pointer-events-none flex-wrap"
      aria-hidden="true"
    >
      {items.map((item, idx) => {
        const Icon = item.Comp;
        return (
          <div key={`${item.name}-${idx}`} className="flex items-center gap-1.5">
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-mono tracking-wide text-[#8C8277] hidden md:inline">
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Scattered warm-grey / neutral seasonal & holiday illustrations around the page margins.
 */
export function SeasonalBackgroundDoodles({ season = 'Autumn' }) {
  const { holidayMode, cycleOffset } = useHolidayMotifState();
  const motifs = getActiveMotifSet(season, holidayMode);

  const pick = slot => {
    const entry = motifs[Math.abs(slot + cycleOffset) % motifs.length];
    return entry.Comp;
  };

  const M0 = pick(0);
  const M1 = pick(1);
  const M2 = pick(2);
  const M3 = pick(3);
  const M4 = pick(4);
  const M5 = pick(5);
  const M6 = pick(6);
  const M7 = pick(7);
  const M8 = pick(8);
  const M9 = pick(9);
  const M10 = pick(10);
  const M11 = pick(11);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Top-Left Cluster */}
      <div className="absolute top-20 left-3 sm:left-5 flex items-center gap-2.5 opacity-30 -rotate-6">
        <M0 className="w-8 h-8" />
        <M1 className="w-6 h-6 rotate-12" />
      </div>

      {/* Top-Right Cluster */}
      <div className="absolute top-24 right-3 sm:right-5 flex items-center gap-2.5 opacity-30 rotate-6">
        <M2 className="w-7 h-7 -rotate-6" />
        <M3 className="w-8 h-8" />
      </div>

      {/* Upper-Mid Left Margin */}
      <div className="hidden lg:flex absolute top-[32%] left-4 flex-col items-center gap-3 opacity-25">
        <M4 className="w-7 h-7 rotate-6" />
        <M5 className="w-6 h-6 -rotate-12" />
      </div>

      {/* Upper-Mid Right Margin */}
      <div className="hidden lg:flex absolute top-[36%] right-4 flex-col items-center gap-3 opacity-25">
        <M6 className="w-7 h-7 -rotate-6" />
        <M7 className="w-6 h-6 rotate-12" />
      </div>

      {/* Lower-Mid Left Margin */}
      <div className="hidden lg:flex absolute top-[64%] left-5 flex-col items-center gap-3 opacity-25">
        <M8 className="w-7 h-7 -rotate-6" />
        <M9 className="w-6 h-6 rotate-6" />
      </div>

      {/* Lower-Mid Right Margin */}
      <div className="hidden lg:flex absolute top-[68%] right-5 flex-col items-center gap-3 opacity-25">
        <M10 className="w-7 h-7 rotate-6" />
        <M11 className="w-6 h-6 -rotate-6" />
      </div>

      {/* Bottom-Left Cluster */}
      <div className="hidden sm:flex absolute bottom-16 left-5 items-center gap-2.5 opacity-30 rotate-3">
        <M4 className="w-8 h-8 -rotate-6" />
        <M8 className="w-6 h-6" />
      </div>

      {/* Bottom-Right Cluster */}
      <div className="hidden sm:flex absolute bottom-12 right-6 items-center gap-2.5 opacity-30 -rotate-3">
        <M6 className="w-7 h-7" />
        <M10 className="w-8 h-8 rotate-6" />
      </div>
    </div>
  );
}
