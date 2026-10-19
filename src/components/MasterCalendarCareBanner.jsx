import React, { useState, useMemo, useEffect } from 'react';
import {
  Baby,
  Footprints,
  Moon,
  Sparkles,
  Heart,
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Thermometer,
  Clock,
  Droplets,
  Bath,
  Smile,
  ShieldCheck,
  ChevronRight,
  Info,
  Bed,
  ArrowLeft,
  Check
} from 'lucide-react';

import ErrorBoundary from './ErrorBoundary';

import {
  AAP_WEEKLY_GUIDES,
  AAP_VACCINE_SCHEDULE,
  WEEKLY_PREGNANCY_ENCOURAGEMENTS,
  BABY_PROFILE
} from '../data/aapNewbornData';

import {
  POSTPARTUM_TIMELINE_PHASES,
  CYCLE_PHASES_GUIDE
} from '../data/postpartumFitnessData';

export default function MasterCalendarCareBanner({
  theme,
  activeSeason,
  calendarWeekOffset = 0,
  calendarTodayDate,
  healthFitness = {},
  onUpdateHealthFitness,
  onAddEventToCalendar,
  showToast
}) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('aap'); // 'aap' | 'postpartum' | 'cycle'
  const [selectedAapWeekId, setSelectedAapWeekId] = useState(null);
  const [selectedPhaseOverride, setSelectedPhaseOverride] = useState(null);

  // Cycle Tracker Input States inside Modal
  const [customCycleDate, setCustomCycleDate] = useState(new Date().toISOString().split('T')[0]);
  const [cycleFlow, setCycleFlow] = useState('Medium');
  const [cycleNotes, setCycleNotes] = useState('');
  const [showAddCycleForm, setShowAddCycleForm] = useState(false);

  // Delivery Anchor Date (defaults to Aiden's due date: Nov 3, 2026)
  const deliveryDateStr = healthFitness?.deliveryDate || '2026-11-03';

  // Keyboard Escape listener to close modal smoothly
  useEffect(() => {
    if (!showDetailModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDetailModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDetailModal]);

  // --------------------------------------------------------------------------
  // Dynamic Week Calculation based on calendarWeekOffset & Current Date
  // --------------------------------------------------------------------------
  const weekContext = useMemo(() => {
    const todayStr = calendarTodayDate || new Date().toISOString().split('T')[0];
    const todayObj = new Date(todayStr + 'T12:00:00');

    // Start of the currently viewed week in Master Calendar
    const viewedWeekStart = new Date(todayObj);
    viewedWeekStart.setDate(todayObj.getDate() + calendarWeekOffset * 7);

    const deliveryObj = new Date(deliveryDateStr + 'T12:00:00');
    const diffTime = viewedWeekStart.getTime() - deliveryObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const isPostpartum = diffDays >= 0;
    const babyWeekNum = isPostpartum ? Math.floor(diffDays / 7) + 1 : 0;
    const weeksUntilDue = !isPostpartum ? Math.max(1, Math.ceil(Math.abs(diffDays) / 7)) : 0;
    const gestationalWeek = Math.min(40, Math.max(30, 40 - weeksUntilDue));

    // Matching AAP Guide
    let matchedAapGuide = AAP_WEEKLY_GUIDES[0];
    if (babyWeekNum <= 1) matchedAapGuide = AAP_WEEKLY_GUIDES[0];
    else if (babyWeekNum === 2) matchedAapGuide = AAP_WEEKLY_GUIDES[1];
    else if (babyWeekNum === 3) matchedAapGuide = AAP_WEEKLY_GUIDES[2];
    else if (babyWeekNum === 4) matchedAapGuide = AAP_WEEKLY_GUIDES[3];
    else if (babyWeekNum <= 8) matchedAapGuide = AAP_WEEKLY_GUIDES[4];
    else matchedAapGuide = AAP_WEEKLY_GUIDES[5];

    // Matching Postpartum Timeline Phase
    let matchedPpPhase = POSTPARTUM_TIMELINE_PHASES[0];
    if (isPostpartum) {
      matchedPpPhase =
        POSTPARTUM_TIMELINE_PHASES.find(
          p => babyWeekNum >= p.minWeek && babyWeekNum <= p.maxWeek
        ) || POSTPARTUM_TIMELINE_PHASES[POSTPARTUM_TIMELINE_PHASES.length - 1];
    } else {
      matchedPpPhase = POSTPARTUM_TIMELINE_PHASES[0]; // 'pre-birth'
    }

    // Pregnancy encouragement (if pre-birth)
    const pregEncouragement =
      WEEKLY_PREGNANCY_ENCOURAGEMENTS.find(e => e.weekLeft === weeksUntilDue) ||
      WEEKLY_PREGNANCY_ENCOURAGEMENTS.find(e => e.gestationalWeek === gestationalWeek) ||
      WEEKLY_PREGNANCY_ENCOURAGEMENTS[WEEKLY_PREGNANCY_ENCOURAGEMENTS.length - 1];

    return {
      isPostpartum,
      babyWeekNum,
      weeksUntilDue,
      gestationalWeek,
      matchedAapGuide,
      matchedPpPhase,
      pregEncouragement
    };
  }, [calendarWeekOffset, calendarTodayDate, deliveryDateStr]);

  // Is Tab 1 in Pre-Birth View?
  const isPreBirthAapView = useMemo(() => {
    if (selectedAapWeekId === 'pre-birth') return true;
    if (selectedAapWeekId && selectedAapWeekId !== 'pre-birth') return false;
    return !weekContext.isPostpartum;
  }, [selectedAapWeekId, weekContext.isPostpartum]);

  // Active AAP guide in modal (supports manual toggle or defaults to viewed week)
  const activeModalAapGuide = useMemo(() => {
    if (selectedAapWeekId && selectedAapWeekId !== 'pre-birth') {
      return AAP_WEEKLY_GUIDES.find(w => w.id === selectedAapWeekId) || weekContext.matchedAapGuide;
    }
    return weekContext.matchedAapGuide;
  }, [selectedAapWeekId, weekContext.matchedAapGuide]);

  // Active Postpartum Phase in modal (supports manual toggle or defaults to viewed week)
  const activeModalPpPhase = useMemo(() => {
    if (selectedPhaseOverride) {
      return POSTPARTUM_TIMELINE_PHASES.find(p => p.id === selectedPhaseOverride) || weekContext.matchedPpPhase;
    }
    return weekContext.matchedPpPhase;
  }, [selectedPhaseOverride, weekContext.matchedPpPhase]);

  // --------------------------------------------------------------------------
  // Postpartum Cycle & Hormonal Tracking Logic
  // --------------------------------------------------------------------------
  const sortedCycleLogs = useMemo(() => {
    return [...(healthFitness.cycleLogs || [])].sort((a, b) =>
      (b.startDate || '').localeCompare(a.startDate || '')
    );
  }, [healthFitness.cycleLogs]);

  const cycleSummary = useMemo(() => {
    const avgLen = Number(healthFitness.averageCycleLength) || 28;
    if (sortedCycleLogs.length === 0) {
      return {
        hasLogged: false,
        lastStart: null,
        daysSince: null,
        currentPhase: null,
        predictedNext: null,
        ovulationDay: null
      };
    }
    const lastStart = sortedCycleLogs[0].startDate;
    const lastStartObj = new Date(lastStart + 'T12:00:00');
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastStartObj.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSince % avgLen) + 1;

    let currentPhase = CYCLE_PHASES_GUIDE[0];
    if (cycleDay <= 5) currentPhase = CYCLE_PHASES_GUIDE[0]; // Menstrual
    else if (cycleDay <= 13) currentPhase = CYCLE_PHASES_GUIDE[1]; // Follicular
    else if (cycleDay <= 16) currentPhase = CYCLE_PHASES_GUIDE[2]; // Ovulatory
    else currentPhase = CYCLE_PHASES_GUIDE[3]; // Luteal

    const nextDateObj = new Date(lastStartObj.getTime() + avgLen * 24 * 60 * 60 * 1000);
    const predictedNext = nextDateObj.toISOString().split('T')[0];

    return {
      hasLogged: true,
      lastStart,
      daysSince,
      cycleDay,
      currentPhase,
      predictedNext,
      ovulationDay: Math.max(1, avgLen - 14)
    };
  }, [sortedCycleLogs, healthFitness.averageCycleLength]);

  const latestDailyLog = useMemo(() => {
    if (!healthFitness.dailyLogs || healthFitness.dailyLogs.length === 0) return null;
    return [...healthFitness.dailyLogs].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    )[0];
  }, [healthFitness.dailyLogs]);

  // Handle logging a cycle start
  const handleLogCycleStart = (e) => {
    if (e) e.preventDefault();
    const newEntry = {
      id: `cycle-${Date.now()}`,
      startDate: customCycleDate,
      flow: cycleFlow,
      notes: cycleNotes.trim(),
      loggedAt: new Date().toISOString()
    };
    const nextLogs = [newEntry, ...(healthFitness.cycleLogs || [])];
    const nextHf = {
      ...healthFitness,
      cycleLogs: nextLogs,
      updatedAtTs: Date.now()
    };
    if (onUpdateHealthFitness) {
      onUpdateHealthFitness(nextHf);
    }
    setShowAddCycleForm(false);
    setCycleNotes('');
    if (showToast) showToast(`Logged cycle start for ${customCycleDate}`);
  };

  const handleDeleteCycleLog = (cycleId) => {
    const nextLogs = (healthFitness.cycleLogs || []).filter(c => c.id !== cycleId);
    const nextHf = {
      ...healthFitness,
      cycleLogs: nextLogs,
      updatedAtTs: Date.now()
    };
    if (onUpdateHealthFitness) {
      onUpdateHealthFitness(nextHf);
    }
    if (showToast) showToast('Deleted cycle log entry');
  };

  // Quick 1-tap cycle start for today
  const handleOneTapCycleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `cycle-${Date.now()}`,
      startDate: today,
      flow: 'Medium',
      notes: 'Logged via 1-Tap Master Calendar Cycle Start',
      loggedAt: new Date().toISOString()
    };
    const nextLogs = [newEntry, ...(healthFitness.cycleLogs || [])];
    const nextHf = {
      ...healthFitness,
      cycleLogs: nextLogs,
      updatedAtTs: Date.now()
    };
    if (onUpdateHealthFitness) {
      onUpdateHealthFitness(nextHf);
    }
    if (showToast) showToast(`Logged Day 1 of cycle (${today})!`);
  };

  // Add recommended walk to today's calendar schedule
  const handleAddWalkToSchedule = (e) => {
    if (e) e.stopPropagation();
    const phase = weekContext.matchedPpPhase;
    const walkTitle = weekContext.isPostpartum
      ? `🚶‍♀️ Postpartum Gentle Walk (${phase.walkingRec.duration})`
      : '🚶‍♀️ Daily 3rd Trimester Stroll (20–30 mins)';

    if (onAddEventToCalendar) {
      onAddEventToCalendar({
        title: walkTitle,
        time: '11:00',
        endTime: '11:30',
        isAllDay: false,
        category: 'Personal',
        location: 'Neighborhood / Stroller',
        notes: phase.walkingRec.details || 'Daily activity timeline recommendation'
      });
    }
    if (showToast) showToast('Added recommended walk to your schedule!');
  };

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. MASTER CALENDAR WEEKLY BANNER (Spans Across Entire 7-Day Week)       */}
      {/* ===================================================================== */}
      <div
        onClick={() => {
          setShowDetailModal(true);
        }}
        className="w-full relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-rose-50/60 to-purple-50/70 p-3 sm:p-4 shadow-2xs hover:shadow-xs transition duration-300 cursor-pointer group select-none"
      >
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-200/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-36 h-36 rounded-full bg-rose-200/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          {/* Top Bar: Week Indicator Badge & Quick "Details" Action */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#9E5A43] text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>
                  {weekContext.isPostpartum
                    ? `Week ${weekContext.babyWeekNum} Postpartum`
                    : `Pre-Birth • Week ${weekContext.gestationalWeek} Gestational`}
                </span>
              </span>

              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                <span>
                  {weekContext.isPostpartum
                    ? `Baby Aiden James (${weekContext.matchedAapGuide.subtitle.split('&')[0].trim()})`
                    : `Baby Aiden Due Nov 3 (${weekContext.weeksUntilDue} week${weekContext.weeksUntilDue > 1 ? 's' : ''} to go!)`}
                </span>
              </span>

              {calendarWeekOffset !== 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  {calendarWeekOffset > 0 ? `+${calendarWeekOffset}w ahead` : 'Current week'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAddWalkToSchedule}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/80 text-[11px] font-semibold transition shadow-2xs"
                title="Add this week's recommended walk directly into today's calendar"
              >
                <Plus className="w-3 h-3 text-[#9E5A43]" />
                <span>Add Walk</span>
              </button>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDetailModal(true);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-[#9E5A43] group-hover:translate-x-0.5 transition cursor-pointer"
              >
                <span>Care Details &amp; Protocols</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* 3 Summary Cards Grid (AAP Milestones | Postpartum Movement | Cycle & Hormones) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5">
            {/* CARD 1: AAP Newborn Milestones & Pre-Birth Growth */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModalTab('aap');
                setSelectedAapWeekId(weekContext.isPostpartum ? null : 'pre-birth');
                setShowDetailModal(true);
              }}
              className="p-2.5 sm:p-3 rounded-xl bg-white/80 backdrop-blur-xs border border-sky-200/70 hover:border-sky-400 hover:bg-white transition flex flex-col justify-between gap-1 shadow-2xs cursor-pointer"
              title="Click to view full AAP newborn milestones, fetal growth & protocols"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5 text-sky-600" />
                  <span>AAP Newborn Milestones</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 font-semibold border border-sky-200">
                  {weekContext.isPostpartum ? weekContext.matchedAapGuide.shortLabel : 'Birth Prep'}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium line-clamp-2 leading-snug">
                {weekContext.isPostpartum
                  ? weekContext.matchedAapGuide.milestones[0]
                  : weekContext.pregEncouragement?.developingThisWeek || 'Aiden is practicing breathing, suck-swallow reflexes & cozy baby fat!'}
              </p>
              <div className="text-[10px] text-sky-900/70 truncate flex items-center gap-1">
                <span>Feeding &amp; Sleep:</span>
                <span className="font-semibold truncate">
                  {weekContext.isPostpartum
                    ? weekContext.matchedAapGuide.feedingPatterns.slice(0, 48) + '...'
                    : 'Colostrum prep & safe sleep plan'}
                </span>
              </div>
            </div>

            {/* CARD 2: Activity, Walking & Mobility */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModalTab('postpartum');
                setSelectedPhaseOverride(weekContext.isPostpartum ? null : 'pre-birth');
                setShowDetailModal(true);
              }}
              className="p-2.5 sm:p-3 rounded-xl bg-white/80 backdrop-blur-xs border border-rose-200/70 hover:border-rose-400 hover:bg-white transition flex flex-col justify-between gap-1 shadow-2xs cursor-pointer"
              title="Click to view activity guidelines, walking duration & stretches"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-rose-600" />
                  <span>Activity &amp; Walking</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  {weekContext.matchedPpPhase.walkingRec.duration}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium line-clamp-2 leading-snug">
                {weekContext.matchedPpPhase.walkingRec.details}
              </p>
              <div className="text-[10px] text-rose-900/70 truncate flex items-center gap-1">
                <span>Stretches:</span>
                <span className="font-semibold truncate">
                  {weekContext.matchedPpPhase.stretches[0] || 'Gentle Neck & Shoulder Rolls'}
                </span>
              </div>
            </div>

            {/* CARD 3: Cycle & Hormone Phase */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveModalTab('cycle');
                setShowDetailModal(true);
              }}
              className="p-2.5 sm:p-3 rounded-xl bg-white/80 backdrop-blur-xs border border-purple-200/70 hover:border-purple-400 hover:bg-white transition flex flex-col justify-between gap-1 shadow-2xs cursor-pointer"
              title="Click to view cycle tracking, hormonal phases & Oura BBT"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-purple-600" />
                  <span>Hormone &amp; Cycle</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                  {cycleSummary.hasLogged
                    ? `Day ${cycleSummary.cycleDay} (${cycleSummary.currentPhase?.phase.split(' ')[0]})`
                    : weekContext.isPostpartum ? 'Recovery Phase' : '3rd Trimester'}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium line-clamp-2 leading-snug">
                {cycleSummary.hasLogged
                  ? cycleSummary.currentPhase?.workoutFocus
                  : weekContext.isPostpartum
                  ? 'Early postpartum baseline hormones; cycle tracking unlocks automatically as body recovers.'
                  : '3rd Trimester high progesterone & estrogen baseline; Oura Ring monitors nocturnal recovery.'}
              </p>
              <div className="text-[10px] text-purple-900/70 truncate flex items-center gap-1">
                <span>Oura BBT:</span>
                <span className="font-semibold truncate">
                  {latestDailyLog?.tempDeviationC !== undefined
                    ? `${latestDailyLog.tempDeviationC >= 0 ? '+' : ''}${latestDailyLog.tempDeviationC}°C deviation`
                    : 'Auto-syncs via Oura Ring nightly temp'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. COMPREHENSIVE CARE PROTOCOLS POPOUT MODAL (In-Dashboard Popup)      */}
      {/* ===================================================================== */}
      {showDetailModal && (
        <div
          onClick={() => setShowDetailModal(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#F7F4EF] text-stone-900 border border-[#E2D9CC] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header with Clear "Back to Dashboard" and "X" Buttons */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#E2D9CC] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center gap-1.5 shadow-2xs border border-stone-200 shrink-0"
                  title="Close care hub and return to dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#9E5A43]" />
                  <span>Back to Dashboard</span>
                </button>

                <div className="hidden sm:flex p-2 rounded-2xl bg-amber-50 text-[#9E5A43] border border-amber-200 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-editorial text-lg sm:text-xl font-bold leading-tight truncate">
                    Mackie &amp; Aiden&apos;s Master Care Hub
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5 truncate hidden sm:block">
                    AAP Protocols • Activity &amp; Mobility Timeline • Hormone &amp; Cycle Tracker
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition text-stone-500 hover:text-stone-800 shrink-0"
                title="Close"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs Bar inside Modal */}
            <div className="flex items-center border-b border-[#E2D9CC] bg-stone-50/70 px-4 sm:px-6 gap-2 overflow-x-auto scrollbar-minimal shrink-0">
              {[
                {
                  id: 'aap',
                  label: isPreBirthAapView ? 'Pre-Birth & AAP Newborn Guide' : 'AAP Newborn Guide',
                  icon: Baby,
                  badge: isPreBirthAapView ? `Wk ${weekContext.gestationalWeek}` : activeModalAapGuide.shortLabel
                },
                {
                  id: 'postpartum',
                  label: 'Activity & Mobility Timeline',
                  icon: Footprints,
                  badge: activeModalPpPhase.id === 'pre-birth' ? 'Pre-Birth' : activeModalPpPhase.weekRange.split(' ')[0]
                },
                {
                  id: 'cycle',
                  label: 'Cycle & Hormone Tracker',
                  icon: HeartPulse,
                  badge: cycleSummary.hasLogged ? `Day ${cycleSummary.cycleDay}` : 'Ready'
                }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModalTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                      isActive
                        ? 'border-[#9E5A43] text-[#9E5A43] bg-white rounded-t-xl'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/5 text-stone-600">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Modal Body Wrapped in ErrorBoundary */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-minimal">
              <ErrorBoundary onReset={() => setShowDetailModal(false)}>
                {/* ============================================================= */}
                {/* TAB 1: AAP NEWBORN WEEKLY MILESTONES & PRE-BIRTH CARE GUIDE   */}
                {/* ============================================================= */}
                {activeModalTab === 'aap' && (
                  <div className="space-y-5">
                    {/* Week Selector Pills: Pre-Birth + Newborn Weeks */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="font-semibold text-stone-700">Select AAP Developmental Stage:</span>
                        <span>Due Date: Nov 3, 2026 (Aiden James Vane)</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-minimal">
                        {/* Pre-Birth Option */}
                        <button
                          type="button"
                          onClick={() => setSelectedAapWeekId('pre-birth')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                            isPreBirthAapView
                              ? 'bg-[#9E5A43] text-white border-transparent shadow-2xs'
                              : 'bg-white text-stone-600 border-[#E2D9CC] hover:bg-stone-50'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pre-Birth (Wk {weekContext.gestationalWeek})</span>
                        </button>

                        {/* Subsequent Newborn Weeks */}
                        {AAP_WEEKLY_GUIDES.map(g => {
                          const isSelected = !isPreBirthAapView && activeModalAapGuide.id === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setSelectedAapWeekId(g.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#9E5A43] text-white border-transparent shadow-2xs'
                                  : 'bg-white text-stone-600 border-[#E2D9CC] hover:bg-stone-50'
                              }`}
                            >
                              <span>{g.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pre-Birth Detailed View */}
                    {isPreBirthAapView ? (
                      <div className="space-y-4">
                        {/* Headline Card */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E5A43]">
                                3rd Trimester • Early Term Preparation
                              </span>
                              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-stone-800">
                                Week {weekContext.gestationalWeek} Gestational: Baby Aiden James Vane
                              </h4>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                              {BABY_PROFILE.dueDateLabel} ({weekContext.weeksUntilDue} week{weekContext.weeksUntilDue > 1 ? 's' : ''} to go!)
                            </span>
                          </div>

                          <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-sky-600 shrink-0" />
                            <span>
                              Estimated Baby Size: <strong>{weekContext.pregEncouragement?.sizeComparison || 'Swiss Chard (~6.3 lbs, 19.1 in)'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Grid: What Aiden is Developing & Weekly Note for Mackie */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Col A: Aiden's In-Utero Development */}
                          <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                              <Smile className="w-4 h-4 text-sky-600" />
                              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                                What Aiden is Practicing This Week
                              </h5>
                            </div>
                            <p className="text-xs text-stone-700 leading-relaxed">
                              {weekContext.pregEncouragement?.developingThisWeek ||
                                'Aiden is practicing rhythmic breathing motions, sucking and swallowing, and fine-tuning his nervous system for room air!'}
                            </p>
                            <ul className="space-y-2 pt-1">
                              {[
                                'Lungs producing essential surfactant for effortless first breaths.',
                                'Hearing is fully tuned — recognizes Mackie’s and Mike’s voices.',
                                'Laying down cozy subcutaneous baby fat for post-birth warmth.',
                                'Practicing suck-swallow-breathe coordination and firm palmar grasp.'
                              ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Col B: Weekly Encouragement for Mackie */}
                          <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                              <Heart className="w-4 h-4 text-rose-500 fill-current" />
                              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                                Encouragement for Mackie
                              </h5>
                            </div>
                            <p className="text-xs text-stone-700 font-medium leading-relaxed italic bg-rose-50/50 p-3 rounded-xl border border-rose-200/60">
                              &ldquo;{weekContext.pregEncouragement?.quoteForMackie ||
                                'You are doing so wonderfully this week, Mackie! Every breath and heartbeat is nurturing Aiden James as he gets stronger and readier to meet you.'}&rdquo;
                            </p>
                            <div className="space-y-1.5 text-xs text-stone-600">
                              <div className="font-semibold text-stone-800">Pre-Birth Daily Focus:</div>
                              <p className="leading-relaxed">
                                Rest is active growing. Take time to elevate your feet, hydrate, and enjoy these cozy final weeks of pregnancy with Baby Aiden.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Evidence-Based Birth & Hospital Prep Protocols */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                            <ShieldCheck className="w-4 h-4 text-[#9E5A43]" />
                            <span>AAP &amp; ACOG Evidence-Based Birth &amp; Newborn Protocols</span>
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>The Golden Hour</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                60 minutes uninterrupted skin-to-skin immediately post-birth. Stabilizes Aiden&apos;s heart rate, blood sugar, and triggers the first feeding latch.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                <Droplets className="w-3.5 h-3.5" />
                                <span>Colostrum &amp; Feeding</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                Golden first milk packed with immunoglobulins. Aiden&apos;s marble-sized stomach holds 5–7 mL per feed in Days 1–2, perfectly matched to colostrum volume.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                                <Bed className="w-3.5 h-3.5" />
                                <span>AAP Safe Sleep Setup</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                Aiden sleeps in a bare, firm bassinet in parent bedroom. Always place on his BACK. Room temp 68°F–72°F with no blankets or pillows.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                <Clock className="w-3.5 h-3.5" />
                                <span>5-1-1 Labor Rule</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                When contractions are 5 minutes apart, lasting 1 minute each, for 1 full hour &rarr; call labor and delivery and head to the hospital.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Hospital Bag Ready</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                Car seat installed, Aiden&apos;s coming-home outfit (0–3 mo / newborn), Mackie&apos;s cozy pajamas, nursing bras, toiletries, and long phone charger.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                                <Activity className="w-3.5 h-3.5" />
                                <span>Delayed Cord Clamping</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                AAP standard: 1–3 minutes delayed clamping post-delivery allows 30% more blood and vital iron stores to transfer safely to Aiden.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Birth Immunization Plan */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>AAP Hospital Birth Immunization Plan (November 2026)</span>
                            </span>
                            <span className="text-xs text-stone-500">Birth Protocols</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-0.5">
                              <div className="font-bold text-stone-800">Hepatitis B (HepB) — Dose 1</div>
                              <div className="text-[11px] text-stone-600">Given in hospital within 24 hours of birth to establish early immunity.</div>
                              <div className="text-[10px] text-emerald-700 font-semibold mt-1">Recommended: Birth (Hospital)</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-0.5">
                              <div className="font-bold text-stone-800">RSV Monoclonal Protection (Beyfortus)</div>
                              <div className="text-[11px] text-stone-600">AAP recommended for infants born during autumn/winter RSV season.</div>
                              <div className="text-[10px] text-emerald-700 font-semibold mt-1">Recommended: Birth – 1 Week</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Postpartum Newborn Weeks Detailed View */
                      <div className="space-y-4">
                        {/* Stage Headline Box */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="font-editorial text-xl font-bold text-stone-800">
                              {activeModalAapGuide.label}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold">
                              {activeModalAapGuide.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Milestones & Common Concerns Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Col A: Milestones */}
                          <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                              <Smile className="w-4 h-4 text-emerald-600" />
                              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                                Milestones Aiden Should Be Hitting
                              </h5>
                            </div>
                            <ul className="space-y-2">
                              {activeModalAapGuide.milestones.map((m, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Col B: Common Concerns to Watch For */}
                          <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                                Normal Newborn Behaviors &amp; Concerns
                              </h5>
                            </div>
                            <ul className="space-y-2">
                              {activeModalAapGuide.commonConcerns.map((c, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Daily Care Protocols Cards */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 border-b border-stone-100 pb-2">
                            <ShieldCheck className="w-4 h-4 text-[#9E5A43]" />
                            <span>AAP Evidence-Based Daily Care Protocols</span>
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                                <Droplets className="w-3.5 h-3.5" />
                                <span>Feeding Patterns</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {activeModalAapGuide.feedingPatterns}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800">
                                <Bed className="w-3.5 h-3.5" />
                                <span>Sleep &amp; Wake Windows</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {activeModalAapGuide.sleepHours}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                <Bath className="w-3.5 h-3.5" />
                                <span>Bath &amp; Skin Care</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {activeModalAapGuide.bathFrequency} • {activeModalAapGuide.skinCare}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                                <Activity className="w-3.5 h-3.5" />
                                <span>Tummy Time</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {activeModalAapGuide.tummyTime}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                                <Heart className="w-3.5 h-3.5" />
                                <span>Circumcision Care</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {activeModalAapGuide.circumcisionCare}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Umbilical Cord Care</span>
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {activeModalAapGuide.umbilicalCordCare}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Vaccines & Immunizations Section */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>AAP Immunization Schedule (Nov 2026 Birth)</span>
                            </span>
                            <span className="text-xs text-stone-500">
                              Target: {activeModalAapGuide.vaccineFocus}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {AAP_VACCINE_SCHEDULE.slice(0, 4).map(v => (
                              <div key={v.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-0.5">
                                <div className="font-bold text-stone-800">{v.name}</div>
                                <div className="text-[11px] text-stone-600">{v.purpose}</div>
                                <div className="text-[10px] text-emerald-700 font-semibold mt-1">Recommended: {v.aapTiming}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ============================================================= */}
                {/* TAB 2: POSTPARTUM & PRE-BIRTH ACTIVITY & MOBILITY TIMELINE    */}
                {/* ============================================================= */}
                {activeModalTab === 'postpartum' && (
                  <div className="space-y-5">
                    {/* Phase Selector Pills */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span className="font-semibold text-stone-700">ACOG &amp; Pelvic Floor PT Timeline:</span>
                        <span>Anchor: Delivery Date ({deliveryDateStr})</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-minimal">
                        {POSTPARTUM_TIMELINE_PHASES.map(p => {
                          const isSelected = activeModalPpPhase.id === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setSelectedPhaseOverride(p.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-[#9E5A43] text-white border-transparent shadow-2xs'
                                  : 'bg-white text-stone-600 border-[#E2D9CC] hover:bg-stone-50'
                              }`}
                            >
                              <span>{p.weekRange}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Phase Header Box */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-editorial text-xl font-bold text-stone-800">
                          {activeModalPpPhase.weekRange} — {activeModalPpPhase.badge}
                        </h4>
                        <button
                          type="button"
                          onClick={handleAddWalkToSchedule}
                          className="px-3 py-1.5 rounded-xl bg-[#9E5A43] hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule Recommended Walk</span>
                        </button>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {activeModalPpPhase.summary}
                      </p>
                    </div>

                    {/* Walking Details & Stretches Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Col A: Walking Recommendation */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                          <Footprints className="w-4 h-4 text-rose-600" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                            Walking Routine &amp; Guidelines
                          </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                            <div className="text-[10px] uppercase font-bold text-stone-500">Frequency</div>
                            <div className="font-editorial text-lg font-bold text-stone-800 mt-0.5">
                              {activeModalPpPhase.walkingRec.frequency}
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                            <div className="text-[10px] uppercase font-bold text-stone-500">Duration</div>
                            <div className="font-editorial text-lg font-bold text-stone-800 mt-0.5">
                              {activeModalPpPhase.walkingRec.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50">
                          {activeModalPpPhase.walkingRec.details}
                        </p>
                      </div>

                      {/* Col B: Recommended Stretches & Mobility */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                            Mobility, Birth-Prep &amp; Stretches
                          </h5>
                        </div>
                        <ul className="space-y-2">
                          {activeModalPpPhase.stretches.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Core Exercises & What to Watch For */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Core Reconnection */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                            {activeModalPpPhase.id === 'pre-birth' ? 'Pelvic Floor Relaxation & Core Breathing' : 'Safe Core & Pelvic Floor Activation'}
                          </h5>
                        </div>
                        <ul className="space-y-2">
                          {activeModalPpPhase.exercises.map((ex, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-snug">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Watch For Red Flags */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                            What to Watch For &amp; Safety Checks
                          </h5>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-200/60">
                          {activeModalPpPhase.watchFor}
                        </p>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          Always listen to your body. Rest is active healing. If you experience increased bleeding, pain, or dizziness, stop and contact your care provider.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================= */}
                {/* TAB 3: CYCLE & HORMONE PHASE TRACKER (Pre-Birth & Recovery)   */}
                {/* ============================================================= */}
                {activeModalTab === 'cycle' && (
                  <div className="space-y-5">
                    {/* Current Status Header Card */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                            Hormonal Status &amp; Cycle Overview
                          </span>
                          {cycleSummary.hasLogged ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[10px] font-bold border border-purple-200">
                              Day {cycleSummary.cycleDay} of ~{healthFitness.averageCycleLength || 28}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold border border-stone-200">
                              {weekContext.isPostpartum ? 'Recovery Phase' : '3rd Trimester Baseline'}
                            </span>
                          )}
                        </div>
                        <h4 className="font-editorial text-2xl font-bold text-stone-800 mt-0.5">
                          {cycleSummary.hasLogged
                            ? cycleSummary.currentPhase?.phase
                            : weekContext.isPostpartum
                            ? 'Postpartum Hormonal Recovery'
                            : '3rd Trimester Gestational Baseline'}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1">
                          {cycleSummary.hasLogged
                            ? `${cycleSummary.currentPhase?.hormones} • Next predicted cycle: ${cycleSummary.predictedNext}`
                            : weekContext.isPostpartum
                            ? 'Cycle tracking is fully integrated. Tap below to log Day 1 whenever your menstrual period returns.'
                            : 'Estrogen and progesterone remain elevated to sustain pregnancy and prepare breast tissue for colostrum and mature milk.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleOneTapCycleToday}
                          className="px-3.5 py-2 rounded-xl bg-[#9E5A43] hover:opacity-90 text-white text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
                        >
                          <Droplets className="w-3.5 h-3.5" />
                          <span>Log Period Start Today</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddCycleForm(prev => !prev)}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
                        >
                          Custom Date
                        </button>
                      </div>
                    </div>

                    {/* Pre-Birth / Postpartum Hormonal Guidance Callout */}
                    {!weekContext.isPostpartum && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                          <Sparkles className="w-4 h-4 text-amber-700" />
                          <span>What to Expect: The Postpartum Hormonal Transition</span>
                        </div>
                        <p className="text-xs text-amber-950/80 leading-relaxed">
                          Within 24–48 hours after Aiden is delivered, progesterone and estrogen levels drop sharply, releasing the biological brake on prolactin so your colostrum transitions into rich mature milk. For exclusively nursing mothers, high prolactin suppresses ovulation (lactational amenorrhea), meaning your monthly cycle often pauses for several months while you nurse.
                        </p>
                      </div>
                    )}

                    {/* Custom Date Cycle Log Form (Collapsible) */}
                    {showAddCycleForm && (
                      <form onSubmit={handleLogCycleStart} className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-3">
                        <div className="font-bold text-xs text-stone-800">Log Past or Specific Cycle Start</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={customCycleDate}
                              onChange={e => setCustomCycleDate(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Flow</label>
                            <select
                              value={cycleFlow}
                              onChange={e => setCycleFlow(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                            >
                              <option value="Light">Light</option>
                              <option value="Medium">Medium</option>
                              <option value="Heavy">Heavy</option>
                              <option value="Spotting">Spotting</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Notes (Optional)</label>
                            <input
                              type="text"
                              placeholder="Symptoms, cramps, energy..."
                              value={cycleNotes}
                              onChange={e => setCycleNotes(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddCycleForm(false)}
                            className="px-3 py-1.5 rounded-xl text-stone-500 text-xs hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-[#9E5A43] text-white text-xs font-semibold"
                          >
                            Save Entry
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Oura Nightly Temp Shift Card */}
                    {latestDailyLog && latestDailyLog.tempDeviationC !== undefined && (
                      <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#9E5A43] flex items-center gap-1.5">
                            <Thermometer className="w-4 h-4" />
                            <span>Oura Ring Nightly Temp Shift (Basal Body Temp)</span>
                          </span>
                          <span className="text-xs font-mono font-bold text-stone-800">
                            {latestDailyLog.tempDeviationC >= 0 ? `+${latestDailyLog.tempDeviationC}` : latestDailyLog.tempDeviationC}°C
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Oura Ring monitors your nocturnal skin temperature continuously. A sustained rise of +0.2°C to +0.5°C confirms ovulation and the luteal phase, while a temp drop signals the onset of your menstrual period.
                        </p>
                      </div>
                    )}

                    {/* 4-Phase Hormonal Guide Reference */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        The 4 Hormonal Phases &amp; Cycle-Synced Movement
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CYCLE_PHASES_GUIDE.map(cp => (
                          <div key={cp.phase} className="p-3.5 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-stone-900">{cp.phase}</span>
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                {cp.days}
                              </span>
                            </div>
                            <div className="text-[11px] font-medium text-[#9E5A43]">{cp.hormones}</div>
                            <p className="text-xs text-stone-600 leading-relaxed mt-1">
                              {cp.workoutFocus}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logged Cycle History */}
                    {sortedCycleLogs.length > 0 && (
                      <div className="p-4 rounded-2xl bg-white border border-[#E2D9CC] shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          Logged Period History
                        </div>
                        <div className="divide-y divide-stone-100">
                          {sortedCycleLogs.map(c => (
                            <div key={c.id} className="py-2 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-mono font-bold text-stone-800">{c.startDate}</span>
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                                  Flow: {c.flow || 'Medium'}
                                </span>
                                {c.notes && <span className="ml-2 text-stone-500">• {c.notes}</span>}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteCycleLog(c.id)}
                                className="text-stone-400 hover:text-red-600 p-1 transition"
                                title="Delete cycle record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ErrorBoundary>
            </div>

            {/* Modal Footer with Clear "Back to Dashboard" and "Close" Buttons */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#E2D9CC] flex items-center justify-between text-xs text-stone-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#9E5A43]" />
                <span className="hidden sm:inline">Evidence-based guidance following AAP &amp; ACOG clinical protocols.</span>
                <span className="sm:hidden">AAP &amp; ACOG protocols</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#9E5A43] hover:opacity-90 text-white font-semibold text-xs shadow-2xs transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
