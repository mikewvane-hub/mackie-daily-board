import React, { useState, useEffect } from 'react';
import {
  Baby,
  Heart,
  Clock,
  Play,
  Pause,
  Check,
  Plus,
  Minus,
  Trash2,
  Scale,
  Moon,
  Droplets,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Syringe,
  Bath,
  Activity,
  RotateCcw
} from 'lucide-react';
import { AAP_WEEKLY_GUIDES, AAP_VACCINE_SCHEDULE } from '../data/aapNewbornData';
import { CardHeaderSquiggle, CutesyBadgeDoodle } from './SquigglyDecorations';
import { API_BASE } from '../apiBase.js';

export default function PostpartumBabyHub({
  theme,
  activeSeason,
  babyTracker,
  onUpdateBabyTracker,
  showToast,
  onOpenAussieAgent
}) {
  const series = babyTracker?.graphSeries || [];
  const todayDefaultDate =
    series.length > 0
      ? series[series.length - 1].date
      : new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState(todayDefaultDate);

  // Keep selectedDate synced to latest date when babyTracker first loads
  useEffect(() => {
    if (series.length > 0 && !series.some(s => s.date === selectedDate)) {
      setSelectedDate(series[series.length - 1].date);
    }
  }, [series, selectedDate]);

  // Live Breastfeeding Stopwatch State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [nursingSide, setNursingSide] = useState('Left Breast');
  const [manualDuration, setManualDuration] = useState('20');
  const [manualNotes, setManualNotes] = useState('');

  // Editable Weight & Sleep inputs for the selected day
  const activeDayPoint =
    series.find(d => d.date === selectedDate) ||
    series[series.length - 1] || {
      date: selectedDate,
      shortLabel: 'Today',
      feedingFrequency: 0,
      feedingDurationMinutes: 0,
      avgFeedDuration: 0,
      wetDiapers: 0,
      dirtyDiapers: 0,
      totalDiapers: 0,
      weightLbs: 7.5,
      sleepHours: 15.5
    };

  const [weightInput, setWeightInput] = useState(String(activeDayPoint.weightLbs || 7.5));
  const [activeGraphTab, setActiveGraphTab] = useState('all');
  const [selectedAapWeekId, setSelectedAapWeekId] = useState('week-1');

  useEffect(() => {
    setWeightInput(String(activeDayPoint.weightLbs || 0));
  }, [selectedDate, activeDayPoint.weightLbs]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = secs => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Log a breastfeeding session (either from live timer or manual form)
  const handleLogFeeding = async durationMinsOverride => {
    const mins =
      durationMinsOverride !== undefined
        ? Math.max(1, Math.round(durationMinsOverride))
        : Math.max(1, parseInt(manualDuration, 10) || 15);

    const nowTime = new Intl.DateTimeFormat('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());

    try {
      const res = await fetch(`${API_BASE}/baby-tracker/feeding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: nowTime,
          side: nursingSide,
          durationMinutes: mins,
          notes: manualNotes
        })
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdateBabyTracker(updated);
        setTimerRunning(false);
        setTimerSeconds(0);
        setManualNotes('');
        showToast(`Logged ${mins} min breastfeeding session (${nursingSide})`);
      }
    } catch (err) {
      console.error('Error logging feeding:', err);
    }
  };

  const handleDeleteFeeding = async id => {
    try {
      const res = await fetch(`${API_BASE}/baby-tracker/feeding/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdateBabyTracker(updated);
        showToast('Removed feeding session');
      }
    } catch (err) {
      console.error('Error deleting feeding:', err);
    }
  };

  const handleUpdateMetric = async payload => {
    try {
      const res = await fetch(`${API_BASE}/baby-tracker/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          ...payload
        })
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdateBabyTracker(updated);
      }
    } catch (err) {
      console.error('Error updating baby metric:', err);
    }
  };

  const handleToggleVaccine = async vaccineId => {
    try {
      const res = await fetch(`${API_BASE}/baby-tracker/vaccine/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaccineId })
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdateBabyTracker(updated);
        showToast('Updated Aiden’s AAP immunization log');
      }
    } catch (err) {
      console.error('Error toggling vaccine:', err);
    }
  };

  const handleResetTracker = async () => {
    if (!window.confirm('Reset sample baseline data to 0 for a fresh start?')) return;
    try {
      const res = await fetch(`${API_BASE}/baby-tracker/reset`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        onUpdateBabyTracker(updated);
        showToast('Reset baby tracker to fresh state');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedDayFeeds = (babyTracker?.feedingSessions || []).filter(
    f => f.date === selectedDate
  );

  const aapGuide =
    AAP_WEEKLY_GUIDES.find(w => w.id === selectedAapWeekId) || AAP_WEEKLY_GUIDES[0];

  const completedVaccines = babyTracker?.completedVaccines || [];

  // Daily AAP Target Benchmarks Check for Selected Day
  const feedFreqMet = activeDayPoint.feedingFrequency >= 8;
  const diaperGoalMet = activeDayPoint.totalDiapers >= 6;
  const sleepGoalMet = activeDayPoint.sleepHours >= 14 && activeDayPoint.sleepHours <= 17.5;

  return (
    <div className="space-y-6 relative">
      {/* =================================================================== */}
      {/* PART 1: POSTPARTUM TRACKER + LIVE MULTI-METRIC VISUAL TREND GRAPH   */}
      {/* =================================================================== */}
      <section
        aria-label="Postpartum Breastfeeding, Diaper, Weight, and Sleep Tracker"
        className={`${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-5`}
      >
        <CardHeaderSquiggle season={activeSeason} />

        {/* Section Header */}
        <div className={`flex items-center justify-between border-b ${theme.border} pb-4 gap-3 flex-wrap`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${theme.accentSoft}`}>
              <Baby className={`w-5 h-5 ${theme.accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial text-xl sm:text-2xl font-semibold leading-tight">
                  Aiden James Vane — Postpartum Feeding &amp; Daily Growth Tracker
                </h2>
                <CutesyBadgeDoodle season={activeSeason} />
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Interactive breastfeeding timer, diaper counter, daily weight &amp; sleep hours — funneled live into your 7-day trend graph
              </p>
            </div>
          </div>

          {/* Date Selector Pills (Last 7 Days) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-minimal">
            {series.map((dayPt, idx) => {
              const isSelected = dayPt.date === selectedDate;
              const isLatest = idx === series.length - 1;
              return (
                <button
                  key={dayPt.date}
                  type="button"
                  onClick={() => setSelectedDate(dayPt.date)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                    isSelected
                      ? `${theme.accentBg} text-white border-transparent shadow-2xs`
                      : `${theme.cardSubtle} ${theme.textSecondary} ${theme.border} hover:${theme.textPrimary}`
                  }`}
                >
                  {isLatest ? `Today (${dayPt.shortLabel})` : dayPt.shortLabel}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleResetTracker}
              className={`p-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} text-stone-500 hover:text-red-600 transition`}
              title="Reset baseline sample data to zero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 12-Col Grid: Left 5 Cols = Interactive Logging Controls | Right 7 Cols = Live Visual Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =============================================================== */}
          {/* LEFT 5 COLS: INTERACTIVE BREASTFEEDING & DAILY METRICS INPUTS   */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Box A: Interactive Breastfeeding Timer & Logger */}
            <div className={`p-4 rounded-2xl ${theme.cardSubtle} border ${theme.border} space-y-3.5`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${theme.accentText}`} />
                  <h3 className="font-editorial text-lg font-bold">
                    Breastfeeding Tracker
                  </h3>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    feedFreqMet
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : theme.badgeNeutral
                  }`}
                >
                  {activeDayPoint.feedingFrequency} / 8–12 Feeds ({activeDayPoint.feedingDurationMinutes}m total)
                </span>
              </div>

              {/* Breast Side Selector */}
              <div className="grid grid-cols-4 gap-1.5">
                {['Left Breast', 'Right Breast', 'Both', 'Pumped'].map(side => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setNursingSide(side)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition text-center ${
                      nursingSide === side
                        ? `${theme.accentBg} text-white border-transparent shadow-2xs`
                        : `${theme.cardBg} ${theme.textPrimary} ${theme.border}`
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>

              {/* Live Nursing Stopwatch + Quick Log */}
              <div className={`p-3 rounded-xl ${theme.cardBg} border ${theme.border} flex items-center justify-between gap-3 flex-wrap`}>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6E6359]">
                    Live Nursing Timer ({nursingSide})
                  </div>
                  <div className="font-mono text-2xl font-bold tracking-tight">
                    {formatTimer(timerSeconds)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      timerRunning
                        ? 'bg-amber-600 text-white'
                        : `${theme.accentBg} text-white`
                    }`}
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>{timerSeconds > 0 ? 'Resume' : 'Start Timer'}</span>
                      </>
                    )}
                  </button>

                  {timerSeconds > 0 && (
                    <button
                      type="button"
                      onClick={() => handleLogFeeding(Math.max(1, Math.ceil(timerSeconds / 60)))}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Duration Quick-Add Row */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <label className="text-xs font-medium text-[#6E6359] shrink-0">
                    Duration (mins):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={manualDuration}
                    onChange={e => setManualDuration(e.target.value)}
                    className={`w-16 px-2.5 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border} text-xs font-semibold text-center`}
                  />
                  {[10, 15, 20, 30].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setManualDuration(String(preset))}
                      className={`px-2 py-1 rounded-lg text-[11px] border ${
                        Number(manualDuration) === preset
                          ? `${theme.accentSoft} font-bold`
                          : `${theme.cardBg} ${theme.border}`
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleLogFeeding()}
                  className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-2xs`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Feed</span>
                </button>
              </div>

              {/* Logged Feeds Drawer for Selected Day */}
              <div className="space-y-1.5 max-h-[155px] overflow-y-auto pr-1 scrollbar-minimal">
                {selectedDayFeeds.slice(0, 8).map(feed => (
                  <div
                    key={feed.id}
                    className={`px-2.5 py-1.5 rounded-lg ${theme.cardBg} border ${theme.border} text-xs flex items-center justify-between gap-2`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-[#6E6359]">{feed.time}</span>
                      <span className="font-semibold truncate">{feed.side}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${theme.accentSoft}`}>
                        {feed.durationMinutes} min
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFeeding(feed.id)}
                      className="text-stone-400 hover:text-red-600 p-0.5"
                      title="Delete feeding log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Box B: Changed Diapers, Daily Weight & Hours of Sleep Interactive Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Changed Diapers Card */}
              <div className={`p-3.5 rounded-2xl ${theme.cardSubtle} border ${theme.border} flex flex-col justify-between gap-2.5`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6359]">
                      Diapers
                    </span>
                    <Droplets className={`w-4 h-4 ${theme.accentText}`} />
                  </div>
                  <div className="font-editorial text-2xl font-bold mt-1">
                    {activeDayPoint.totalDiapers}{' '}
                    <span className="text-xs font-sans font-normal text-[#6E6359]">
                      ({activeDayPoint.wetDiapers}W / {activeDayPoint.dirtyDiapers}D)
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6E6359]">
                    AAP Goal: 6–8+ / day
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateMetric({ deltaWet: 1 });
                        showToast('Added +1 Wet Diaper');
                      }}
                      className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold ${theme.accentBg} text-white`}
                    >
                      +1 Wet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateMetric({ deltaDirty: 1 });
                        showToast('Added +1 Dirty Diaper');
                      }}
                      className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft}`}
                    >
                      +1 Dirty
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateMetric({ deltaWet: -1 })}
                      className={`py-0.5 px-1 rounded text-[10px] border ${theme.border} ${theme.cardBg} text-[#6E6359]`}
                    >
                      -1 Wet
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateMetric({ deltaDirty: -1 })}
                      className={`py-0.5 px-1 rounded text-[10px] border ${theme.border} ${theme.cardBg} text-[#6E6359]`}
                    >
                      -1 Dirty
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Daily Weight Card */}
              <div className={`p-3.5 rounded-2xl ${theme.cardSubtle} border ${theme.border} flex flex-col justify-between gap-2.5`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6359]">
                      Daily Weight
                    </span>
                    <Scale className={`w-4 h-4 ${theme.accentText}`} />
                  </div>
                  <div className="font-editorial text-2xl font-bold mt-1">
                    {activeDayPoint.weightLbs} <span className="text-xs font-sans font-normal">lbs</span>
                  </div>
                  <div className="text-[10px] text-[#6E6359]">
                    Target: Steady +0.5–1 oz/d
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.05"
                      min="4"
                      max="25"
                      value={weightInput}
                      onChange={e => setWeightInput(e.target.value)}
                      className={`w-full px-2 py-1 rounded-lg ${theme.cardBg} border ${theme.border} text-xs font-semibold text-center`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateMetric({ weightLbs: parseFloat(weightInput) || 7.5 });
                        showToast(`Updated weight to ${weightInput} lbs`);
                      }}
                      className={`px-2 py-1 rounded-lg ${theme.accentBg} text-white text-[11px] font-semibold`}
                    >
                      Save
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(4, Math.round((activeDayPoint.weightLbs - 0.05) * 100) / 100);
                        handleUpdateMetric({ weightLbs: next });
                      }}
                      className={`py-0.5 px-1 rounded text-[10px] border ${theme.border} ${theme.cardBg}`}
                    >
                      -0.05 lb
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.round((activeDayPoint.weightLbs + 0.05) * 100) / 100;
                        handleUpdateMetric({ weightLbs: next });
                      }}
                      className={`py-0.5 px-1 rounded text-[10px] border ${theme.border} ${theme.cardBg}`}
                    >
                      +0.05 lb
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Hours of Sleep Card */}
              <div className={`p-3.5 rounded-2xl ${theme.cardSubtle} border ${theme.border} flex flex-col justify-between gap-2.5`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6359]">
                      Daily Sleep
                    </span>
                    <Moon className={`w-4 h-4 ${theme.accentText}`} />
                  </div>
                  <div className="font-editorial text-2xl font-bold mt-1">
                    {activeDayPoint.sleepHours} <span className="text-xs font-sans font-normal">hrs</span>
                  </div>
                  <div className="text-[10px] text-[#6E6359]">
                    AAP Goal: 14–17 hrs/day
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateMetric({ deltaSleep: 0.5 });
                        showToast('Added +0.5 hrs sleep');
                      }}
                      className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold ${theme.accentBg} text-white`}
                    >
                      +0.5 hr
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateMetric({ deltaSleep: 1.0 });
                        showToast('Added +1.0 hr sleep');
                      }}
                      className={`py-1 px-1.5 rounded-lg text-[11px] font-semibold border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft}`}
                    >
                      +1.0 hr
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateMetric({ deltaSleep: -0.5 })}
                      className={`py-0.5 px-1 rounded text-[10px] border ${theme.border} ${theme.cardBg} text-[#6E6359]`}
                    >
                      -0.5 hr
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateMetric({ sleepHours: 16.0 })}
                      className={`py-0.5 px-1 rounded text-[10px] border ${theme.border} ${theme.cardBg} text-[#6E6359]`}
                    >
                      Set 16h
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT 7 COLS: LIVE MULTI-METRIC VISUAL TREND & GOAL GRAPH       */}
          {/* =============================================================== */}
          <div className={`lg:col-span-7 p-4 sm:p-5 rounded-2xl ${theme.cardSubtle} border ${theme.border} flex flex-col gap-4`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${theme.accentText}`} />
                  <h3 className="font-editorial text-lg sm:text-xl font-bold">
                    Live 7-Day Newborn Trend &amp; Daily Target Graph
                  </h3>
                </div>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Updates automatically with every feeding, diaper change, weight check &amp; sleep log
                </p>
              </div>

              {/* Graph View Selector Tabs */}
              <div className={`flex items-center gap-1 p-1 rounded-xl ${theme.cardBg} border ${theme.border} text-xs flex-wrap`}>
                {[
                  { id: 'all', label: 'All 4 Trends' },
                  { id: 'feeding', label: 'Feeding (Freq & Mins)' },
                  { id: 'diapers', label: 'Diapers' },
                  { id: 'sleep', label: 'Sleep (Hrs)' },
                  { id: 'weight', label: 'Weight (Lbs)' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveGraphTab(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                      activeGraphTab === t.id
                        ? `${theme.accentBg} text-white shadow-2xs`
                        : `${theme.textSecondary} hover:${theme.textPrimary}`
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Mark Status Banner for Selected Day */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#6E6359]">Breastfeeding</span>
                  <span className={feedFreqMet ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                    {feedFreqMet ? '✓ On Mark' : 'Building'}
                  </span>
                </div>
                <div className="text-sm font-bold mt-0.5">
                  {activeDayPoint.feedingFrequency}x ({activeDayPoint.feedingDurationMinutes}m)
                </div>
                <div className="text-[10px] text-[#6E6359]">Mark: 8–12x / day</div>
              </div>

              <div className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#6E6359]">Changed Diapers</span>
                  <span className={diaperGoalMet ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                    {diaperGoalMet ? '✓ On Mark' : 'Building'}
                  </span>
                </div>
                <div className="text-sm font-bold mt-0.5">
                  {activeDayPoint.totalDiapers} diapers
                </div>
                <div className="text-[10px] text-[#6E6359]">Mark: 6–8+ / day</div>
              </div>

              <div className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#6E6359]">Daily Sleep</span>
                  <span className={sleepGoalMet ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                    {sleepGoalMet ? '✓ On Mark' : 'Adjusting'}
                  </span>
                </div>
                <div className="text-sm font-bold mt-0.5">
                  {activeDayPoint.sleepHours} hrs
                </div>
                <div className="text-[10px] text-[#6E6359]">Mark: 14–17 hrs</div>
              </div>

              <div className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#6E6359]">Weight Trend</span>
                  <span className="text-emerald-700 font-bold">✓ Tracked</span>
                </div>
                <div className="text-sm font-bold mt-0.5">
                  {activeDayPoint.weightLbs} lbs
                </div>
                <div className="text-[10px] text-[#6E6359]">Goal: Birth wt by Day 10–14</div>
              </div>
            </div>

            {/* Interactive SVG Trend Visualization */}
            <div className={`p-4 rounded-xl ${theme.cardBg} border ${theme.border}`}>
              {activeGraphTab === 'all' ? (
                /* 4-Panel Synchronized Sparkline & Bar Grid for All 4 Metrics */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chart 1: Feeding Frequency & Duration */}
                  <MetricMiniChart
                    title="Breastfeeding Frequency & Duration"
                    subtitle="Target: 8–12 feeds/day (~140–220 mins total)"
                    series={series}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    valueKey="feedingFrequency"
                    secondaryKey="feedingDurationMinutes"
                    unit="feeds"
                    secondaryUnit="m"
                    targetValue={8}
                    maxScale={14}
                    color="#9E5A43"
                  />

                  {/* Chart 2: Changed Diapers (Wet + Dirty) */}
                  <MetricMiniChart
                    title="Changed Diapers per Day"
                    subtitle="AAP Target: 6–8+ wet/dirty diapers daily"
                    series={series}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    valueKey="totalDiapers"
                    secondaryKey="wetDiapers"
                    unit="diapers"
                    secondaryUnit="wet"
                    targetValue={8}
                    maxScale={14}
                    color="#5F7A61"
                  />

                  {/* Chart 3: Hours of Sleep per Day */}
                  <MetricMiniChart
                    title="Hours of Sleep per Day"
                    subtitle="AAP Target: 14–17 hours / 24h"
                    series={series}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    valueKey="sleepHours"
                    unit="hrs"
                    targetValue={15}
                    maxScale={20}
                    color="#4A5D6E"
                  />

                  {/* Chart 4: Daily Weight Curve (lbs) */}
                  <WeightCurveMiniChart
                    title="Daily Weight Trajectory (lbs)"
                    subtitle="Steady gain after physiological Days 1–4 dip"
                    series={series}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    color="#B07D52"
                  />
                </div>
              ) : activeGraphTab === 'weight' ? (
                <WeightCurveMiniChart
                  title="Aiden's Daily Weight Curve (lbs)"
                  subtitle="Click any point to select that day • AAP target: regain birth weight by Day 10–14, then +0.5 to 1 oz/day"
                  series={series}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  color="#9E5A43"
                  large
                />
              ) : (
                <MetricMiniChart
                  title={
                    activeGraphTab === 'feeding'
                      ? 'Breastfeeding Frequency & Daily Duration'
                      : activeGraphTab === 'diapers'
                      ? 'Daily Changed Diapers (Wet + Dirty)'
                      : 'Daily Hours of Sleep'
                  }
                  subtitle="Click any day bar to inspect or update its logs"
                  series={series}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  valueKey={
                    activeGraphTab === 'feeding'
                      ? 'feedingFrequency'
                      : activeGraphTab === 'diapers'
                      ? 'totalDiapers'
                      : 'sleepHours'
                  }
                  secondaryKey={
                    activeGraphTab === 'feeding'
                      ? 'feedingDurationMinutes'
                      : activeGraphTab === 'diapers'
                      ? 'wetDiapers'
                      : undefined
                  }
                  unit={
                    activeGraphTab === 'feeding'
                      ? 'feeds'
                      : activeGraphTab === 'diapers'
                      ? 'diapers'
                      : 'hrs'
                  }
                  secondaryUnit={
                    activeGraphTab === 'feeding'
                      ? 'mins'
                      : activeGraphTab === 'diapers'
                      ? 'wet'
                      : undefined
                  }
                  targetValue={
                    activeGraphTab === 'feeding'
                      ? 8
                      : activeGraphTab === 'diapers'
                      ? 8
                      : 15
                  }
                  maxScale={activeGraphTab === 'sleep' ? 20 : 14}
                  color="#9E5A43"
                  large
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* PART 2: AMERICAN ACADEMY OF PEDIATRICS (AAP) WEEKLY CONCERNS,       */}
      {/*         MILESTONES, VACCINES & NEWBORN CARE PROTOCOL                */}
      {/* =================================================================== */}
      <section
        aria-label="American Academy of Pediatrics Weekly Newborn Milestones and Care Guide"
        className={`${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-5`}
      >
        <CardHeaderSquiggle season={activeSeason} />

        <div className={`flex items-center justify-between border-b ${theme.border} pb-4 gap-3 flex-wrap`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${theme.accentSoft}`}>
              <ShieldCheck className={`w-5 h-5 ${theme.accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial text-xl sm:text-2xl font-semibold leading-tight">
                  AAP Newborn Weekly Milestones, Common Concerns &amp; Care Guide
                </h2>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                  American Academy of Pediatrics
                </span>
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Select Aiden&apos;s current week to view AAP milestones, common concerns to watch for, vaccines, sleep, breastfeeding, bath, tummy time, skin, circumcision &amp; umbilical cord care
              </p>
            </div>
          </div>

          {/* Desktop Quick Trigger for Ted the Cozy Tan Teddy Bear Agent */}
          {onOpenAussieAgent && (
            <button
              type="button"
              onClick={onOpenAussieAgent}
              className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl ${theme.accentSoft} border hover:opacity-90 transition text-xs font-semibold`}
            >
              <span>🧸 Ask Ted (Newborn Medical Companion)</span>
            </button>
          )}
        </div>

        {/* Week Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-minimal">
          {AAP_WEEKLY_GUIDES.map(wk => {
            const active = wk.id === selectedAapWeekId;
            return (
              <button
                key={wk.id}
                type="button"
                onClick={() => setSelectedAapWeekId(wk.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  active
                    ? `${theme.accentBg} text-white border-transparent shadow-xs`
                    : `${theme.cardSubtle} ${theme.textPrimary} ${theme.border} hover:${theme.accentSoft}`
                }`}
              >
                {wk.label}
              </button>
            );
          })}
        </div>

        {/* Active Week Banner Subtitle */}
        <div className={`p-3.5 rounded-xl ${theme.accentSoft} border flex items-center justify-between gap-3 flex-wrap`}>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold">
              {aapGuide.label} • AAP Bright Futures Focus
            </div>
            <div className="font-editorial text-lg sm:text-xl font-bold">
              {aapGuide.subtitle}
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/70 border border-black/10">
            Emergency Alert: Call pediatrician immediately for any rectal temp ≥ 100.4°F (38.0°C)
          </span>
        </div>

        {/* Row A: Milestones & Common Concerns by Week */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Milestones Box */}
          <div className={`p-4 rounded-2xl ${theme.cardSubtle} border ${theme.border} space-y-2.5`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${theme.accentText}`} />
              <h3 className="font-editorial text-lg font-bold">
                Milestones Aiden Should Be Hitting ({aapGuide.shortLabel})
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {aapGuide.milestones.map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-1 w-2 h-2 rounded-full ${theme.accentBg} shrink-0`} />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Concerns to Watch For Box */}
          <div className={`p-4 rounded-2xl ${theme.cardSubtle} border ${theme.border} space-y-2.5`}>
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${theme.accentText}`} />
              <h3 className="font-editorial text-lg font-bold">
                Common Concerns to Watch For ({aapGuide.shortLabel})
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {aapGuide.commonConcerns.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row B: 7 Specific AAP Care Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <CareProtocolCard
            icon={Heart}
            title="Feeding Patterns & Frequency"
            content={aapGuide.feedingPatterns}
            theme={theme}
          />
          <CareProtocolCard
            icon={Moon}
            title="Hours of Sleep Daily (Safe Sleep)"
            content={aapGuide.sleepHours}
            theme={theme}
          />
          <CareProtocolCard
            icon={Bath}
            title="Bath Frequency & Hygiene"
            content={aapGuide.bathFrequency}
            theme={theme}
          />
          <CareProtocolCard
            icon={Activity}
            title="Tummy Time Frequency"
            content={aapGuide.tummyTime}
            theme={theme}
          />
          <CareProtocolCard
            icon={Sparkles}
            title="Newborn Skin Care"
            content={aapGuide.skinCare}
            theme={theme}
          />
          <CareProtocolCard
            icon={ShieldCheck}
            title="Circumcision Care"
            content={aapGuide.circumcisionCare}
            theme={theme}
          />
          <CareProtocolCard
            icon={Clock}
            title="Umbilical Cord Care"
            content={aapGuide.umbilicalCordCare}
            theme={theme}
          />
          <CareProtocolCard
            icon={Syringe}
            title={`Vaccine Focus (${aapGuide.shortLabel})`}
            content={aapGuide.vaccineFocus}
            theme={theme}
          />
        </div>

        {/* Row C: Complete AAP Recommended Vaccine Schedule Checklist */}
        <div className={`p-4 rounded-2xl ${theme.cardSubtle} border ${theme.border} space-y-3`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Syringe className={`w-4 h-4 ${theme.accentText}`} />
              <h3 className="font-editorial text-lg font-bold">
                AAP Recommended Newborn &amp; Infant Vaccine Schedule (Interactive Tracker)
              </h3>
            </div>
            <span className={`text-xs ${theme.textSecondary}`}>
              {completedVaccines.length} of {AAP_VACCINE_SCHEDULE.length} milestones checked off
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {AAP_VACCINE_SCHEDULE.map(vac => {
              const isDone = completedVaccines.includes(vac.id);
              return (
                <button
                  key={vac.id}
                  type="button"
                  onClick={() => handleToggleVaccine(vac.id)}
                  className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                    isDone
                      ? `${theme.accentSoft} border-[#9E5A43]/40`
                      : `${theme.cardBg} ${theme.border} hover:border-[#CBBBA8]`
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isDone
                        ? `${theme.accentBg} border-transparent text-white`
                        : 'border-[#9C9084] bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6359]">
                        {vac.aapTiming}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-semibold text-emerald-800">
                          Completed ✓
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#2C2520] mt-0.5">
                      {vac.name}
                    </div>
                    <p className={`text-[11px] ${theme.textSecondary} mt-0.5 leading-snug`}>
                      {vac.purpose}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function CareProtocolCard({ icon: Icon, title, content, theme }) {
  return (
    <div className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} flex flex-col gap-1.5`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${theme.accentText} shrink-0`} />
        <h4 className="font-editorial text-base font-bold leading-tight">{title}</h4>
      </div>
      <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>{content}</p>
    </div>
  );
}

function MetricMiniChart({
  title,
  subtitle,
  series,
  selectedDate,
  onSelectDate,
  valueKey,
  secondaryKey,
  unit,
  secondaryUnit,
  targetValue,
  maxScale = 15,
  color = '#9E5A43',
  large = false
}) {
  const height = large ? 170 : 120;
  const targetY = Math.max(12, Math.min(height - 15, height - (targetValue / maxScale) * (height - 28)));

  return (
    <div className="p-3 rounded-xl border border-[#E2D9CC] bg-[#FAF7F2] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-[#2C2520]">{title}</div>
          <div className="text-[10px] text-[#6E6359]">{subtitle}</div>
        </div>
        {targetValue && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Goal Line: {targetValue} {unit}
          </span>
        )}
      </div>

      <div className="relative pt-2">
        {/* Target Goal Dashed Line */}
        {targetValue && (
          <div
            style={{ top: `${targetY}px` }}
            className="absolute left-0 right-0 border-t border-dashed border-emerald-600/70 pointer-events-none z-10 flex justify-end"
          >
            <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1 -mt-2 rounded">
              Mark ({targetValue})
            </span>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 items-end" style={{ height: `${height}px` }}>
          {series.map(pt => {
            const val = Number(pt[valueKey]) || 0;
            const secVal = secondaryKey ? Number(pt[secondaryKey]) || 0 : null;
            const pct = Math.min(100, Math.max(8, Math.round((val / maxScale) * 100)));
            const isSelected = pt.date === selectedDate;
            const metGoal = targetValue ? val >= targetValue : true;

            return (
              <button
                key={pt.date}
                type="button"
                onClick={() => onSelectDate(pt.date)}
                className={`h-full flex flex-col justify-end items-center group focus:outline-none ${
                  isSelected ? 'scale-[1.03]' : ' opacity-85 hover:opacity-100'
                }`}
              >
                <div className="text-[10px] font-bold text-[#2C2520] mb-1">
                  {val}
                  {secVal !== null ? (
                    <span className="block text-[9px] font-normal text-[#6E6359]">
                      {secVal}
                      {secondaryUnit}
                    </span>
                  ) : null}
                </div>
                <div
                  style={{
                    height: `${pct}%`,
                    backgroundColor: isSelected ? color : metGoal ? color : '#C8BBAE',
                    opacity: isSelected ? 1 : 0.78
                  }}
                  className={`w-full max-w-[34px] rounded-t-lg transition-all ${
                    isSelected ? 'ring-2 ring-[#2C2520]/30' : ''
                  }`}
                />
                <div
                  className={`text-[10px] mt-1 truncate max-w-full ${
                    isSelected ? 'font-bold text-[#2C2520] underline' : 'text-[#6E6359]'
                  }`}
                >
                  {pt.shortLabel.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeightCurveMiniChart({
  title,
  subtitle,
  series,
  selectedDate,
  onSelectDate,
  color = '#9E5A43',
  large = false
}) {
  const weights = series.map(s => Number(s.weightLbs) || 7.0);
  const minW = Math.max(4, Math.min(...weights) - 0.3);
  const maxW = Math.max(...weights) + 0.3;
  const span = Math.max(0.5, maxW - minW);

  const svgWidth = 360;
  const svgHeight = large ? 150 : 105;

  const points = series.map((pt, idx) => {
    const x = series.length > 1 ? 24 + (idx / (series.length - 1)) * (svgWidth - 48) : svgWidth / 2;
    const w = Number(pt.weightLbs) || 7.0;
    const y = svgHeight - 22 - ((w - minW) / span) * (svgHeight - 44);
    return { x, y, pt };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="p-3 rounded-xl border border-[#E2D9CC] bg-[#FAF7F2] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-[#2C2520]">{title}</div>
          <div className="text-[10px] text-[#6E6359]">{subtitle}</div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
          Latest: {weights[weights.length - 1] || 7.5} lbs
        </span>
      </div>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />
        {points.map(({ x, y, pt }) => {
          const isSelected = pt.date === selectedDate;
          return (
            <g
              key={pt.date}
              onClick={() => onSelectDate(pt.date)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? '#2C2520' : color}
                stroke="#FAF7F2"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#2C2520"
              >
                {pt.weightLbs}
              </text>
              <text
                x={x}
                y={svgHeight - 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight={isSelected ? 'bold' : 'normal'}
                fill="#6E6359"
              >
                {pt.shortLabel.split(',')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
