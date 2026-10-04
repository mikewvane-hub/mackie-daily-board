import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Baby, ChevronLeft, ChevronRight } from 'lucide-react';
import { BABY_PROFILE, WEEKLY_PREGNANCY_ENCOURAGEMENTS } from '../data/aapNewbornData';
import { CutesyBadgeDoodle, CardHeaderSquiggle } from './SquigglyDecorations';

export default function BabyCountdownBanner({ theme, activeSeason }) {
  const [now, setNow] = useState(() => new Date());
  const [manualWeekIdx, setManualWeekIdx] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const dueDate = new Date(BABY_PROFILE.dueDateISO);
  const diffMs = dueDate.getTime() - now.getTime();
  const isPastDue = diffMs <= 0;

  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const daysLeft = Math.floor(totalMinutes / (60 * 24));
  const hoursLeft = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutesLeft = totalMinutes % 60;
  const weeksLeftApprox = Math.max(0, Math.min(5, Math.ceil(daysLeft / 7)));

  // Pick the matching weekly encouragement based on weeks remaining (or manual override)
  const autoIdx = WEEKLY_PREGNANCY_ENCOURAGEMENTS.findIndex(
    w => w.weekLeft === weeksLeftApprox
  );
  const resolvedIdx =
    manualWeekIdx !== null
      ? manualWeekIdx
      : autoIdx !== -1
      ? autoIdx
      : 1;

  const currentEncouragement =
    WEEKLY_PREGNANCY_ENCOURAGEMENTS[resolvedIdx] || WEEKLY_PREGNANCY_ENCOURAGEMENTS[1];

  const handlePrevWeek = () => {
    setManualWeekIdx(prev => {
      const cur = prev !== null ? prev : resolvedIdx;
      return (cur - 1 + WEEKLY_PREGNANCY_ENCOURAGEMENTS.length) % WEEKLY_PREGNANCY_ENCOURAGEMENTS.length;
    });
  };

  const handleNextWeek = () => {
    setManualWeekIdx(prev => {
      const cur = prev !== null ? prev : resolvedIdx;
      return (cur + 1) % WEEKLY_PREGNANCY_ENCOURAGEMENTS.length;
    });
  };

  return (
    <div
      className={`relative overflow-hidden ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left 5 cols: Baby Aiden James Vane Countdown */}
        <div className="lg:col-span-5 flex flex-col gap-3 border-b lg:border-b-0 lg:border-r border-[#E2D9CC] pb-3.5 lg:pb-0 lg:pr-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl ${theme.accentSoft} flex items-center justify-center shadow-2xs`}>
                <Baby className={`w-5 h-5 ${theme.accentText}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6E6359]">
                    First Baby Countdown • Baby Boy
                  </span>
                  <CutesyBadgeDoodle season={activeSeason} variant={1} />
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2520]">
                  {BABY_PROFILE.fullName}
                </h2>
              </div>
            </div>

            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${theme.accentSoft}`}>
              Due {BABY_PROFILE.dueDateLabel}
            </span>
          </div>

          {/* Countdown Pill Boxes */}
          {!isPastDue ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className={`p-2.5 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
                <div className={`font-editorial text-2xl sm:text-3xl font-bold leading-none ${theme.accentText}`}>
                  {daysLeft}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6E6359] mt-1">
                  Days To Go
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
                <div className="font-editorial text-2xl sm:text-3xl font-bold leading-none">
                  {hoursLeft}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6E6359] mt-1">
                  Hours
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
                <div className="font-editorial text-2xl sm:text-3xl font-bold leading-none">
                  {minutesLeft}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6E6359] mt-1">
                  Minutes
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${theme.accentSoft} border`}>
                <div className="font-editorial text-2xl sm:text-3xl font-bold leading-none">
                  Wk {currentEncouragement.gestationalWeek}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold mt-1">
                  Pregnancy
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-3 rounded-xl ${theme.accentSoft} border text-center font-editorial text-xl font-semibold`}>
              Welcome to the World, Sweet {BABY_PROFILE.fullName}! 💙
            </div>
          )}
        </div>

        {/* Right 7 cols: Positive Quote for Mackie & Specific Baby Development This Week */}
        <div className="lg:col-span-7 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${theme.accentText} fill-current`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6359]">
                Weekly Note for Mackie &amp; What Aiden is Developing (Week {currentEncouragement.gestationalWeek})
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                Size: {currentEncouragement.sizeComparison}
              </span>
              <button
                type="button"
                onClick={handlePrevWeek}
                className={`p-1 rounded-lg border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} transition`}
                title="View previous week's development & note"
                aria-label="Previous week note"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextWeek}
                className={`p-1 rounded-lg border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} transition`}
                title="View next week's development & note"
                aria-label="Next week note"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Positive Quote / Encouragement for Mackie */}
          <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border} flex items-start gap-2.5`}>
            <Sparkles className={`w-4 h-4 ${theme.accentText} shrink-0 mt-0.5`} />
            <p className="font-editorial text-base sm:text-lg italic leading-snug text-[#2C2520]">
              &ldquo;{currentEncouragement.quoteForMackie}&rdquo;
            </p>
          </div>

          {/* Specific Baby Development Highlight */}
          <div className="text-xs sm:text-sm leading-relaxed text-[#2C2520] flex items-start gap-2 px-1">
            <span className={`font-semibold shrink-0 ${theme.accentText}`}>
              Growing This Week:
            </span>
            <span className={theme.textSecondary}>
              {currentEncouragement.developingThisWeek}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
