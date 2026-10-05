import React, { useState, useMemo } from 'react';
import {
  Dumbbell,
  Footprints,
  HeartPulse,
  Moon,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Calendar,
  Clock,
  Search,
  RefreshCw,
  Pencil,
  ChevronRight,
  Activity,
  Flame,
  Thermometer,
  CheckCircle2,
  Info,
  X
} from 'lucide-react';
import {
  WORKOUT_CATEGORIES,
  DEFAULT_WORKOUT_ROUTINES,
  POSTPARTUM_TIMELINE_PHASES,
  CYCLE_PHASES_GUIDE
} from '../data/postpartumFitnessData.js';
import { CardHeaderSquiggle, CutesyBadgeDoodle } from './SquigglyDecorations.jsx';
import { API_BASE } from '../apiBase.js';

const DAYS_OF_WEEK = [
  { key: 'Monday', short: 'Mon' },
  { key: 'Tuesday', short: 'Tue' },
  { key: 'Wednesday', short: 'Wed' },
  { key: 'Thursday', short: 'Thu' },
  { key: 'Friday', short: 'Fri' },
  { key: 'Saturday', short: 'Sat' },
  { key: 'Sunday', short: 'Sun' }
];

export default function PersonalHealthFitnessHub({
  theme,
  activeSeason,
  healthFitness,
  onUpdateHealthFitness,
  todayDayName,
  todayShortDateLabel,
  showToast
}) {
  const hf = useMemo(() => {
    return {
      customRoutines: [],
      weeklyWorkouts: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      },
      deliveryDate: '2026-11-03',
      selectedPhaseId: null,
      cycleLogs: [],
      averageCycleLength: 28,
      periodDurationDays: 5,
      ouraToken: '',
      ouraConnected: false,
      ouraLastSynced: null,
      dailyLogs: [],
      ...(healthFitness || {})
    };
  }, [healthFitness]);

  // Combine default routines + Mackie's custom saved routines
  const allRoutines = useMemo(() => {
    const custom = Array.isArray(hf.customRoutines) ? hf.customRoutines : [];
    return [...custom, ...DEFAULT_WORKOUT_ROUTINES];
  }, [hf.customRoutines]);

  // Workout Library States
  const [selectedWorkoutCategory, setSelectedWorkoutCategory] = useState('ALL');
  const [workoutSearch, setWorkoutSearch] = useState('');
  const [selectedRoutineId, setSelectedRoutineId] = useState(
    () => (allRoutines[0] && allRoutines[0].id) || 'wk-stroller-walk-30'
  );
  const [targetWorkoutDay, setTargetWorkoutDay] = useState(todayDayName || 'Monday');
  const [showNewRoutineForm, setShowNewRoutineForm] = useState(false);
  const [viewingRoutineModal, setViewingRoutineModal] = useState(null);
  const [draggedRoutine, setDraggedRoutine] = useState(null);
  const [dragOverWorkoutDay, setDragOverWorkoutDay] = useState(null);

  // New Custom Routine Form State
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineCategory, setNewRoutineCategory] = useState('Strength & Toning');
  const [newRoutineDuration, setNewRoutineDuration] = useState('25 mins');
  const [newRoutineIntensity, setNewRoutineIntensity] = useState('Moderate');
  const [newRoutineExercisesText, setNewRoutineExercisesText] = useState('');
  const [newRoutineNotes, setNewRoutineNotes] = useState('');

  // Weekly Workout Planner Inline States
  const [todayQuickWorkoutInput, setTodayQuickWorkoutInput] = useState('');
  const [customDayWorkoutInputs, setCustomDayWorkoutInputs] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });
  const [editingWorkout, setEditingWorkout] = useState(null); // { dayKey, instanceId, title }

  // Cycle Tracker States
  const [customCycleDate, setCustomCycleDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [cycleFlow, setCycleFlow] = useState('Medium');
  const [cycleNotes, setCycleNotes] = useState('');
  const [showCustomCycleForm, setShowCustomCycleForm] = useState(false);

  // Oura Ring & Daily Sleep/Activity Log States
  const [showOuraModal, setShowOuraModal] = useState(false);
  const [ouraTokenInput, setOuraTokenInput] = useState(hf.ouraToken || '');
  const [isSyncingOura, setIsSyncingOura] = useState(false);
  const [ouraError, setOuraError] = useState(null);
  const [showManualDailyForm, setShowManualDailyForm] = useState(false);
  const [manualDailyInput, setManualDailyInput] = useState({
    date: new Date().toISOString().split('T')[0],
    sleepHours: '7.5',
    sleepScore: '84',
    steps: '7500',
    walkingMinutes: '30',
    activeCalories: '320',
    readinessScore: '82',
    tempDeviationC: '0.0'
  });

  // Helper to persist changes to localStorage + backend + GitHub Cloud Store
  const saveHealthFitnessState = async (partialUpdates, toastMsg) => {
    const nextState = {
      ...hf,
      ...partialUpdates,
      updatedAt: new Date().toISOString(),
      updatedAtTs: Date.now()
    };
    onUpdateHealthFitness(nextState);
    try {
      const res = await fetch(`${API_BASE}/health-fitness/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextState)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.healthFitness) {
          onUpdateHealthFitness(json.healthFitness);
        }
      }
    } catch (e) {
      console.error('Error syncing health & fitness state:', e);
    }
    if (toastMsg && showToast) {
      showToast(toastMsg);
    }
  };

  // Filtered Routines
  const filteredRoutines = useMemo(() => {
    return allRoutines.filter(r => {
      const matchesCat =
        selectedWorkoutCategory === 'ALL' || r.category === selectedWorkoutCategory;
      const q = workoutSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        (Array.isArray(r.exercises) && r.exercises.some(ex => ex.toLowerCase().includes(q)));
      return matchesCat && matchesSearch;
    });
  }, [allRoutines, selectedWorkoutCategory, workoutSearch]);

  const selectedRoutineObj = useMemo(() => {
    return allRoutines.find(r => r.id === selectedRoutineId) || allRoutines[0];
  }, [allRoutines, selectedRoutineId]);

  // Calculate Postpartum Week & Active Timeline Phase
  const postpartumStatus = useMemo(() => {
    const now = new Date();
    const refDate = new Date((hf.deliveryDate || '2026-11-03') + 'T12:00:00');
    const diffDays = Math.floor((now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    const isPostpartum = diffDays >= 0;
    const currentWeek = isPostpartum ? Math.floor(diffDays / 7) + 1 : Math.floor(diffDays / 7);
    const isPast12Weeks = isPostpartum && currentWeek >= 12;

    let autoPhase = POSTPARTUM_TIMELINE_PHASES[0];
    if (isPostpartum) {
      autoPhase =
        POSTPARTUM_TIMELINE_PHASES.find(
          p => currentWeek >= p.minWeek && currentWeek <= p.maxWeek
        ) || POSTPARTUM_TIMELINE_PHASES[POSTPARTUM_TIMELINE_PHASES.length - 1];
    }

    const activePhase =
      (hf.selectedPhaseId &&
        POSTPARTUM_TIMELINE_PHASES.find(p => p.id === hf.selectedPhaseId)) ||
      autoPhase;

    return {
      diffDays,
      isPostpartum,
      currentWeek,
      isPast12Weeks,
      autoPhase,
      activePhase
    };
  }, [hf.deliveryDate, hf.selectedPhaseId]);

  // Create & Save a New Workout Routine to Mackie's Library
  const handleCreateCustomRoutine = async (e) => {
    e.preventDefault();
    const cleanTitle = newRoutineTitle.trim();
    if (!cleanTitle) return;

    const exercisesList = newRoutineExercisesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const created = {
      id: `wk-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: cleanTitle,
      category: newRoutineCategory || 'Strength & Toning',
      duration: newRoutineDuration.trim() || '25 mins',
      intensity: newRoutineIntensity || 'Moderate',
      postpartumPhase: 'Custom Routine',
      isCustom: true,
      notes: newRoutineNotes.trim() || 'Mackie’s custom saved workout routine.',
      exercises:
        exercisesList.length > 0
          ? exercisesList
          : ['Warm-up 5 mins', cleanTitle, 'Cool-down & stretch 5 mins']
    };

    const nextCustom = [created, ...(hf.customRoutines || [])];
    setSelectedRoutineId(created.id);
    setNewRoutineTitle('');
    setNewRoutineExercisesText('');
    setNewRoutineNotes('');
    setShowNewRoutineForm(false);

    await saveHealthFitnessState(
      { customRoutines: nextCustom },
      `Saved "${created.title}" to your Workout Routines library!`
    );
  };

  const handleDeleteCustomRoutine = async (routineId, title) => {
    const nextCustom = (hf.customRoutines || []).filter(r => r.id !== routineId);
    if (selectedRoutineId === routineId) {
      setSelectedRoutineId(DEFAULT_WORKOUT_ROUTINES[0].id);
    }
    await saveHealthFitnessState(
      { customRoutines: nextCustom },
      `Removed "${title}" from saved routines`
    );
  };

  // Assign a Workout Routine (or Custom Workout) to a Day (Monday-Sunday)
  const handleAssignWorkoutToDay = async (routine, dayKey) => {
    if (!routine || !dayKey) return;
    const currentWeekPlan = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
      ...(hf.weeklyWorkouts || {})
    };
    const entry = {
      instanceId: `wplan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      routineId: routine.id || null,
      title: routine.title,
      category: routine.category || 'Workout',
      duration: routine.duration || '25 mins',
      completed: false,
      addedAt: new Date().toISOString()
    };
    const nextDayList = [...(currentWeekPlan[dayKey] || []), entry];
    const nextWeekly = {
      ...currentWeekPlan,
      [dayKey]: nextDayList
    };

    await saveHealthFitnessState(
      { weeklyWorkouts: nextWeekly },
      `Added "${routine.title}" to ${dayKey}’s workout plan`
    );
  };

  const handleAddCustomWorkoutToDay = async (dayKey, rawText) => {
    const clean = (rawText || '').trim();
    if (!clean) return;
    await handleAssignWorkoutToDay(
      {
        id: null,
        title: clean,
        category: 'Custom Activity',
        duration: 'Custom'
      },
      dayKey
    );
  };

  const handleToggleWorkoutCompleted = async (dayKey, instanceId) => {
    const currentWeekPlan = { ...(hf.weeklyWorkouts || {}) };
    const dayArr = (currentWeekPlan[dayKey] || []).map(item =>
      item.instanceId === instanceId ? { ...item, completed: !item.completed } : item
    );
    await saveHealthFitnessState({
      weeklyWorkouts: {
        ...currentWeekPlan,
        [dayKey]: dayArr
      }
    });
  };

  const handleSaveEditedWorkout = async (dayKey, instanceId, newTitle) => {
    const clean = (newTitle || '').trim();
    if (!clean) {
      setEditingWorkout(null);
      return;
    }
    const currentWeekPlan = { ...(hf.weeklyWorkouts || {}) };
    const dayArr = (currentWeekPlan[dayKey] || []).map(item =>
      item.instanceId === instanceId ? { ...item, title: clean } : item
    );
    setEditingWorkout(null);
    await saveHealthFitnessState(
      {
        weeklyWorkouts: {
          ...currentWeekPlan,
          [dayKey]: dayArr
        }
      },
      `Updated workout on ${dayKey}`
    );
  };

  const handleRemoveWorkoutFromDay = async (dayKey, instanceId, title) => {
    const currentWeekPlan = { ...(hf.weeklyWorkouts || {}) };
    const dayArr = (currentWeekPlan[dayKey] || []).filter(
      item => item.instanceId !== instanceId
    );
    await saveHealthFitnessState(
      {
        weeklyWorkouts: {
          ...currentWeekPlan,
          [dayKey]: dayArr
        }
      },
      `Removed "${title}" from ${dayKey}`
    );
  };

  const handleClearWeekWorkouts = async () => {
    await saveHealthFitnessState(
      {
        weeklyWorkouts: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: []
        }
      },
      'Cleared weekly workout schedule'
    );
  };

  // Cycle Tracking Logic & 1-Tap "Cycle Start" Handler
  const sortedCycleLogs = useMemo(() => {
    return [...(hf.cycleLogs || [])].sort((a, b) =>
      String(b.startDate || '').localeCompare(String(a.startDate || ''))
    );
  }, [hf.cycleLogs]);

  const cycleSummary = useMemo(() => {
    const avgLen = Number(hf.averageCycleLength) || 28;
    if (sortedCycleLogs.length === 0) {
      return {
        hasCycle: false,
        latestStart: null,
        cycleDay: null,
        currentPhase: null,
        nextPredictedStart: null,
        daysUntilNext: null,
        calculatedAvgLength: avgLen
      };
    }

    // Calculate average cycle length if 2+ logs exist
    let calcAvg = avgLen;
    if (sortedCycleLogs.length >= 2) {
      const diffs = [];
      for (let i = 0; i < sortedCycleLogs.length - 1; i++) {
        const d1 = new Date(sortedCycleLogs[i].startDate + 'T12:00:00');
        const d2 = new Date(sortedCycleLogs[i + 1].startDate + 'T12:00:00');
        const daysBetween = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
        if (daysBetween >= 18 && daysBetween <= 45) {
          diffs.push(daysBetween);
        }
      }
      if (diffs.length > 0) {
        calcAvg = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
      }
    }

    const latestStart = sortedCycleLogs[0].startDate;
    const startObj = new Date(latestStart + 'T12:00:00');
    const nowObj = new Date();
    const elapsedDays = Math.floor((nowObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = Math.max(1, elapsedDays + 1);

    let currentPhase = CYCLE_PHASES_GUIDE[0];
    if (cycleDay <= 5) currentPhase = CYCLE_PHASES_GUIDE[0]; // Menstrual
    else if (cycleDay <= 13) currentPhase = CYCLE_PHASES_GUIDE[1]; // Follicular
    else if (cycleDay <= 16) currentPhase = CYCLE_PHASES_GUIDE[2]; // Ovulatory
    else currentPhase = CYCLE_PHASES_GUIDE[3]; // Luteal

    const nextStartObj = new Date(startObj);
    nextStartObj.setDate(nextStartObj.getDate() + calcAvg);
    const nextPredictedStart = nextStartObj.toISOString().split('T')[0];
    const daysUntilNext = Math.ceil(
      (nextStartObj.getTime() - nowObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      hasCycle: true,
      latestStart,
      cycleDay,
      currentPhase,
      nextPredictedStart,
      daysUntilNext,
      calculatedAvgLength: calcAvg
    };
  }, [sortedCycleLogs, hf.averageCycleLength]);

  const handleQuickPressCycleStartToday = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = (hf.cycleLogs || []).find(c => c.startDate === todayStr);
    if (existing) {
      showToast('Cycle start for today is already logged!');
      return;
    }
    const newCycleEntry = {
      id: `cyc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      startDate: todayStr,
      flow: 'Medium',
      notes: 'Logged via 1-Tap Cycle Start button',
      source: 'Manual 1-Tap',
      createdAt: new Date().toISOString()
    };
    const nextLogs = [newCycleEntry, ...(hf.cycleLogs || [])];
    await saveHealthFitnessState(
      { cycleLogs: nextLogs },
      `Logged Cycle Day 1 starting today (${todayStr})!`
    );
  };

  const handleAddCustomCycleLog = async (e) => {
    e.preventDefault();
    if (!customCycleDate) return;
    const newCycleEntry = {
      id: `cyc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      startDate: customCycleDate,
      flow: cycleFlow || 'Medium',
      notes: cycleNotes.trim() || 'Cycle start logged',
      source: 'Manual Entry',
      createdAt: new Date().toISOString()
    };
    const nextLogs = [
      newCycleEntry,
      ...(hf.cycleLogs || []).filter(c => c.startDate !== customCycleDate)
    ];
    setCycleNotes('');
    setShowCustomCycleForm(false);
    await saveHealthFitnessState(
      { cycleLogs: nextLogs },
      `Saved cycle start for ${customCycleDate}`
    );
  };

  const handleDeleteCycleLog = async (id) => {
    const nextLogs = (hf.cycleLogs || []).filter(c => c.id !== id);
    await saveHealthFitnessState({ cycleLogs: nextLogs }, 'Removed cycle log entry');
  };

  // Oura Ring API v2 Sync Handler
  const handleSyncOuraRing = async (e) => {
    if (e) e.preventDefault();
    setIsSyncingOura(true);
    setOuraError(null);
    try {
      const tokenToUse = (ouraTokenInput || hf.ouraToken || '').trim();
      const res = await fetch(`${API_BASE}/health-fitness/oura/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToUse })
      });
      const json = await res.json();
      if (!res.ok) {
        setOuraError(json.error || 'Could not connect to Oura Ring API');
      } else {
        onUpdateHealthFitness(json.healthFitness);
        setShowOuraModal(false);
        showToast(`Synced ${json.syncedDaysCount || 0} days of Sleep, Activity & Cycle Temp from Oura Ring!`);
      }
    } catch (err) {
      setOuraError(err.message);
    } finally {
      setIsSyncingOura(false);
    }
  };

  // Manual Daily Sleep & Activity Log Handler
  const handleSaveManualDailyLog = async (e) => {
    e.preventDefault();
    const targetDate = manualDailyInput.date || new Date().toISOString().split('T')[0];
    const entry = {
      date: targetDate,
      sleepHours: Math.max(0, Math.min(24, Number(manualDailyInput.sleepHours) || 0)),
      sleepScore: Math.max(0, Math.min(100, Number(manualDailyInput.sleepScore) || 0)),
      steps: Math.max(0, Number(manualDailyInput.steps) || 0),
      walkingMinutes: Math.max(0, Number(manualDailyInput.walkingMinutes) || 0),
      activeCalories: Math.max(0, Number(manualDailyInput.activeCalories) || 0),
      readinessScore: Math.max(0, Math.min(100, Number(manualDailyInput.readinessScore) || 0)),
      tempDeviationC: Number(manualDailyInput.tempDeviationC) || 0,
      source: 'Manual / Oura App Entry'
    };

    const existingLogs = Array.isArray(hf.dailyLogs) ? hf.dailyLogs : [];
    const nextLogs = [
      entry,
      ...existingLogs.filter(l => l.date !== targetDate)
    ].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    setShowManualDailyForm(false);
    await saveHealthFitnessState(
      { dailyLogs: nextLogs },
      `Logged sleep & activity metrics for ${targetDate}`
    );
  };

  const latestDailyLog = useMemo(() => {
    const logs = Array.isArray(hf.dailyLogs) ? hf.dailyLogs : [];
    return logs[0] || null;
  }, [hf.dailyLogs]);

  const totalWeeklyWorkouts = useMemo(() => {
    const ww = hf.weeklyWorkouts || {};
    return Object.values(ww).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
      0
    );
  }, [hf.weeklyWorkouts]);

  const completedWeeklyWorkouts = useMemo(() => {
    const ww = hf.weeklyWorkouts || {};
    return Object.values(ww).reduce(
      (sum, arr) =>
        sum + (Array.isArray(arr) ? arr.filter(w => w.completed).length : 0),
      0
    );
  }, [hf.weeklyWorkouts]);

  return (
    <section
      aria-label="Mackie's Personal Health, Fitness, Postpartum Timeline & Cycle Hub"
      className="space-y-6"
    >
      {/* =================================================================== */}
      {/* SECTION BANNER HEADER                                               */}
      {/* =================================================================== */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs`}>
        <CardHeaderSquiggle season={activeSeason} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${theme.cardSubtle} ${theme.accentText} border ${theme.border}`}>
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold leading-none">
                  Mackie&apos;s Personal Health, Fitness &amp; Postpartum Wellness
                </h2>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${theme.accentSoft}`}>
                  {postpartumStatus.isPostpartum
                    ? `Postpartum Week ${postpartumStatus.currentWeek}`
                    : `Pre-Arrival Prep • Due Nov 3`}
                </span>
                <CutesyBadgeDoodle season={activeSeason} variant={4} />
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-1`}>
                Saved Workout Routines &amp; Weekly Fitness Planner • Postpartum Activity &amp; Stretch Timeline • 12+ Wk Cycle &amp; Oura Ring Sleep/Activity Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowOuraModal(true)}
              className={`px-3 py-1.5 rounded-xl border ${
                hf.ouraConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : `${theme.cardSubtle} ${theme.border} ${theme.textPrimary}`
              } text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>
                {hf.ouraConnected ? 'Oura Ring Connected (Sync)' : 'Connect Oura Ring App'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleQuickPressCycleStartToday}
              className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs`}
              title="1-Tap to record Cycle Day 1 starting today"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cycle Start Today</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* PART 1: SAVED WORKOUT ROUTINES LIBRARY + WEEKLY WORKOUT PLANNER     */}
      {/*         (Works just like Cookbook Recipes & Weekly Meal Plan!)      */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 5 COLS: SAVED WORKOUT ROUTINES LIBRARY */}
        <div
          className={`lg:col-span-5 ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
        >
          <div className="flex items-start justify-between gap-2 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-editorial text-xl font-semibold leading-none">
                    Saved Workout Routines
                  </h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                    {allRoutines.length} Routines
                  </span>
                </div>
                <p className={`text-xs ${theme.textSecondary} mt-1`}>
                  Enter &amp; save routines • Scroll, select &amp; add to Mon–Sun
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNewRoutineForm(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1 transition shadow-2xs`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showNewRoutineForm ? 'Close Form' : 'New Routine'}</span>
            </button>
          </div>

          {/* Collapsible Form to Enter & Save a Specific Workout Routine */}
          {showNewRoutineForm && (
            <form
              onSubmit={handleCreateCustomRoutine}
              className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.borderStrong} space-y-2.5 text-xs`}
            >
              <div className="font-semibold text-sm flex items-center justify-between">
                <span>Save a New Workout Routine to Your Library</span>
                <button
                  type="button"
                  onClick={() => setShowNewRoutineForm(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block font-medium mb-1">Routine Title *</label>
                <input
                  type="text"
                  required
                  value={newRoutineTitle}
                  onChange={e => setNewRoutineTitle(e.target.value)}
                  placeholder="e.g., 30-Min Glute & Core Sculpt, Stroller Walk + Abs..."
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardBg} border ${theme.border} outline-none`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={newRoutineCategory}
                    onChange={e => setNewRoutineCategory(e.target.value)}
                    className={`w-full px-2 py-2 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  >
                    {WORKOUT_CATEGORIES.filter(c => c.id !== 'ALL').map(c => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    value={newRoutineDuration}
                    onChange={e => setNewRoutineDuration(e.target.value)}
                    placeholder="e.g., 30 mins"
                    className={`w-full px-2.5 py-2 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Intensity</label>
                  <select
                    value={newRoutineIntensity}
                    onChange={e => setNewRoutineIntensity(e.target.value)}
                    className={`w-full px-2 py-2 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  >
                    <option value="Gentle">Gentle</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Energizing">Energizing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Exercises, Stretches, Sets &amp; Reps (One per line)
                </label>
                <textarea
                  rows="3"
                  value={newRoutineExercisesText}
                  onChange={e => setNewRoutineExercisesText(e.target.value)}
                  placeholder={`Goblet Squats: 3 sets x 12 reps\nGlute Bridges: 3 sets x 15 reps\nBird-Dog Core: 3 sets x 10 reps\nHip Flexor Stretch: 60s`}
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardBg} border ${theme.border} outline-none`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Notes / Cues (Optional)</label>
                <input
                  type="text"
                  value={newRoutineNotes}
                  onChange={e => setNewRoutineNotes(e.target.value)}
                  placeholder="e.g., Use 10 lb dumbbells + mini band"
                  className={`w-full px-3 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white font-semibold`}
                >
                  Save Routine to Library
                </button>
              </div>
            </form>
          )}

          {/* Search & Category Filter Pills */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`} />
              <input
                type="search"
                value={workoutSearch}
                onChange={e => setWorkoutSearch(e.target.value)}
                placeholder="Search saved workout routines or exercises..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs sm:text-sm outline-none focus:border-[#9E5A43]`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-minimal">
              {WORKOUT_CATEGORIES.map(cat => {
                const active = selectedWorkoutCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedWorkoutCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                      active
                        ? `${theme.accentBg} text-white border-transparent`
                        : `${theme.cardSubtle} ${theme.textSecondary} ${theme.border}`
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Workout Routines List */}
          <div
            className={`max-h-[420px] overflow-y-auto pr-1 space-y-2 scrollbar-minimal border ${theme.border} rounded-xl p-3 ${theme.bgPage}`}
          >
            {filteredRoutines.length === 0 ? (
              <div className={`text-center py-6 text-xs ${theme.textSecondary}`}>
                No saved routines match &ldquo;{workoutSearch}&rdquo;
              </div>
            ) : (
              filteredRoutines.map(routine => {
                const isSelected = selectedRoutineObj?.id === routine.id;
                return (
                  <div
                    key={routine.id}
                    draggable
                    onDragStart={() => setDraggedRoutine(routine)}
                    onDragEnd={() => {
                      setDraggedRoutine(null);
                      setDragOverWorkoutDay(null);
                    }}
                    onClick={() => setSelectedRoutineId(routine.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? `${theme.highlightBox} border-[#9E5A43]`
                        : `${theme.cardBg} ${theme.border} hover:border-[#CBBBA8]`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.accentSoft}`}>
                            {routine.category}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border ${theme.badgeNeutral}`}>
                            {routine.duration}
                          </span>
                          {routine.isCustom && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                              My Custom
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-xs sm:text-sm mt-1 leading-snug">
                          {routine.title}
                        </div>
                        {Array.isArray(routine.exercises) && routine.exercises.length > 0 && (
                          <p className={`text-[11px] ${theme.textSecondary} mt-1 line-clamp-2`}>
                            {routine.exercises.slice(0, 3).join(' • ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setViewingRoutineModal(routine);
                          }}
                          className={`px-2 py-1 rounded-lg border ${theme.border} ${theme.cardSubtle} text-[11px] font-medium hover:${theme.accentSoft}`}
                          title="View full exercises & stretches"
                        >
                          Exercises
                        </button>
                        {routine.isCustom && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteCustomRoutine(routine.id, routine.title);
                            }}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600"
                            title="Delete custom routine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick 1-Tap Day Assignment Buttons on Selected Routine */}
                    {isSelected && (
                      <div className={`mt-2.5 pt-2.5 border-t ${theme.border} space-y-1.5`}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold ${theme.accentText}`}>
                            Add &ldquo;{routine.title}&rdquo; to Day:
                          </span>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleAssignWorkoutToDay(routine, todayDayName);
                            }}
                            className={`px-2 py-0.5 rounded-md ${theme.accentBg} text-white font-semibold text-[10px]`}
                          >
                            + Add to Today ({todayDayName.slice(0, 3)})
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {DAYS_OF_WEEK.map(d => (
                            <button
                              key={d.key}
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleAssignWorkoutToDay(routine, d.key);
                              }}
                              className={`py-1 rounded-lg text-[11px] font-semibold border ${theme.borderStrong} ${theme.cardSubtle} hover:${theme.accentBg} hover:text-white transition`}
                            >
                              +{d.short}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT 7 COLS: TODAY'S WORKOUT HIGHLIGHT BOX + MONDAY–SUNDAY WORKOUT SCHEDULE */}
        <div
          className={`lg:col-span-7 ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-editorial text-xl font-semibold leading-none">
                    Weekly Workout &amp; Movement Schedule
                  </h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                    {completedWeeklyWorkouts}/{totalWeeklyWorkouts} Completed
                  </span>
                </div>
                <p className={`text-xs ${theme.textSecondary} mt-1`}>
                  Select routines from the left or type any workout directly into Monday–Sunday
                </p>
              </div>
            </div>

            {totalWeeklyWorkouts > 0 && (
              <button
                type="button"
                onClick={handleClearWeekWorkouts}
                className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50/60 text-red-700 hover:bg-red-100 text-xs font-medium flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Week</span>
              </button>
            )}
          </div>

          {/* TODAY'S WORKOUT HIGHLIGHT BOX */}
          {(() => {
            const todayWorkouts = (hf.weeklyWorkouts && hf.weeklyWorkouts[todayDayName]) || [];
            return (
              <div className={`p-3.5 sm:p-4 rounded-2xl border-2 ${theme.highlightBox} space-y-2.5 shadow-2xs`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.accentBg} text-white`}>
                      Today&apos;s Movement • {todayDayName} ({todayShortDateLabel})
                    </span>
                    <span className={`text-xs font-medium ${theme.textSecondary}`}>
                      {todayWorkouts.length === 0
                        ? 'Rest day or add a routine below'
                        : `${todayWorkouts.length} routine${todayWorkouts.length === 1 ? '' : 's'} planned`}
                    </span>
                  </div>
                  {selectedRoutineObj && (
                    <button
                      type="button"
                      onClick={() => handleAssignWorkoutToDay(selectedRoutineObj, todayDayName)}
                      className={`px-2.5 py-1 rounded-lg border ${theme.borderStrong} ${theme.cardBg} text-[11px] font-semibold hover:${theme.accentSoft} transition`}
                    >
                      + Add &ldquo;{selectedRoutineObj.title.slice(0, 24)}...&rdquo; to Today
                    </button>
                  )}
                </div>

                {todayWorkouts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {todayWorkouts.map(w => (
                      <div
                        key={w.instanceId}
                        className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.borderStrong} flex items-center justify-between gap-2`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleWorkoutCompleted(todayDayName, w.instanceId)}
                          className="flex items-center gap-2 text-left min-w-0 flex-1"
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              w.completed
                                ? `${theme.accentBg} border-transparent text-white`
                                : 'border-[#9C9084] bg-white'
                            }`}
                          >
                            {w.completed && <Check className="w-3 h-3" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-xs font-semibold truncate ${
                                w.completed ? 'line-through text-stone-400' : ''
                              }`}
                            >
                              {w.title}
                            </div>
                            <div className={`text-[10px] ${theme.textSecondary}`}>
                              {w.category} • {w.duration}
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveWorkoutFromDay(todayDayName, w.instanceId, w.title)
                          }
                          className="p-1 text-stone-400 hover:text-red-600"
                          title="Remove from Today"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!todayQuickWorkoutInput.trim()) return;
                    handleAddCustomWorkoutToDay(todayDayName, todayQuickWorkoutInput);
                    setTodayQuickWorkoutInput('');
                  }}
                  className="flex items-center gap-2 pt-0.5"
                >
                  <input
                    type="text"
                    value={todayQuickWorkoutInput}
                    onChange={e => setTodayQuickWorkoutInput(e.target.value)}
                    placeholder={`Type a workout or walk for Today (${todayDayName})...`}
                    className={`flex-1 px-3 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border} text-xs outline-none`}
                  />
                  <button
                    type="submit"
                    className={`px-3 py-1.5 rounded-xl ${theme.accentBg} text-white text-xs font-semibold shrink-0`}
                  >
                    + Today
                  </button>
                </form>
              </div>
            );
          })()}

          {/* 7-DAY MONDAY-SUNDAY WORKOUT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {DAYS_OF_WEEK.map(day => {
              const dayWorkouts = (hf.weeklyWorkouts && hf.weeklyWorkouts[day.key]) || [];
              const isToday = day.key === todayDayName;
              const isDragTarget = dragOverWorkoutDay === day.key;

              return (
                <div
                  key={day.key}
                  onDragOver={e => {
                    e.preventDefault();
                    setDragOverWorkoutDay(day.key);
                  }}
                  onDragLeave={() => setDragOverWorkoutDay(null)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOverWorkoutDay(null);
                    if (draggedRoutine) {
                      handleAssignWorkoutToDay(draggedRoutine, day.key);
                    }
                  }}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between gap-2.5 ${
                    isDragTarget
                      ? 'ring-2 ring-[#9E5A43] bg-[#FAF5EE]'
                      : isToday
                      ? `${theme.accentSoft} border-[#9E5A43]/40`
                      : `${theme.cardSubtle} ${theme.border}`
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-1.5 border-[#E2D9CC]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-editorial font-bold text-base">
                          {day.key}
                        </span>
                        {isToday && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${theme.accentBg} text-white font-semibold`}>
                            Today
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          selectedRoutineObj && handleAssignWorkoutToDay(selectedRoutineObj, day.key)
                        }
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.borderStrong} ${theme.cardBg} hover:${theme.accentBg} hover:text-white transition`}
                        title={
                          selectedRoutineObj
                            ? `Add "${selectedRoutineObj.title}" to ${day.key}`
                            : 'Add selected routine'
                        }
                      >
                        + Selected
                      </button>
                    </div>

                    {dayWorkouts.length === 0 ? (
                      <div className={`text-[11px] italic ${theme.textMuted} py-2 text-center`}>
                        Rest / Open Day
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {dayWorkouts.map(item => {
                          const isEditingThis =
                            editingWorkout &&
                            editingWorkout.dayKey === day.key &&
                            editingWorkout.instanceId === item.instanceId;

                          return (
                            <div
                              key={item.instanceId}
                              className={`p-2 rounded-lg ${theme.cardBg} border ${theme.border} text-xs flex flex-col gap-1`}
                            >
                              {isEditingThis ? (
                                <form
                                  onSubmit={e => {
                                    e.preventDefault();
                                    handleSaveEditedWorkout(
                                      day.key,
                                      item.instanceId,
                                      editingWorkout.title
                                    );
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <input
                                    type="text"
                                    value={editingWorkout.title}
                                    onChange={e =>
                                      setEditingWorkout({
                                        ...editingWorkout,
                                        title: e.target.value
                                      })
                                    }
                                    className="flex-1 px-2 py-1 rounded border text-xs"
                                    autoFocus
                                  />
                                  <button
                                    type="submit"
                                    className={`px-2 py-1 rounded ${theme.accentBg} text-white text-[10px] font-semibold`}
                                  >
                                    Save
                                  </button>
                                </form>
                              ) : (
                                <div className="flex items-start justify-between gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleWorkoutCompleted(day.key, item.instanceId)
                                    }
                                    className="flex items-start gap-1.5 text-left min-w-0 flex-1"
                                  >
                                    <div
                                      className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                        item.completed
                                          ? `${theme.accentBg} border-transparent text-white`
                                          : 'border-stone-400 bg-white'
                                      }`}
                                    >
                                      {item.completed && <Check className="w-2.5 h-2.5" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div
                                        className={`font-medium leading-snug break-words ${
                                          item.completed ? 'line-through text-stone-400' : ''
                                        }`}
                                      >
                                        {item.title}
                                      </div>
                                      <div className={`text-[10px] ${theme.textSecondary}`}>
                                        {item.duration}
                                      </div>
                                    </div>
                                  </button>

                                  <div className="flex items-center gap-0.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingWorkout({
                                          dayKey: day.key,
                                          instanceId: item.instanceId,
                                          title: item.title
                                        })
                                      }
                                      className="p-0.5 text-stone-400 hover:text-stone-700"
                                      title="Edit workout"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveWorkoutFromDay(
                                          day.key,
                                          item.instanceId,
                                          item.title
                                        )
                                      }
                                      className="p-0.5 text-stone-400 hover:text-red-600"
                                      title="Remove workout"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Manual Custom Workout Input per Day */}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const val = customDayWorkoutInputs[day.key];
                      if (!val || !val.trim()) return;
                      handleAddCustomWorkoutToDay(day.key, val);
                      setCustomDayWorkoutInputs(prev => ({ ...prev, [day.key]: '' }));
                    }}
                    className="flex items-center gap-1 pt-1"
                  >
                    <input
                      type="text"
                      value={customDayWorkoutInputs[day.key] || ''}
                      onChange={e =>
                        setCustomDayWorkoutInputs(prev => ({
                          ...prev,
                          [day.key]: e.target.value
                        }))
                      }
                      placeholder={`Type ${day.short} workout...`}
                      className={`flex-1 min-w-0 px-2.5 py-1 rounded-lg ${theme.cardBg} border ${theme.border} text-[11px] outline-none`}
                    />
                    <button
                      type="submit"
                      className={`p-1 rounded-lg ${theme.accentBg} text-white shrink-0`}
                      title={`Add custom workout to ${day.key}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* PART 2: POSTPARTUM RECOVERY & ACTIVITY TIMELINE TRACKER             */}
      {/*         (Walking Frequency/Duration, Recommended Stretches & Ex.)   */}
      {/* =================================================================== */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}>
        <div className="flex items-center justify-between gap-3 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-editorial text-xl sm:text-2xl font-semibold leading-none">
                  Postpartum Activity, Walking &amp; Mobility Timeline
                </h3>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${theme.accentSoft} font-semibold`}>
                  {postpartumStatus.activePhase.badge}
                </span>
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-1`}>
                Evidence-based ACOG &amp; Pelvic Floor PT recommendations by postpartum week: walking frequency/duration, stretches &amp; exercises
              </p>
            </div>
          </div>

          {/* Baby Delivery / Due Date Reference Picker */}
          <div className="flex items-center gap-2 text-xs">
            <label className={`font-medium ${theme.textSecondary}`}>
              Baby Birth / Due Date:
            </label>
            <input
              type="date"
              value={hf.deliveryDate || '2026-11-03'}
              onChange={e =>
                saveHealthFitnessState(
                  { deliveryDate: e.target.value },
                  `Updated postpartum timeline anchor date to ${e.target.value}`
                )
              }
              className={`px-2.5 py-1 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs font-mono`}
            />
          </div>
        </div>

        {/* Interactive Postpartum Timeline Phase Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-minimal">
          {POSTPARTUM_TIMELINE_PHASES.map(phase => {
            const isSelected = postpartumStatus.activePhase.id === phase.id;
            const isAutoCurrent = postpartumStatus.autoPhase.id === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() =>
                  saveHealthFitnessState({ selectedPhaseId: phase.id })
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isSelected
                    ? `${theme.accentBg} text-white border-transparent shadow-2xs`
                    : `${theme.cardSubtle} ${theme.textSecondary} ${theme.border} hover:${theme.textPrimary}`
                }`}
              >
                <span>{phase.weekRange}</span>
                {isAutoCurrent && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Postpartum Phase Details Grid */}
        {(() => {
          const phase = postpartumStatus.activePhase;
          return (
            <div className="space-y-3">
              <div className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div>
                  <div className="font-editorial text-lg font-bold">
                    {phase.weekRange} — {phase.badge}
                  </div>
                  <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                    {phase.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleAssignWorkoutToDay(
                      {
                        id: `pp-walk-${phase.id}`,
                        title: `${phase.weekRange} Walk (${phase.walkingRec.duration})`,
                        category: 'Walking & Cardio',
                        duration: phase.walkingRec.duration
                      },
                      todayDayName
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold shrink-0`}
                >
                  + Add Recommended Walk to Today ({todayDayName.slice(0, 3)})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Col 1: Recommended Walking Frequency & Duration */}
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.bgPage} space-y-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme.accentText} flex items-center gap-1.5`}>
                      <Footprints className="w-4 h-4" />
                      <span>Walking Recommendation</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                      <div className={`text-[10px] uppercase font-semibold ${theme.textSecondary}`}>
                        Weekly Frequency
                      </div>
                      <div className="font-editorial text-lg font-bold mt-0.5">
                        {phase.walkingRec.frequency}
                      </div>
                    </div>
                    <div className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.border}`}>
                      <div className={`text-[10px] uppercase font-semibold ${theme.textSecondary}`}>
                        Target Duration
                      </div>
                      <div className="font-editorial text-lg font-bold mt-0.5">
                        {phase.walkingRec.duration}
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>
                    {phase.walkingRec.details}
                  </p>
                </div>

                {/* Col 2: Recommended Stretches & Mobility */}
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.bgPage} space-y-2.5 flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${theme.accentText} flex items-center gap-1.5`}>
                        <Sparkles className="w-4 h-4" />
                        <span>Recommended Stretches</span>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {phase.stretches.map((st, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 shrink-0`} />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignWorkoutToDay(
                        {
                          id: `pp-stretch-${phase.id}`,
                          title: `${phase.weekRange} Mobility & Stretch Flow`,
                          category: 'Stretching & Mobility',
                          duration: '15 mins'
                        },
                        todayDayName
                      )
                    }
                    className={`w-full py-1.5 rounded-xl border ${theme.borderStrong} ${theme.cardBg} hover:${theme.accentSoft} text-xs font-semibold transition`}
                  >
                    + Add Stretch Session to Today
                  </button>
                </div>

                {/* Col 3: Recommended Exercises & Core/Pelvic Floor Progression */}
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.bgPage} space-y-2.5 flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${theme.accentText} flex items-center gap-1.5`}>
                        <Dumbbell className="w-4 h-4" />
                        <span>Recommended Exercises</span>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {phase.exercises.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 shrink-0`} />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleAssignWorkoutToDay(
                        {
                          id: `pp-ex-${phase.id}`,
                          title: `${phase.weekRange} Core & Strength Routine`,
                          category: 'Core & Pelvic Floor',
                          duration: '20 mins'
                        },
                        todayDayName
                      )
                    }
                    className={`w-full py-1.5 rounded-xl border ${theme.borderStrong} ${theme.cardBg} hover:${theme.accentSoft} text-xs font-semibold transition`}
                  >
                    + Add Exercise Session to Today
                  </button>
                </div>
              </div>

              {/* Clinical Safety & Milestone Note */}
              <div className={`p-3 rounded-xl ${theme.accentSoft} border flex items-start gap-2 text-xs`}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Timeline Checkpoint &amp; Guidance:</strong> {phase.watchFor}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* =================================================================== */}
      {/* PART 3: 12+ WEEKS POSTPARTUM CYCLE TRACKER + OURA RING SLEEP &      */}
      {/*         ACTIVITY HUB (Manual 1-Tap OR Oura Ring Cloud Sync)         */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 6 COLS: POSTPARTUM CYCLE TRACKER (12+ WEEKS & MANUAL / OURA) */}
        <div
          className={`lg:col-span-6 ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}
        >
          <div className="flex items-start justify-between gap-2 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-editorial text-xl font-semibold leading-none">
                    Postpartum Cycle &amp; Hormone Phase Tracker
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    postpartumStatus.isPast12Weeks
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : theme.badgeNeutral
                  }`}>
                    {postpartumStatus.isPast12Weeks
                      ? '12+ Weeks Postpartum Active'
                      : '12+ Wks Postpartum & Ready Anytime'}
                  </span>
                </div>
                <p className={`text-xs ${theme.textSecondary} mt-1`}>
                  Press &ldquo;Cycle Start Today&rdquo;, log manually, or sync temperature shifts from Oura Ring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickPressCycleStartToday}
                className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cycle Start Today</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCustomCycleForm(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} text-xs font-medium`}
              >
                {showCustomCycleForm ? 'Close' : '+ Past Date'}
              </button>
            </div>
          </div>

          {/* Custom Date Cycle Entry Form */}
          {showCustomCycleForm && (
            <form
              onSubmit={handleAddCustomCycleLog}
              className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-2.5 text-xs`}
            >
              <div className="font-semibold">Log Cycle Start Date &amp; Details</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={customCycleDate}
                    onChange={e => setCustomCycleDate(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Flow</label>
                  <select
                    value={cycleFlow}
                    onChange={e => setCycleFlow(e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  >
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Heavy">Heavy</option>
                    <option value="Spotting">Spotting</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Symptoms / Notes (Optional)</label>
                <input
                  type="text"
                  value={cycleNotes}
                  onChange={e => setCycleNotes(e.target.value)}
                  placeholder="e.g., First postpartum cycle, mild cramps, Oura temp drop"
                  className={`w-full px-3 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-3.5 py-1.5 rounded-xl ${theme.accentBg} text-white font-semibold`}
                >
                  Save Cycle Entry
                </button>
              </div>
            </form>
          )}

          {/* Current Cycle Status Overview */}
          {cycleSummary.hasCycle ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
                  <div className={`text-[10px] uppercase font-semibold ${theme.textSecondary}`}>
                    Current Cycle Day
                  </div>
                  <div className={`font-editorial text-2xl font-bold mt-0.5 ${theme.accentText}`}>
                    Day {cycleSummary.cycleDay}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Started {cycleSummary.latestStart}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
                  <div className={`text-[10px] uppercase font-semibold ${theme.textSecondary}`}>
                    Current Phase
                  </div>
                  <div className="font-editorial text-lg font-bold mt-0.5 leading-tight">
                    {cycleSummary.currentPhase.phase.replace(' Phase', '')}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {cycleSummary.currentPhase.days}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
                  <div className={`text-[10px] uppercase font-semibold ${theme.textSecondary}`}>
                    Next Predicted
                  </div>
                  <div className="font-editorial text-lg font-bold mt-0.5">
                    {cycleSummary.nextPredictedStart}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Avg {cycleSummary.calculatedAvgLength}-day cycle
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${cycleSummary.currentPhase.color} text-xs space-y-1`}>
                <div className="font-bold">
                  {cycleSummary.currentPhase.phase} ({cycleSummary.currentPhase.hormones})
                </div>
                <p>
                  <strong>Recommended Movement:</strong> {cycleSummary.currentPhase.workoutFocus}
                </p>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs space-y-1.5`}>
              <div className="font-semibold text-sm">
                No Cycle Logged Yet (Postpartum / Breastfeeding Friendly)
              </div>
              <p className={`${theme.textSecondary} leading-relaxed`}>
                After 12 weeks postpartum (or whenever your cycle returns while breastfeeding), simply press <strong>&ldquo;Cycle Start Today&rdquo;</strong> above or connect your <strong>Oura Ring</strong> to track your cycle length, luteal temperature shifts, and phase-matched workouts.
              </p>
            </div>
          )}

          {/* Cycle Phases Quick Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CYCLE_PHASES_GUIDE.map(cp => (
              <div
                key={cp.phase}
                className={`p-2.5 rounded-xl border ${theme.border} ${theme.bgPage} text-[11px] space-y-0.5`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{cp.phase}</span>
                  <span className={`text-[10px] ${theme.textSecondary}`}>{cp.days}</span>
                </div>
                <p className={theme.textSecondary}>{cp.workoutFocus}</p>
              </div>
            ))}
          </div>

          {/* Historical Cycle Start Log */}
          {sortedCycleLogs.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold">Logged Cycle History</div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-minimal">
                {sortedCycleLogs.map(c => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl ${theme.cardSubtle} border ${theme.border} flex items-center justify-between text-xs`}
                  >
                    <div>
                      <span className="font-mono font-bold">{c.startDate}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-[10px] border ${theme.badgeNeutral}`}>
                        Flow: {c.flow || 'Medium'}
                      </span>
                      {c.notes && (
                        <span className={`ml-2 text-[11px] ${theme.textSecondary}`}>
                          • {c.notes}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCycleLog(c.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="Delete cycle entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 6 COLS: OURA RING SLEEP, READINESS & DAILY ACTIVITY TRACKER */}
        <div
          className={`lg:col-span-6 ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}
        >
          <div className="flex items-start justify-between gap-2 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-editorial text-xl font-semibold leading-none">
                    Oura Ring Sleep, Readiness &amp; Activity Tracker
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      hf.ouraConnected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : theme.badgeNeutral
                    }`}
                  >
                    {hf.ouraConnected ? 'Oura Cloud Synced' : 'Oura API + Manual Ready'}
                  </span>
                </div>
                <p className={`text-xs ${theme.textSecondary} mt-1`}>
                  Pulls Sleep Score, Hours, Steps, Active Calories &amp; Cycle Temp from Oura Ring or manual log
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {hf.ouraConnected ? (
                <button
                  type="button"
                  onClick={handleSyncOuraRing}
                  disabled={isSyncingOura}
                  className={`px-3 py-1.5 rounded-xl ${theme.accentBg} text-white text-xs font-semibold flex items-center gap-1`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOura ? 'animate-spin' : ''}`} />
                  <span>{isSyncingOura ? 'Syncing...' : 'Sync Oura'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowOuraModal(true)}
                  className={`px-3 py-1.5 rounded-xl ${theme.accentBg} text-white text-xs font-semibold flex items-center gap-1`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Connect Oura</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowManualDailyForm(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} text-xs font-medium`}
              >
                {showManualDailyForm ? 'Close' : '+ Log Today'}
              </button>
            </div>
          </div>

          {/* Manual Daily Sleep & Activity Entry Form */}
          {showManualDailyForm && (
            <form
              onSubmit={handleSaveManualDailyLog}
              className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-2.5 text-xs`}
            >
              <div className="font-semibold">
                Log Daily Sleep, Readiness &amp; Activity Metrics
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={manualDailyInput.date}
                    onChange={e =>
                      setManualDailyInput({ ...manualDailyInput, date: e.target.value })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Sleep Hours</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualDailyInput.sleepHours}
                    onChange={e =>
                      setManualDailyInput({ ...manualDailyInput, sleepHours: e.target.value })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Sleep Score</label>
                  <input
                    type="number"
                    value={manualDailyInput.sleepScore}
                    onChange={e =>
                      setManualDailyInput({ ...manualDailyInput, sleepScore: e.target.value })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Readiness Score</label>
                  <input
                    type="number"
                    value={manualDailyInput.readinessScore}
                    onChange={e =>
                      setManualDailyInput({
                        ...manualDailyInput,
                        readinessScore: e.target.value
                      })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Daily Steps</label>
                  <input
                    type="number"
                    value={manualDailyInput.steps}
                    onChange={e =>
                      setManualDailyInput({ ...manualDailyInput, steps: e.target.value })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Walking Mins</label>
                  <input
                    type="number"
                    value={manualDailyInput.walkingMinutes}
                    onChange={e =>
                      setManualDailyInput({
                        ...manualDailyInput,
                        walkingMinutes: e.target.value
                      })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Active Cal</label>
                  <input
                    type="number"
                    value={manualDailyInput.activeCalories}
                    onChange={e =>
                      setManualDailyInput({
                        ...manualDailyInput,
                        activeCalories: e.target.value
                      })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Temp Shift (°C)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={manualDailyInput.tempDeviationC}
                    onChange={e =>
                      setManualDailyInput({
                        ...manualDailyInput,
                        tempDeviationC: e.target.value
                      })
                    }
                    className={`w-full px-2 py-1.5 rounded-xl ${theme.cardBg} border ${theme.border}`}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-xl ${theme.accentBg} text-white font-semibold`}
                >
                  Save Today&apos;s Metrics
                </button>
              </div>
            </form>
          )}

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-stone-500">
                <span>Sleep</span>
                <Moon className="w-3.5 h-3.5 text-[#9E5A43]" />
              </div>
              <div className="font-editorial text-2xl font-bold mt-0.5">
                {latestDailyLog?.sleepHours ? `${latestDailyLog.sleepHours}h` : '—'}
              </div>
              <div className="text-[11px] text-stone-500">
                Score: {latestDailyLog?.sleepScore ?? '—'}
              </div>
            </div>

            <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-stone-500">
                <span>Steps &amp; Walk</span>
                <Footprints className="w-3.5 h-3.5 text-[#9E5A43]" />
              </div>
              <div className="font-editorial text-2xl font-bold mt-0.5">
                {latestDailyLog?.steps ? latestDailyLog.steps.toLocaleString() : '—'}
              </div>
              <div className="text-[11px] text-stone-500">
                {latestDailyLog?.walkingMinutes
                  ? `${latestDailyLog.walkingMinutes} mins walk`
                  : 'Daily steps'}
              </div>
            </div>

            <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-stone-500">
                <span>Active Burn</span>
                <Flame className="w-3.5 h-3.5 text-[#9E5A43]" />
              </div>
              <div className="font-editorial text-2xl font-bold mt-0.5">
                {latestDailyLog?.activeCalories ? `${latestDailyLog.activeCalories}` : '—'}
              </div>
              <div className="text-[11px] text-stone-500">Active kcal</div>
            </div>

            <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border}`}>
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-stone-500">
                <span>Readiness / Temp</span>
                <Thermometer className="w-3.5 h-3.5 text-[#9E5A43]" />
              </div>
              <div className="font-editorial text-2xl font-bold mt-0.5">
                {latestDailyLog?.readinessScore ?? '—'}
              </div>
              <div className="text-[11px] text-stone-500">
                Temp:{' '}
                {latestDailyLog?.tempDeviationC !== undefined
                  ? `${latestDailyLog.tempDeviationC >= 0 ? '+' : ''}${latestDailyLog.tempDeviationC}°C`
                  : '—'}
              </div>
            </div>
          </div>

          {/* Recent 7-Day Sleep & Activity Log History */}
          {Array.isArray(hf.dailyLogs) && hf.dailyLogs.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold flex items-center justify-between">
                <span>Recent Sleep &amp; Activity Logs ({hf.dailyLogs.length} days)</span>
                {hf.ouraLastSynced && (
                  <span className={`text-[10px] ${theme.textSecondary}`}>
                    Last Oura Sync: {new Date(hf.ouraLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-minimal">
                {hf.dailyLogs.slice(0, 7).map(log => (
                  <div
                    key={log.date}
                    className={`p-2.5 rounded-xl ${theme.bgPage} border ${theme.border} flex items-center justify-between gap-2 text-xs`}
                  >
                    <div className="font-mono font-semibold">{log.date}</div>
                    <div className="flex items-center gap-3 flex-wrap text-[11px]">
                      <span>
                        <strong>Sleep:</strong> {log.sleepHours ?? '—'}h (Score {log.sleepScore ?? '—'})
                      </span>
                      <span>
                        <strong>Steps:</strong> {log.steps ? log.steps.toLocaleString() : '—'}
                      </span>
                      <span>
                        <strong>Readiness:</strong> {log.readinessScore ?? '—'}
                      </span>
                      {log.tempDeviationC !== undefined && (
                        <span className="font-mono">
                          {log.tempDeviationC >= 0 ? `+${log.tempDeviationC}` : log.tempDeviationC}°C
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs space-y-1.5`}>
              <div className="font-semibold">Connect Oura Ring or Log Manually</div>
              <p className={theme.textSecondary}>
                Click <strong>&ldquo;Connect Oura&rdquo;</strong> to pull your sleep stages, daily steps, readiness, and cycle temperature trends automatically from Oura Cloud API v2, or click <strong>&ldquo;+ Log Today&rdquo;</strong> to enter them manually anytime.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL A: VIEW ROUTINE EXERCISES & ASSIGN TO DAY                     */}
      {/* =================================================================== */}
      {viewingRoutineModal && (
        <div
          onClick={() => setViewingRoutineModal(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-xs sm:text-sm`}
          >
            <div className="flex items-start justify-between gap-3 border-b pb-3 border-[#E2D9CC]">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9E5A43]">
                  <span>{viewingRoutineModal.category}</span>
                  <span>•</span>
                  <span>{viewingRoutineModal.duration}</span>
                  <span>•</span>
                  <span>{viewingRoutineModal.intensity}</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold mt-0.5">
                  {viewingRoutineModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingRoutineModal(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewingRoutineModal.notes && (
              <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border} italic text-xs`}>
                {viewingRoutineModal.notes}
              </div>
            )}

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-stone-500">
                Routine Exercises &amp; Mobility Steps
              </div>
              <ol className="space-y-2">
                {(viewingRoutineModal.exercises || []).map((ex, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-editorial font-bold text-base leading-none text-[#9E5A43] shrink-0">
                      {i + 1}.
                    </span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={`p-3 rounded-xl ${theme.bgPage} border ${theme.border} space-y-2`}>
              <div className="text-xs font-semibold">Add Routine to Weekly Schedule:</div>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS_OF_WEEK.map(d => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => {
                      handleAssignWorkoutToDay(viewingRoutineModal, d.key);
                      setViewingRoutineModal(null);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold ${theme.accentBg} ${theme.accentHover} text-white`}
                  >
                    +{d.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL B: CONNECT OURA RING CLOUD API V2                             */}
      {/* =================================================================== */}
      {showOuraModal && (
        <div
          onClick={() => setShowOuraModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-xs sm:text-sm`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E2D9CC]">
              <div>
                <h3 className="font-editorial text-2xl font-bold">
                  Connect Mackie&apos;s Oura Ring App
                </h3>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Syncs Daily Sleep, Activity, Readiness &amp; Cycle Temperature Trends via Oura Cloud API v2
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOuraModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {ouraError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {ouraError}
              </div>
            )}

            <div className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-2.5 text-xs`}>
              <div className="font-bold text-sm">How to Connect Your Oura Ring (1-Minute Setup):</div>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li>
                  Open{' '}
                  <a
                    href="https://cloud.ouraring.com/personal-access-tokens"
                    target="_blank"
                    rel="noreferrer"
                    className={`underline font-semibold ${theme.accentText}`}
                  >
                    cloud.ouraring.com/personal-access-tokens
                  </a>{' '}
                  and sign in with your Oura account.
                </li>
                <li>
                  Tap <strong>&ldquo;Create A New Personal Access Token&rdquo;</strong> and copy the token.
                </li>
                <li>
                  Paste your token below to automatically pull your Oura Ring <strong>Sleep</strong>, <strong>Activity / Steps</strong>, <strong>Readiness</strong>, and <strong>Body Temperature Deviation</strong> for Cycle Tracking!
                </li>
              </ol>

              <form onSubmit={handleSyncOuraRing} className="space-y-2.5 pt-2">
                <input
                  type="password"
                  value={ouraTokenInput}
                  onChange={e => setOuraTokenInput(e.target.value)}
                  placeholder="Paste Oura Personal Access Token..."
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardBg} border ${theme.borderStrong} font-mono text-xs outline-none`}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOuraModal(false)}
                    className={`px-3.5 py-2 rounded-xl border ${theme.border}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSyncingOura}
                    className={`px-4 py-2 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white font-semibold`}
                  >
                    {isSyncingOura ? 'Connecting & Syncing...' : 'Save & Sync Oura Ring'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
