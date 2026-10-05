import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  BookOpen,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  RefreshCw,
  Clock,
  MapPin,
  Search,
  Sparkles,
  Sun,
  CloudSnow,
  Leaf,
  Flower2,
  Smartphone,
  Wifi,
  ChevronRight,
  ChevronDown,
  Utensils,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Info,
  Scale,
  Baby,
  Landmark,
  MessageSquarePlus,
  Pencil,
  HeartPulse
} from 'lucide-react';
import { COOKBOOK_META, COOKBOOK_CATEGORIES, COOKBOOK_RECIPES } from './data/cookbookRecipes.js';
import BabyCountdownBanner from './components/BabyCountdownBanner.jsx';
import PostpartumBabyHub from './components/PostpartumBabyHub.jsx';
import PersonalHealthFitnessHub from './components/PersonalHealthFitnessHub.jsx';
import AussieDogAgent from './components/AussieDogAgent.jsx';
import DailyNewsAndDcEvents from './components/DailyNewsAndDcEvents.jsx';
import {
  SeasonalBackgroundDoodles,
  SeasonalMotifRibbon,
  SquigglyUnderline,
  CardHeaderSquiggle,
  CutesyBadgeDoodle,
  cycleHolidayMotifs,
  setHolidayMotifMode
} from './components/SquigglyDecorations.jsx';
import { API_BASE } from './apiBase.js';

const DAYS_OF_WEEK = [
  { key: 'Monday', short: 'Mon' },
  { key: 'Tuesday', short: 'Tue' },
  { key: 'Wednesday', short: 'Wed' },
  { key: 'Thursday', short: 'Thu' },
  { key: 'Friday', short: 'Fri' },
  { key: 'Saturday', short: 'Sat' },
  { key: 'Sunday', short: 'Sun' }
];

// Seasonal Minimalist Neutral Color Palettes
const SEASON_THEMES = {
  Autumn: {
    name: 'Autumn Minimalist',
    tagline: 'Warm Linen, Travertine & Terracotta Clay',
    icon: Leaf,
    bgPage: 'bg-[#F6F2EB]',
    textPrimary: 'text-[#2C2520]',
    textSecondary: 'text-[#756A60]',
    textMuted: 'text-[#9C9084]',
    cardBg: 'bg-[#FDFBF7]',
    cardSubtle: 'bg-[#EFE9DF]',
    border: 'border-[#E2D9CC]',
    borderStrong: 'border-[#CBBBA8]',
    accentBg: 'bg-[#9E5A43]',
    accentHover: 'hover:bg-[#874A35]',
    accentText: 'text-[#9E5A43]',
    accentSoft: 'bg-[#9E5A43]/10 text-[#874A35] border-[#9E5A43]/25',
    badgeNeutral: 'bg-[#EBE4D8] text-[#5C5248] border-[#DCD2C2]',
    highlightBox: 'ring-2 ring-[#9E5A43] bg-[#FAF5EE]'
  },
  Winter: {
    name: 'Winter Minimalist',
    tagline: 'Warm Chalk, Cashmere Stone & Deep Pine',
    icon: CloudSnow,
    bgPage: 'bg-[#F4F4F1]',
    textPrimary: 'text-[#232625]',
    textSecondary: 'text-[#636865]',
    textMuted: 'text-[#8C918E]',
    cardBg: 'bg-[#FFFFFF]',
    cardSubtle: 'bg-[#EAEAE5]',
    border: 'border-[#DCDCD5]',
    borderStrong: 'border-[#C2C4BE]',
    accentBg: 'bg-[#46574F]',
    accentHover: 'hover:bg-[#384740]',
    accentText: 'text-[#46574F]',
    accentSoft: 'bg-[#46574F]/10 text-[#384740] border-[#46574F]/25',
    badgeNeutral: 'bg-[#E6E7E2] text-[#494E4B] border-[#D4D6D0]',
    highlightBox: 'ring-2 ring-[#46574F] bg-[#F6F8F7]'
  },
  Spring: {
    name: 'Spring Minimalist',
    tagline: 'Soft Ivory, Eucalyptus Sage & Warm Sand',
    icon: Flower2,
    bgPage: 'bg-[#F7F6F1]',
    textPrimary: 'text-[#282A26]',
    textSecondary: 'text-[#686E65]',
    textMuted: 'text-[#91968E]',
    cardBg: 'bg-[#FCFBF9]',
    cardSubtle: 'bg-[#EDEBE3]',
    border: 'border-[#DFDDD2]',
    borderStrong: 'border-[#C5C3B5]',
    accentBg: 'bg-[#617864]',
    accentHover: 'hover:bg-[#4F6352]',
    accentText: 'text-[#617864]',
    accentSoft: 'bg-[#617864]/12 text-[#4F6352] border-[#617864]/25',
    badgeNeutral: 'bg-[#E8E7DE] text-[#52574F] border-[#D6D4C8]',
    highlightBox: 'ring-2 ring-[#617864] bg-[#F5F8F5]'
  },
  Summer: {
    name: 'Summer Minimalist',
    tagline: 'Sun-Washed Cream, Coastal Driftwood & Olive',
    icon: Sun,
    bgPage: 'bg-[#FAF7F2]',
    textPrimary: 'text-[#2B2723]',
    textSecondary: 'text-[#736B62]',
    textMuted: 'text-[#9E9489]',
    cardBg: 'bg-[#FFFFFF]',
    cardSubtle: 'bg-[#F2ECE1]',
    border: 'border-[#E6DEC8]',
    borderStrong: 'border-[#D1C4AC]',
    accentBg: 'bg-[#8C7355]',
    accentHover: 'hover:bg-[#755E43]',
    accentText: 'text-[#8C7355]',
    accentSoft: 'bg-[#8C7355]/12 text-[#755E43] border-[#8C7355]/25',
    badgeNeutral: 'bg-[#EFE9DD] text-[#5E5448] border-[#DFD5C3]',
    highlightBox: 'ring-2 ring-[#8C7355] bg-[#FCF9F4]'
  }
};

export default function App() {
  const [boardData, setBoardData] = useState(() => {
    try {
      const saved = localStorage.getItem('mackie_saved_board_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [babyTracker, setBabyTracker] = useState(() => {
    try {
      const saved = localStorage.getItem('mackie_saved_baby_tracker');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('mackie_saved_board_data');
    } catch {
      return true;
    }
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [aussieAgentOpen, setAussieAgentOpen] = useState(true);

  // Seasonal theme state ('Auto' or specific season)
  const [seasonMode, setSeasonMode] = useState(() => {
    return localStorage.getItem('mackie_season_mode') || 'Auto';
  });

  // Mobile/Desktop view filter
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'calendar', 'meals', 'grocery', 'baby', 'news'

  // Calendar states
  const [calendarView, setCalendarView] = useState('today'); // 'today' | 'week'
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0); // 0 = current 7-day forecast, 1 = next week, etc.
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [isSyncingCal, setIsSyncingCal] = useState(false);
  const [showCalSettingsModal, setShowCalSettingsModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [icalUrlInput, setIcalUrlInput] = useState('');
  const [calSaveStatus, setCalSaveStatus] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    endTime: '10:00',
    location: '',
    category: 'Personal',
    notes: ''
  });

  // Cookbook & Meal Planner states
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState(COOKBOOK_RECIPES[0].id);
  const [targetDay, setTargetDay] = useState(() => {
    const dayStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long'
    }).format(new Date());
    return DAYS_OF_WEEK.some(d => d.key === dayStr) ? dayStr : 'Monday';
  });
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [showConversionsModal, setShowConversionsModal] = useState(false);
  const [draggedRecipe, setDraggedRecipe] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null); // { dayKey, instanceId, title }
  const [todayQuickInput, setTodayQuickInput] = useState('');
  const [customMealInputs, setCustomMealInputs] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: ''
  });

  const todayDayName = useMemo(() => {
    const dayStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long'
    }).format(currentTime);
    return DAYS_OF_WEEK.some(d => d.key === dayStr) ? dayStr : 'Monday';
  }, [currentTime]);

  const todayShortDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric'
    }).format(currentTime);
  }, [currentTime]);

  // Grocery List states
  const [manualItemName, setManualItemName] = useState('');
  const [groceryFilter, setGroceryFilter] = useState('all'); // 'all' | 'unchecked' | 'checked'
  const [toastMessage, setToastMessage] = useState(null);

  // iPhone & Riverpoint WiFi / ADP Modal
  const [showWifiModal, setShowWifiModal] = useState(false);

  // Holiday Motif Theme & Cycler ('Auto' | 'Halloween' | 'Thanksgiving' | 'Christmas')
  const [holidayMode, setHolidayMode] = useState('Auto');

  // Mackie's Dashboard Update Suggestions Modal & State
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(() => {
    try {
      const saved = localStorage.getItem('mackie_dashboard_suggestions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState('General');
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [isSyncingSuggestions, setIsSyncingSuggestions] = useState(false);

  const CLOUD_MACKIE_SUGGESTIONS_BASE = 'https://daily-executive-dashboard.onrender.com/mackie/api';

  const getLocalSuggestionsState = () => {
    let items = [];
    let deletedIds = [];
    try {
      const rawItems = localStorage.getItem('mackie_dashboard_suggestions');
      if (rawItems) items = JSON.parse(rawItems);
    } catch {}
    try {
      const rawDel = localStorage.getItem('mackie_deleted_suggestion_ids');
      if (rawDel) deletedIds = JSON.parse(rawDel);
    } catch {}
    return {
      items: Array.isArray(items) ? items : [],
      deletedIds: Array.isArray(deletedIds) ? deletedIds : []
    };
  };

  const saveLocalSuggestionsState = (items, deletedIds) => {
    try {
      localStorage.setItem('mackie_dashboard_suggestions', JSON.stringify(items));
      localStorage.setItem('mackie_deleted_suggestion_ids', JSON.stringify(deletedIds));
    } catch {}
  };

  const mergeClientSuggestions = (statesArray) => {
    const deletedSet = new Set();
    for (const st of statesArray) {
      for (const dId of (st?.deletedIds || [])) {
        if (dId) deletedSet.add(dId);
      }
    }
    const map = new Map();
    for (const st of statesArray) {
      const arr = st?.items || st?.suggestions || [];
      for (const item of arr) {
        if (item && item.id && item.text && !deletedSet.has(item.id)) {
          map.set(item.id, item);
        }
      }
    }
    const mergedItems = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return {
      items: mergedItems,
      deletedIds: Array.from(deletedSet)
    };
  };

  // Two-way sync between browser localStorage, active API_BASE server, and Render Cloud
  const syncSuggestionsEverywhere = async (showSpinner = false) => {
    if (showSpinner) setIsSyncingSuggestions(true);
    try {
      const localState = getLocalSuggestionsState();
      const payload = {
        items: localState.items,
        deletedIds: localState.deletedIds
      };

      const isAlreadyOnRender =
        typeof window !== 'undefined' &&
        window.location.hostname.includes('onrender.com');

      const requests = [
        fetch(`${API_BASE}/suggestions/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => (r.ok ? r.json() : null)).catch(() => null)
      ];

      if (!isAlreadyOnRender) {
        requests.push(
          fetch(`${CLOUD_MACKIE_SUGGESTIONS_BASE}/suggestions/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(r => (r.ok ? r.json() : null)).catch(() => null)
        );
      }

      const results = await Promise.all(requests);
      const validStates = [localState, ...results.filter(Boolean)];
      const merged = mergeClientSuggestions(validStates);

      setSuggestionsList(merged.items);
      saveLocalSuggestionsState(merged.items, merged.deletedIds);

      // If one of the servers was missing items that we merged from the other, push the final merged state
      if (!isAlreadyOnRender && results[0] && results[1]) {
        const count0 = (results[0].suggestions || []).length;
        const count1 = (results[1].suggestions || []).length;
        if (count0 !== merged.items.length) {
          fetch(`${API_BASE}/suggestions/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
          }).catch(() => {});
        }
        if (count1 !== merged.items.length) {
          fetch(`${CLOUD_MACKIE_SUGGESTIONS_BASE}/suggestions/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.error('Error syncing suggestions:', e);
    } finally {
      if (showSpinner) setIsSyncingSuggestions(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const persistBoardToLocalStorage = (nextBoard, mpTs, grTs, hfTs) => {
    try {
      if (nextBoard) {
        localStorage.setItem('mackie_saved_board_data', JSON.stringify(nextBoard));
      }
      if (mpTs !== undefined && mpTs !== null) {
        localStorage.setItem('mackie_meal_plan_updated_at', String(mpTs));
      }
      if (grTs !== undefined && grTs !== null) {
        localStorage.setItem('mackie_grocery_updated_at', String(grTs));
      }
      if (hfTs !== undefined && hfTs !== null) {
        localStorage.setItem('mackie_health_fitness_updated_at', String(hfTs));
      }
    } catch {}
  };

  const countMeals = (mp) => {
    if (!mp || typeof mp !== 'object') return 0;
    return Object.values(mp).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
      0
    );
  };

  const fetchBoard = async (isInitial = false) => {
    if (isInitial && !boardData) setLoading(true);
    try {
      const [res, babyRes] = await Promise.all([
        fetch(`${API_BASE}/board`),
        fetch(`${API_BASE}/baby-tracker`),
        syncSuggestionsEverywhere(false)
      ]);
      if (res.ok) {
        const serverJson = await res.json();
        const serverMpTs = Number(serverJson.meta?.mealPlanUpdatedAt) || 0;
        const serverGrTs = Number(serverJson.meta?.groceryUpdatedAt) || 0;
        const serverHfTs = Number(serverJson.meta?.healthFitnessUpdatedAt) || 0;

        let localBoard = null;
        let localMpTs = 0;
        let localGrTs = 0;
        let localHfTs = 0;
        try {
          const rawB = localStorage.getItem('mackie_saved_board_data');
          if (rawB) localBoard = JSON.parse(rawB);
          localMpTs = Number(localStorage.getItem('mackie_meal_plan_updated_at')) || 0;
          localGrTs = Number(localStorage.getItem('mackie_grocery_updated_at')) || 0;
          localHfTs = Number(localStorage.getItem('mackie_health_fitness_updated_at')) || 0;
        } catch {}

        const localHasNewerMeals =
          localBoard?.mealPlan &&
          (localMpTs > serverMpTs ||
            (serverMpTs === 0 && countMeals(localBoard.mealPlan) > 0 && countMeals(serverJson.mealPlan) === 0));

        const localHasNewerGrocery =
          Array.isArray(localBoard?.groceryList) &&
          (localGrTs > serverGrTs ||
            (serverGrTs === 0 && localBoard.groceryList.length > 0 && (serverJson.groceryList || []).length === 0));

        const localHasNewerHf =
          localBoard?.healthFitness && localHfTs > serverHfTs;

        const finalMealPlan = localHasNewerMeals ? localBoard.mealPlan : serverJson.mealPlan;
        const finalMpTs = localHasNewerMeals ? (localMpTs || Date.now()) : serverMpTs;

        const finalGroceryList = localHasNewerGrocery ? localBoard.groceryList : serverJson.groceryList;
        const finalGrTs = localHasNewerGrocery ? (localGrTs || Date.now()) : serverGrTs;

        const finalHealthFitness = localHasNewerHf
          ? localBoard.healthFitness
          : serverJson.healthFitness;
        const finalHfTs = localHasNewerHf ? (localHfTs || Date.now()) : serverHfTs;

        const mergedBoard = {
          ...serverJson,
          mealPlan: finalMealPlan,
          groceryList: finalGroceryList,
          healthFitness: finalHealthFitness
        };

        setBoardData(mergedBoard);
        persistBoardToLocalStorage(mergedBoard, finalMpTs, finalGrTs, finalHfTs);

        if (localHasNewerMeals || localHasNewerGrocery || localHasNewerHf) {
          fetch(`${API_BASE}/board/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mealPlan: finalMealPlan,
              mealPlanUpdatedAt: finalMpTs,
              groceryList: finalGroceryList,
              groceryUpdatedAt: finalGrTs,
              healthFitness: finalHealthFitness,
              healthFitnessUpdatedAt: finalHfTs
            })
          }).catch(() => {});
        }
      }
      if (babyRes.ok) {
        const babyJson = await babyRes.json();
        setBabyTracker(babyJson);
        try {
          localStorage.setItem('mackie_saved_baby_tracker', JSON.stringify(babyJson));
        } catch {}
      }
    } catch (e) {
      console.error('Error fetching board:', e);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard(true);
    const poll = setInterval(() => fetchBoard(false), 20000);
    return () => clearInterval(poll);
  }, []);

  // Poll suggestions every 8 seconds while the Suggest Updates modal is open
  useEffect(() => {
    if (!showSuggestionsModal) return;
    syncSuggestionsEverywhere(false);
    const modalPoll = setInterval(() => {
      syncSuggestionsEverywhere(false);
    }, 8000);
    return () => clearInterval(modalPoll);
  }, [showSuggestionsModal]);

  // Determine active season palette
  const detectedSeason = useMemo(() => {
    const m = currentTime.getMonth() + 1;
    if (m === 12 || m === 1 || m === 2) return 'Winter';
    if (m >= 3 && m <= 5) return 'Spring';
    if (m >= 6 && m <= 8) return 'Summer';
    return 'Autumn';
  }, [currentTime]);

  const activeSeasonKey = seasonMode === 'Auto' ? detectedSeason : seasonMode;
  const theme = SEASON_THEMES[activeSeasonKey] || SEASON_THEMES.Autumn;
  const SeasonIcon = theme.icon;

  const handleSeasonChange = (mode) => {
    setSeasonMode(mode);
    try {
      localStorage.setItem('mackie_season_mode', mode);
    } catch {}
  };

  const handleHolidayModeChange = (mode) => {
    setHolidayMode(mode);
    setHolidayMotifMode(mode);
    showToast(`Holiday aesthetic set to ${mode === 'Auto' ? 'Auto Seasonal' : mode} motifs`);
  };

  const handleCycleHolidayIcons = () => {
    cycleHolidayMotifs();
    showToast('Cycled seasonal & holiday illustrations across the board!');
  };

  // Mackie's Dashboard Update Suggestions Handlers
  const handleAddSuggestion = async (e) => {
    e.preventDefault();
    const cleanText = suggestionInput.trim();
    if (!cleanText || isSubmittingSuggestion) return;
    setIsSubmittingSuggestion(true);

    const now = new Date();
    const formattedDate =
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(now) + ' EST';

    const newEntry = {
      id: `sug-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: cleanText,
      category: suggestionCategory || 'General',
      author: 'Mackie',
      createdAt: now.toISOString(),
      formattedDate
    };

    // Optimistically save to localStorage & state immediately so it can never be lost
    const localState = getLocalSuggestionsState();
    const optimisticItems = [newEntry, ...localState.items.filter(i => i.id !== newEntry.id)];
    setSuggestionsList(optimisticItems);
    saveLocalSuggestionsState(optimisticItems, localState.deletedIds);
    setSuggestionInput('');

    try {
      const isAlreadyOnRender =
        typeof window !== 'undefined' &&
        window.location.hostname.includes('onrender.com');

      const postCalls = [
        fetch(`${API_BASE}/suggestions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        }).catch(() => null)
      ];

      if (!isAlreadyOnRender) {
        postCalls.push(
          fetch(`${CLOUD_MACKIE_SUGGESTIONS_BASE}/suggestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry)
          }).catch(() => null)
        );
      }

      await Promise.all(postCalls);
      await syncSuggestionsEverywhere(false);
      showToast('Saved Mackie’s update suggestion & synced to Cloud + Desktop!');
    } catch (err) {
      console.error('Error saving suggestion:', err);
    } finally {
      setIsSubmittingSuggestion(false);
    }
  };

  const handleDeleteSuggestion = async (id) => {
    const localState = getLocalSuggestionsState();
    const nextList = suggestionsList.filter(s => s.id !== id);
    const nextDeleted = localState.deletedIds.includes(id)
      ? localState.deletedIds
      : [...localState.deletedIds, id];

    setSuggestionsList(nextList);
    saveLocalSuggestionsState(nextList, nextDeleted);

    try {
      const isAlreadyOnRender =
        typeof window !== 'undefined' &&
        window.location.hostname.includes('onrender.com');

      const delCalls = [
        fetch(`${API_BASE}/suggestions/${encodeURIComponent(id)}`, {
          method: 'DELETE'
        }).catch(() => null)
      ];

      if (!isAlreadyOnRender) {
        delCalls.push(
          fetch(`${CLOUD_MACKIE_SUGGESTIONS_BASE}/suggestions/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          }).catch(() => null)
        );
      }

      await Promise.all(delCalls);
      await syncSuggestionsEverywhere(false);
      showToast('Remedied & removed suggestion from history');
    } catch (err) {
      console.error('Error deleting suggestion:', err);
    }
  };

  const handleCopySuggestionForAntigravity = (sug) => {
    const promptText = `[Mackie's Dashboard Update Request - ${sug.category || 'General'} (${sug.formattedDate || ''})]: ${sug.text}`;
    navigator.clipboard.writeText(promptText);
    showToast('Copied suggestion to clipboard — ready to paste into Antigravity!');
  };

  const handleCopyAllSuggestionsForAntigravity = () => {
    if (suggestionsList.length === 0) {
      showToast('No pending suggestions to copy');
      return;
    }
    const combined =
      `Please implement the following updates suggested by my wife for Mackie's Daily Board:\n` +
      suggestionsList
        .map((s, idx) => `${idx + 1}. [${s.category || 'General'} - ${s.formattedDate || ''}]: ${s.text}`)
        .join('\n');
    navigator.clipboard.writeText(combined);
    showToast(`Copied all ${suggestionsList.length} suggestions for Antigravity!`);
  };

  // Filtered Cookbook Recipes (preserving exact cookbook order)
  const filteredRecipes = useMemo(() => {
    return COOKBOOK_RECIPES.filter(r => {
      const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
      const q = recipeSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, recipeSearch]);

  // Group filtered recipes by category in exact cookbook order
  const groupedRecipes = useMemo(() => {
    const groups = [];
    COOKBOOK_CATEGORIES.forEach(cat => {
      const items = filteredRecipes.filter(r => r.category === cat.id);
      if (items.length > 0) {
        groups.push({ category: cat, recipes: items });
      }
    });
    return groups;
  }, [filteredRecipes]);

  const selectedRecipeObj = useMemo(() => {
    return COOKBOOK_RECIPES.find(r => r.id === selectedRecipeId) || COOKBOOK_RECIPES[0];
  }, [selectedRecipeId]);

  // Assign a recipe to a day (Monday-Sunday) and auto-populate grocery list
  const handleAssignRecipeToDay = async (recipe, dayKey) => {
    try {
      const res = await fetch(`${API_BASE}/meal-plan/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: dayKey,
          recipe,
          slot: recipe.category
        })
      });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = {
            ...prev,
            mealPlan: json.mealPlan,
            groceryList: json.groceryList
          };
          persistBoardToLocalStorage(
            next,
            json.mealPlanUpdatedAt || nowTs,
            json.groceryUpdatedAt || nowTs
          );
          return next;
        });
        showToast(
          `Added "${recipe.title}" to ${dayKey} (unique items added to Grocery List)`
        );
      }
    } catch (e) {
      console.error('Failed to assign recipe:', e);
    }
  };

  // Add a manually typed meal to a day (no grocery list tie-in)
  const handleAddCustomMealToDay = async (dayKey) => {
    const rawTitle = (customMealInputs[dayKey] || '').trim();
    if (!rawTitle) return;
    try {
      const res = await fetch(`${API_BASE}/meal-plan/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: dayKey,
          isManual: true,
          customTitle: rawTitle
        })
      });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = {
            ...prev,
            mealPlan: json.mealPlan
          };
          persistBoardToLocalStorage(next, json.mealPlanUpdatedAt || nowTs, undefined);
          return next;
        });
        setCustomMealInputs(prev => ({ ...prev, [dayKey]: '' }));
        showToast(`Added "${rawTitle}" to ${dayKey}`);
      }
    } catch (e) {
      console.error('Failed to add custom meal:', e);
    }
  };

  // Add a quick meal directly to Today's Menu Highlight box
  const handleAddTodayQuickMeal = async (e) => {
    if (e) e.preventDefault();
    const rawTitle = (todayQuickInput || '').trim();
    if (!rawTitle) return;
    try {
      const res = await fetch(`${API_BASE}/meal-plan/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: todayDayName,
          isManual: true,
          customTitle: rawTitle
        })
      });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = {
            ...prev,
            mealPlan: json.mealPlan
          };
          persistBoardToLocalStorage(next, json.mealPlanUpdatedAt || nowTs, undefined);
          return next;
        });
        setTodayQuickInput('');
        showToast(`Added "${rawTitle}" to Today (${todayDayName})`);
      }
    } catch (e) {
      console.error('Failed to add today meal:', e);
    }
  };

  // Edit / rename an existing planned meal on any day (including Today)
  const handleSaveEditedMeal = async (dayKey, instanceId, newTitle) => {
    const trimmed = (newTitle || '').trim();
    if (!trimmed) {
      setEditingMeal(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/meal-plan/${dayKey}/${instanceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed })
      });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = {
            ...prev,
            mealPlan: json.mealPlan
          };
          persistBoardToLocalStorage(next, json.mealPlanUpdatedAt || nowTs, undefined);
          return next;
        });
        setEditingMeal(null);
        showToast(`Updated ${dayKey} meal to "${trimmed}"`);
      }
    } catch (e) {
      console.error('Failed to update meal:', e);
    }
  };

  const handleRemoveMealFromDay = async (dayKey, instanceId, title) => {
    try {
      const res = await fetch(`${API_BASE}/meal-plan/${dayKey}/${instanceId}?removeIngredients=true`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = {
            ...prev,
            mealPlan: json.mealPlan,
            groceryList: json.groceryList
          };
          persistBoardToLocalStorage(
            next,
            json.mealPlanUpdatedAt || nowTs,
            json.groceryUpdatedAt || nowTs
          );
          return next;
        });
        showToast(`Removed "${title}" from ${dayKey}`);
      }
    } catch (e) {
      console.error('Failed to remove meal:', e);
    }
  };

  const handleClearWeekMeals = async () => {
    try {
      const res = await fetch(`${API_BASE}/meal-plan/clear`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = {
            ...prev,
            mealPlan: json.mealPlan
          };
          persistBoardToLocalStorage(next, json.mealPlanUpdatedAt || nowTs, undefined);
          return next;
        });
        showToast('Cleared weekly meal boxes');
      }
    } catch (e) {
      console.error('Error clearing week:', e);
    }
  };

  // Grocery List handlers
  const handleManualAddGrocery = async (e) => {
    e.preventDefault();
    if (!manualItemName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/grocery/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualItemName.trim()
        })
      });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = { ...prev, groceryList: json.groceryList };
          persistBoardToLocalStorage(next, undefined, json.groceryUpdatedAt || nowTs);
          return next;
        });
        setManualItemName('');
      }
    } catch (err) {
      console.error('Failed to add grocery item:', err);
    }
  };

  const handleToggleGroceryItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/grocery/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = { ...prev, groceryList: json.groceryList };
          persistBoardToLocalStorage(next, undefined, json.groceryUpdatedAt || nowTs);
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  const handleDeleteGroceryItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/grocery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = { ...prev, groceryList: json.groceryList };
          persistBoardToLocalStorage(next, undefined, json.groceryUpdatedAt || nowTs);
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleClearCheckedGrocery = async () => {
    try {
      const res = await fetch(`${API_BASE}/grocery/clear-checked`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = { ...prev, groceryList: json.groceryList };
          persistBoardToLocalStorage(next, undefined, json.groceryUpdatedAt || nowTs);
          return next;
        });
        showToast('Cleared checked items');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllGrocery = async () => {
    try {
      const res = await fetch(`${API_BASE}/grocery/clear-all`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const nowTs = Date.now();
        setBoardData(prev => {
          const next = { ...prev, groceryList: json.groceryList };
          persistBoardToLocalStorage(next, undefined, json.groceryUpdatedAt || nowTs);
          return next;
        });
        showToast('Cleared entire grocery list');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyGroceryList = () => {
    const items = (boardData?.groceryList || []).filter(i => !i.checked);
    if (items.length === 0) {
      showToast('No unchecked grocery items to copy');
      return;
    }
    const text = items.map(i => `• ${i.name}`).join('\n');
    navigator.clipboard.writeText(`Mackie's Grocery List:\n${text}`);
    showToast('Copied grocery list to clipboard!');
  };

  // Calendar Handlers
  const handleSyncCalendar = async () => {
    setIsSyncingCal(true);
    try {
      const res = await fetch(`${API_BASE}/calendar/sync`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setBoardData(prev => ({ ...prev, calendar: json.calendar }));
        showToast('Synced Google Calendar (amblair92@gmail.com)');
      }
    } catch (err) {
      console.error('Calendar sync error:', err);
    } finally {
      setIsSyncingCal(false);
    }
  };

  const openCalSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/calendar/config`);
      if (res.ok) {
        const json = await res.json();
        setIcalUrlInput(json.icalUrl || '');
      }
    } catch {}
    setShowCalSettingsModal(true);
  };

  const handleSaveCalConfig = async (e) => {
    e.preventDefault();
    setCalSaveStatus('Connecting & syncing calendar feed for amblair92@gmail.com...');
    try {
      const res = await fetch(`${API_BASE}/calendar/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icalUrl: icalUrlInput })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setBoardData(prev => ({ ...prev, calendar: json.calendar }));
        setCalSaveStatus('Connected! Calendar events synced.');
        setTimeout(() => {
          setShowCalSettingsModal(false);
          setCalSaveStatus(null);
        }, 1500);
      } else {
        setCalSaveStatus(`Error: ${json.error || 'Could not verify iCal URL'}`);
      }
    } catch (err) {
      setCalSaveStatus(`Error: ${err.message}`);
    }
  };

  const handleGoogleOAuthSignIn = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/google/url`);
      const json = await res.json();
      if (json.authUrl) {
        window.location.href = json.authUrl;
      } else {
        setCalSaveStatus(json.error || 'Please use the Secret iCal URL above.');
      }
    } catch (err) {
      setCalSaveStatus(err.message);
    }
  };

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/calendar/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        const json = await res.json();
        setBoardData(prev => ({ ...prev, calendar: json.calendar }));
        setShowAddEventModal(false);
        setNewEvent({
          title: '',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          endTime: '10:00',
          location: '',
          category: 'Personal',
          notes: ''
        });
        showToast('Added event to Mackie’s schedule');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCalendarEvent = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/calendar/event/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        setBoardData(prev => ({ ...prev, calendar: json.calendar }));
        showToast('Removed event from schedule');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !boardData) {
    return (
      <div className={`min-h-screen ${theme.bgPage} ${theme.textPrimary} flex items-center justify-center p-6`}>
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#9E5A43] border-t-transparent animate-spin mx-auto" />
          <p className="font-editorial text-2xl italic">Preparing Mackie&apos;s Daily Board...</p>
        </div>
      </div>
    );
  }

  const mealPlan = boardData?.mealPlan || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };
  const groceryList = boardData?.groceryList || [];
  const uncheckedGroceryCount = groceryList.filter(i => !i.checked).length;
  const checkedGroceryCount = groceryList.filter(i => i.checked).length;

  const filteredGroceryList = groceryList.filter(item => {
    if (groceryFilter === 'unchecked') return !item.checked;
    if (groceryFilter === 'checked') return item.checked;
    return true;
  });

  const calendar = boardData?.calendar || {
    todayEvents: [],
    weekSchedule: {},
    account: 'amblair92@gmail.com'
  };

  const formattedHeaderDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(currentTime);

  const formattedHeaderTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(currentTime);

  const totalPlannedMeals = Object.values(mealPlan).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <div className={`min-h-screen relative ${theme.bgPage} ${theme.textPrimary} transition-colors duration-500 pb-12`}>
      {/* Cutesy Seasonal Minimalist Squiggly Lines & Background Doodles */}
      <SeasonalBackgroundDoodles season={activeSeasonKey} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 max-w-md bg-[#2C2520] text-[#FDFBF7] px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#D4A373] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white text-xs p-1"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* TOP HEADER: SEASONAL MINIMALIST BRANDING, DATE, SEASON & WIFI HUB   */}
      {/* =================================================================== */}
      <header className={`${theme.cardBg} border-b ${theme.border} sticky top-0 z-30 backdrop-blur-md bg-opacity-95`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Title, Seasonal Minimalist Badge & Cutesy Squiggle (Email Removed!) */}
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl ${theme.cardSubtle} border ${theme.border} flex items-center justify-center shadow-xs`}>
                <SeasonIcon className={`w-5 h-5 ${theme.accentText}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight leading-none">
                    Mackie&apos;s Daily Board
                  </h1>
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${theme.accentSoft} flex items-center gap-1`}>
                    <span>{theme.name}</span>
                  </span>
                  <a
                    href="https://daily-executive-dashboard.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${theme.borderStrong} ${theme.cardSubtle} hover:${theme.accentSoft} transition flex items-center gap-1.5 shadow-2xs`}
                    title="Open Husband's Dashboard: Executive Daily Briefing | Chief of Staff Command"
                  >
                    <Landmark className={`w-3 h-3 ${theme.accentText} shrink-0`} />
                    <span>Executive Daily Briefing | Chief of Staff Command</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 shrink-0" />
                  </a>
                  {/* Suggest Dashboard Updates Tab for Mackie & Mike */}
                  <button
                    type="button"
                    onClick={() => setShowSuggestionsModal(true)}
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.borderStrong} ${theme.accentSoft} hover:opacity-90 transition flex items-center gap-1.5 shadow-2xs`}
                    title="Mackie: Suggest Dashboard Updates | Mike: Grab historical comments for Antigravity"
                  >
                    <MessageSquarePlus className={`w-3 h-3 ${theme.accentText} shrink-0`} />
                    <span>Suggest Updates</span>
                    {suggestionsList.length > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${theme.accentBg} text-white`}>
                        {suggestionsList.length}
                      </span>
                    )}
                  </button>
                  <CutesyBadgeDoodle season={activeSeasonKey} variant={0} />
                </div>
                <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                  <p className={`text-xs ${theme.textSecondary} flex items-center gap-2`}>
                    <span>{formattedHeaderDate}</span>
                    <span>•</span>
                    <span className="font-medium">{formattedHeaderTime}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Season Switcher, Holiday Decor Cycler, Suggest Updates, iPhone/Riverpoint Access, & Calendar Sync */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Holiday Motifs Selector & Cycler (Halloween / Thanksgiving / Christmas) */}
              <div className={`flex items-center gap-1 p-1 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs`}>
                {['Auto', 'Halloween', 'Thanksgiving', 'Christmas'].map(h => {
                  const active = holidayMode === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHolidayModeChange(h)}
                      className={`px-2 py-1 rounded-lg transition font-medium text-[11px] ${
                        active
                          ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.border}`
                          : `${theme.textSecondary} hover:${theme.textPrimary}`
                      }`}
                      title={`Show ${h} warm-grey aesthetic illustrations`}
                    >
                      {h === 'Auto' ? 'Holiday: Auto' : h}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={handleCycleHolidayIcons}
                  className={`px-2 py-1 rounded-lg border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft} text-[11px] font-semibold flex items-center gap-1 transition`}
                  title="Cycle through ghosts, candy corn, witch, wolf & moon, potions, scarecrows, trick-or-treaters, cauldrons, witch brooms, black cats, turkeys, pilgrims, Frosty, Santa & reindeer"
                >
                  <Sparkles className={`w-3 h-3 ${theme.accentText}`} />
                  <span>Cycle Decor</span>
                </button>
              </div>

              {/* Seasonal Theme Selector */}
              <div className={`flex items-center gap-1 p-1 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs`}>
                {['Auto', 'Spring', 'Summer', 'Autumn', 'Winter'].map(s => {
                  const active = seasonMode === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSeasonChange(s)}
                      className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] ${
                        active
                          ? `${theme.cardBg} ${theme.textPrimary} shadow-xs border ${theme.border}`
                          : `${theme.textSecondary} hover:${theme.textPrimary}`
                      }`}
                      title={s === 'Auto' ? `Auto-updates by season (Currently ${detectedSeason})` : `Switch to ${s} Minimalist palette`}
                    >
                      {s === 'Auto' ? `Auto (${detectedSeason})` : s}
                    </button>
                  );
                })}
              </div>

              {/* iPhone & Riverpoint WiFi / ADP Bypass Button */}
              <button
                type="button"
                onClick={() => setShowWifiModal(true)}
                className={`px-3 py-1.5 rounded-xl border ${theme.border} ${theme.cardBg} hover:${theme.cardSubtle} text-xs font-medium flex items-center gap-1.5 transition shadow-2xs`}
                title="iPhone Access & Riverpoint WiFi / ADP Bypass Link"
              >
                <Smartphone className={`w-3.5 h-3.5 ${theme.accentText}`} />
                <span>iPhone &amp; WiFi Link</span>
              </button>

              {/* Sync Calendar Button */}
              <button
                type="button"
                onClick={handleSyncCalendar}
                disabled={isSyncingCal}
                className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs disabled:opacity-60`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCal ? 'animate-spin' : ''}`} />
                <span>{isSyncingCal ? 'Syncing...' : 'Sync Calendar'}</span>
              </button>
            </div>
          </div>

          {/* Mobile / Quick Section Switcher Tabs (Clean Minimalist — No Squiggly Lines) */}
          <nav aria-label="Dashboard sections" className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-minimal">
            {[
              { id: 'all', label: 'All-in-One View', icon: Sparkles },
              { id: 'calendar', label: 'Calendar (Daily / Weekly)', icon: Calendar },
              { id: 'meals', label: `Cookbook & Weekly Meals (${totalPlannedMeals})`, icon: BookOpen },
              { id: 'grocery', label: `Grocery List (${uncheckedGroceryCount})`, icon: ShoppingBag },
              { id: 'fitness', label: 'Personal Health & Fitness', icon: HeartPulse },
              { id: 'baby', label: 'Baby Aiden & AAP Hub', icon: Baby },
              { id: 'news', label: 'U.S. Policy News & D.C. Guide', icon: Landmark }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                    isActive
                      ? `${theme.accentSoft} font-semibold shadow-2xs`
                      : `${theme.cardSubtle} ${theme.textSecondary} ${theme.border} hover:${theme.textPrimary}`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setShowSuggestionsModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${theme.borderStrong} ${theme.cardSubtle} hover:${theme.accentSoft}`}
            >
              <MessageSquarePlus className={`w-3.5 h-3.5 ${theme.accentText}`} />
              <span>Suggest Updates ({suggestionsList.length})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* =================================================================== */}
      {/* MAIN DASHBOARD CONTENT                                              */}
      {/* =================================================================== */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {/* Subtle Seasonal / Holiday Aesthetic Motif Garland */}
        <SeasonalMotifRibbon season={activeSeasonKey} rowSeed={0} />

        {/* ================================================================= */}
        {/* TOP BANNER: BABY BOY AIDEN JAMES VANE COUNTDOWN (NOV 3RD)         */}
        {/* ================================================================= */}
        <BabyCountdownBanner theme={theme} activeSeason={activeSeasonKey} />

        {/* ================================================================= */}
        {/* ROW 1: MACKIE'S GOOGLE CALENDAR (SPREAD ACROSS ENTIRE 1ST ROW)    */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'calendar') && (
          <section
            aria-label="Google Calendar Schedule"
            className={`w-full ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
          >
            {/* Calendar Header */}
            <div className={`flex items-center justify-between border-b ${theme.border} pb-3.5 gap-2 flex-wrap`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-editorial text-xl sm:text-2xl font-semibold leading-tight">
                      Mackie&apos;s Calendar
                    </h2>
                    <CutesyBadgeDoodle season={activeSeasonKey} variant={2} />
                  </div>
                  <button
                    type="button"
                    onClick={openCalSettings}
                    className={`text-[11px] ${theme.textSecondary} hover:${theme.accentText} flex items-center gap-1 underline decoration-dotted`}
                  >
                    <span>Google Calendar</span>
                    <span>•</span>
                    <span>{calendar.authorized ? 'Live Synced' : 'Connect Feed'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Daily / Weekly Cycle Toggle */}
                <div className={`flex items-center p-0.5 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs`}>
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarView('today');
                      setCalendarWeekOffset(0);
                    }}
                    className={`px-3 py-1 rounded-lg font-medium text-xs transition ${
                      calendarView === 'today'
                        ? `${theme.cardBg} ${theme.textPrimary} shadow-2xs`
                        : theme.textSecondary
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (calendarView !== 'week') {
                        setCalendarView('week');
                        setCalendarWeekOffset(0);
                      } else {
                        setCalendarWeekOffset(prev => (prev + 1) % 8);
                      }
                    }}
                    title="Select Weekly 7-day forecast (click again to cycle to the following week)"
                    className={`px-3 py-1 rounded-lg font-medium text-xs transition ${
                      calendarView === 'week'
                        ? `${theme.cardBg} ${theme.textPrimary} shadow-2xs`
                        : theme.textSecondary
                    }`}
                  >
                    {calendarView === 'week' && calendarWeekOffset > 0
                      ? `Weekly (+${calendarWeekOffset}w)`
                      : 'Weekly'}
                  </button>
                </div>

                {/* Add Event Button */}
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className={`p-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} transition`}
                  title="Add Calendar Event"
                  aria-label="Add Calendar Event"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Connection Prompt if iCal/OAuth not yet linked */}
            {!calendar.authorized && (
              <div className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border} flex items-center justify-between gap-3 text-xs flex-wrap`}>
                <div className="space-y-0.5">
                  <div className="font-semibold">Sync with amblair92@gmail.com</div>
                  <p className={`${theme.textSecondary} text-[11px]`}>
                    Connect her Google Calendar feed for automatic 24/7 daily &amp; weekly updates (no password required).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCalSettings}
                  className={`px-3 py-1.5 rounded-lg ${theme.accentBg} text-white font-medium text-xs shrink-0`}
                >
                  Connect
                </button>
              </div>
            )}

            {/* DAILY VIEW vs WEEKLY VIEW (FULL-WIDTH ROW LAYOUT) */}
            <div className="flex flex-col gap-3">
              {calendarView === 'today' ? (
                (() => {
                  const todayEvents = calendar.todayEvents || [];
                  const activeList = todayEvents.filter(e => e.status !== 'completed');
                  const pastList = todayEvents.filter(e => e.status === 'completed');

                  return (
                    <>
                      <div className={`flex items-center justify-between text-xs ${theme.textSecondary} px-1`}>
                        <span className="font-medium">
                          Today&apos;s Schedule ({activeList.length} upcoming)
                        </span>
                        <span className="font-mono text-[11px]">{calendar.todayDate}</span>
                      </div>

                      {activeList.length === 0 ? (
                        <div className={`p-6 rounded-xl ${theme.cardSubtle} border ${theme.border} text-center space-y-1.5 my-1`}>
                          <CheckCircle2 className={`w-6 h-6 mx-auto ${theme.accentText}`} />
                          <div className="font-editorial text-lg font-medium">
                            A calm, open day ahead
                          </div>
                          <p className={`text-xs ${theme.textSecondary}`}>
                            No remaining appointments scheduled for today.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {activeList.map(evt => (
                            <div
                              key={evt.id}
                              className={`p-3.5 rounded-xl border ${
                                evt.status === 'in_progress'
                                  ? `${theme.accentSoft} border-[#9E5A43]/40`
                                  : `${theme.cardSubtle} ${theme.border}`
                              } flex flex-col gap-1 transition group`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-semibold flex items-center gap-1.5 ${theme.accentText}`}>
                                  <Clock className="w-3.5 h-3.5" />
                                  {evt.time}
                                  {evt.endTime ? ` – ${evt.endTime}` : ''}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {evt.category && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                                      {evt.category}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCalendarEvent(evt.id)}
                                    className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 p-0.5 transition"
                                    title="Remove event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="font-semibold text-sm">{evt.title}</div>
                              {evt.location && (
                                <div className={`text-xs ${theme.textSecondary} flex items-center gap-1`}>
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span>{evt.location}</span>
                                </div>
                              )}
                              {evt.notes && (
                                <p className={`text-xs ${theme.textSecondary} mt-1 leading-relaxed`}>
                                  {evt.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Completed Earlier Today Drawer */}
                      {pastList.length > 0 && (
                        <div className={`pt-2 border-t ${theme.border}`}>
                          <button
                            type="button"
                            onClick={() => setShowPastEvents(!showPastEvents)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl ${theme.cardSubtle} text-xs ${theme.textSecondary}`}
                          >
                            <span>{pastList.length} completed earlier today</span>
                            <span>{showPastEvents ? 'Hide ▲' : 'Show ▼'}</span>
                          </button>
                          {showPastEvents && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {pastList.map(pevt => (
                                <div
                                  key={pevt.id}
                                  className={`p-2.5 rounded-xl border ${theme.border} opacity-60 text-xs flex items-center justify-between`}
                                >
                                  <div>
                                    <div className="line-through font-medium">{pevt.title}</div>
                                    <div className={theme.textMuted}>
                                      {pevt.time} {pevt.endTime ? `– ${pevt.endTime}` : ''}
                                    </div>
                                  </div>
                                  <Check className="w-4 h-4" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                /* 7-DAY WEEKLY FORECAST VIEW (CLICK TO CYCLE FORWARD TO FOLLOWING WEEK) */
                (() => {
                  const baseDateStr = calendar.todayDate || new Date().toISOString().split('T')[0];
                  const baseDateObj = new Date(baseDateStr + 'T12:00:00');
                  const sevenDayKeys = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(baseDateObj);
                    d.setDate(d.getDate() + calendarWeekOffset * 7 + i);
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    return `${yyyy}-${mm}-${dd}`;
                  });

                  const firstDayObj = new Date(sevenDayKeys[0] + 'T12:00:00');
                  const lastDayObj = new Date(sevenDayKeys[6] + 'T12:00:00');
                  const rangeLabel = `${firstDayObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })} – ${lastDayObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}`;

                  return (
                    <div className="flex flex-col gap-2.5">
                      {/* Weekly Forecast Navigation Header */}
                      <div className="flex items-center justify-between gap-2 flex-wrap px-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${theme.textPrimary}`}>
                            7-Day Forecast: {rangeLabel}
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                            {calendarWeekOffset === 0
                              ? 'This Week'
                              : calendarWeekOffset === 1
                              ? 'Following Week (+1w)'
                              : `+${calendarWeekOffset} Weeks Ahead`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {calendarWeekOffset > 0 && (
                            <>
                              <button
                                type="button"
                                onClick={() => setCalendarWeekOffset(prev => Math.max(0, prev - 1))}
                                className={`px-2.5 py-1 rounded-lg border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} text-[11px] font-medium transition`}
                              >
                                ← Prev Week
                              </button>
                              <button
                                type="button"
                                onClick={() => setCalendarWeekOffset(0)}
                                className={`px-2.5 py-1 rounded-lg border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft} text-[11px] font-medium transition`}
                              >
                                Back to This Week
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setCalendarWeekOffset(prev => (prev + 1) % 8)}
                            className={`px-2.5 py-1 rounded-lg ${theme.accentSoft} border text-[11px] font-semibold flex items-center gap-1 transition`}
                            title="Cycle forward to the following week"
                          >
                            <span>Next Week</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 7-Day Columns — Click forecast to cycle forward to the following week */}
                      <div
                        onClick={() => setCalendarWeekOffset(prev => (prev + 1) % 8)}
                        title="Click anywhere on the 7-day forecast to cycle forward to the following week"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 cursor-pointer select-none"
                      >
                        {sevenDayKeys.map(dateKey => {
                          const dayEvents = (calendar.weekSchedule && calendar.weekSchedule[dateKey]) || [];
                          const dObj = new Date(dateKey + 'T12:00:00');
                          const weekdayShort = dObj.toLocaleDateString('en-US', { weekday: 'short' });
                          const monthDay = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          const isToday = dateKey === calendar.todayDate;

                          return (
                            <div
                              key={dateKey}
                              className={`p-3 rounded-xl border ${
                                isToday ? `${theme.accentSoft}` : `${theme.cardSubtle} ${theme.border}`
                              } flex flex-col gap-2 min-h-[150px] transition hover:border-[#CBBBA8]`}
                            >
                              <div className={`flex items-center justify-between text-xs font-semibold border-b ${theme.border} pb-1.5`}>
                                <span className="flex items-center gap-1.5">
                                  {isToday && <span className={`w-2 h-2 rounded-full ${theme.accentBg}`} />}
                                  <span>{weekdayShort}, {monthDay}</span>
                                </span>
                                {isToday && (
                                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5">
                                    Today
                                  </span>
                                )}
                              </div>

                              {/* If nothing scheduled for that day, leave the column below the day header completely blank */}
                              {dayEvents.length > 0 && (
                                <div className="space-y-1.5">
                                  {dayEvents.map(wevt => (
                                    <div
                                      key={wevt.id}
                                      className={`p-2 rounded-lg ${theme.cardBg} border ${theme.border} text-xs flex flex-col gap-0.5`}
                                    >
                                      <div className="flex items-center justify-between gap-1">
                                        <span className={`font-semibold text-[11px] ${theme.accentText} truncate`}>
                                          {wevt.time}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={e => {
                                            e.stopPropagation();
                                            handleDeleteCalendarEvent(wevt.id);
                                          }}
                                          className="text-stone-400 hover:text-red-500 shrink-0"
                                          title="Delete event"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <div className="font-medium text-[#2C2520] leading-snug break-words">
                                        {wevt.title}
                                      </div>
                                      {wevt.location && (
                                        <div className={`text-[10px] ${theme.textSecondary} flex items-center gap-1 truncate`}>
                                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                                          <span className="truncate">{wevt.location}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* ROW 2: M&M'S FAVORITES + WEEKLY MEAL PLAN + RUNNING GROCERY LIST  */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =============================================================== */}
          {/* ROW 2, BOX 1: INTERACTIVE COOKBOOK ("M & M's Family Favorites") */}
          {/* =============================================================== */}
          {(activeSection === 'all' || activeSection === 'meals') && (
            <section
              aria-label="M & M's Family Favorites Cookbook"
              className={`${
                activeSection === 'meals' ? 'lg:col-span-6' : 'lg:col-span-4'
              } ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
            >
              <CardHeaderSquiggle season={activeSeasonKey} />
              <div className="flex items-start justify-between gap-3 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-editorial text-xl font-semibold leading-none">
                        {COOKBOOK_META.title}
                      </h2>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${theme.badgeNeutral}`}>
                        {COOKBOOK_RECIPES.length} Recipes
                      </span>
                      <CutesyBadgeDoodle season={activeSeasonKey} variant={3} />
                    </div>
                    <p className={`text-xs ${theme.textSecondary} mt-1`}>
                      by {COOKBOOK_META.author} • Select to place on Mon–Sun
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConversionsModal(true)}
                  className={`px-2.5 py-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} text-xs font-medium flex items-center gap-1.5 hover:${theme.accentSoft} transition`}
                  title="Cookbook Conversions & Substitutions Chart (Page 95)"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>p. 95 Chart</span>
                </button>
              </div>

              {/* Search & Category Filter Pills (In Exact Cookbook Table of Contents Order) */}
              <div className="space-y-2.5">
                <search className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`} />
                  <input
                    type="search"
                    value={recipeSearch}
                    onChange={e => setRecipeSearch(e.target.value)}
                    placeholder="Search cookbook recipes or ingredients..."
                    className={`w-full pl-9 pr-4 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs sm:text-sm outline-none focus:border-[#9E5A43]`}
                  />
                </search>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-minimal">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                      selectedCategory === 'ALL'
                        ? `${theme.accentBg} text-white border-transparent`
                        : `${theme.cardSubtle} ${theme.textSecondary} ${theme.border}`
                    }`}
                  >
                    All ({COOKBOOK_RECIPES.length})
                  </button>
                  {COOKBOOK_CATEGORIES.map(cat => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
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

              {/* Scrollable Interactive Recipe Titles Box (Organized by Cookbook Sections) */}
              <div className={`max-h-[580px] overflow-y-auto pr-1 space-y-4 scrollbar-minimal border ${theme.border} rounded-xl p-3 ${theme.bgPage}`}>
                {groupedRecipes.length === 0 ? (
                  <div className={`text-center py-8 text-xs ${theme.textSecondary}`}>
                    No recipes match &ldquo;{recipeSearch}&rdquo;
                  </div>
                ) : (
                  groupedRecipes.map(group => (
                    <div key={group.category.id} className="space-y-1.5">
                      <div className="flex items-center justify-between px-2 py-1 sticky top-0 bg-[#F6F2EB]/95 backdrop-blur-xs z-10 border-b border-[#E2D9CC]">
                        <h3 className="font-editorial text-base font-bold tracking-wide text-[#2C2520]">
                          {group.category.label}
                        </h3>
                        <span className={`text-[10px] font-mono ${theme.textMuted}`}>
                          Page {group.category.page}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {group.recipes.map(recipe => {
                          const isSelected = selectedRecipeId === recipe.id;
                          return (
                            <div
                              key={recipe.id}
                              draggable
                              onDragStart={() => setDraggedRecipe(recipe)}
                              onDragEnd={() => {
                                setDraggedRecipe(null);
                                setDragOverDay(null);
                              }}
                              onClick={() => setSelectedRecipeId(recipe.id)}
                              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                                isSelected
                                  ? `${theme.cardBg} ${theme.highlightBox} shadow-xs`
                                  : `${theme.cardBg} ${theme.border} hover:border-[#CBBBA8]`
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-xs sm:text-sm truncate">
                                      {recipe.title}
                                    </span>
                                    <span className={`text-[10px] font-mono ${theme.textMuted} shrink-0`}>
                                      p.{recipe.page}
                                    </span>
                                  </div>
                                  <div className={`text-[11px] ${theme.textSecondary} truncate`}>
                                    {recipe.ingredients.length} ingredients
                                    {recipe.author ? ` • Recipe by ${recipe.author}` : ''}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setViewingRecipe(recipe);
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-medium border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft}`}
                                    title="View full recipe instructions & ingredients"
                                  >
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleAssignRecipeToDay(recipe, targetDay);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${theme.accentBg} ${theme.accentHover} text-white flex items-center gap-1`}
                                    title={`Place on ${targetDay} and add ingredients to grocery list`}
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>{targetDay.slice(0, 3)}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Day-Picker Row when Recipe is Selected */}
                              {isSelected && (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className={`mt-2.5 pt-2.5 border-t ${theme.border} flex flex-col gap-2`}
                                >
                                  <div className="flex items-center justify-between gap-1 flex-wrap">
                                    <span className={`text-[11px] font-medium ${theme.textSecondary}`}>
                                      Tap a day to place <strong>{recipe.title}</strong> &amp; add its {recipe.ingredients.length} ingredients:
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-7 gap-1">
                                    {DAYS_OF_WEEK.map(d => (
                                      <button
                                        key={d.key}
                                        type="button"
                                        onClick={() => {
                                          setTargetDay(d.key);
                                          handleAssignRecipeToDay(recipe, d.key);
                                        }}
                                        className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition text-center ${
                                          targetDay === d.key
                                            ? `${theme.accentBg} text-white border-transparent`
                                            : `${theme.cardSubtle} ${theme.textPrimary} ${theme.border} hover:${theme.accentSoft}`
                                        }`}
                                      >
                                        + {d.short}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* =============================================================== */}
          {/* ROW 2, BOX 2: WEEKLY MEAL PLAN (MON – SUN)                      */}
          {/* =============================================================== */}
          {(activeSection === 'all' || activeSection === 'meals') && (
            <section
              aria-label="Weekly Meal Plan (Mon - Sun)"
              className={`${
                activeSection === 'meals' ? 'lg:col-span-6' : 'lg:col-span-4'
              } ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
            >
              <CardHeaderSquiggle season={activeSeasonKey} />
              <div className="flex items-center justify-between gap-2 flex-wrap border-b pb-3.5 border-[#E2D9CC]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-editorial text-xl font-semibold leading-tight">
                        Weekly Meal Plan
                      </h2>
                      <CutesyBadgeDoodle season={activeSeasonKey} />
                    </div>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      Active Day: <strong className={theme.accentText}>{targetDay}</strong> • Mon – Sun
                    </p>
                  </div>
                </div>

                {totalPlannedMeals > 0 && (
                  <button
                    type="button"
                    onClick={handleClearWeekMeals}
                    className={`text-xs ${theme.textSecondary} hover:text-red-600 px-2.5 py-1 rounded-lg border ${theme.border} transition`}
                  >
                    Clear Week
                  </button>
                )}
              </div>

              {/* TODAY'S MENU HIGHLIGHT BOX (Auto-populates current day & editable in place) */}
              {(() => {
                const todayMeals = mealPlan[todayDayName] || [];
                const isTodayDragTarget = dragOverDay === `TODAY_${todayDayName}`;
                return (
                  <div
                    onClick={() => setTargetDay(todayDayName)}
                    onDragOver={e => {
                      e.preventDefault();
                      setDragOverDay(`TODAY_${todayDayName}`);
                    }}
                    onDragLeave={() => setDragOverDay(null)}
                    onDrop={e => {
                      e.preventDefault();
                      setDragOverDay(null);
                      if (draggedRecipe) {
                        setTargetDay(todayDayName);
                        handleAssignRecipeToDay(draggedRecipe, todayDayName);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                      isTodayDragTarget
                        ? 'border-[#9E5A43] bg-[#FDF8F3] ring-2 ring-[#9E5A43]/30'
                        : 'border-[#9E5A43]/60 bg-gradient-to-br from-[#FDF9F3] via-[#FAF3EA] to-[#F5EBE0] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9E5A43] text-white flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-3 h-3" />
                          Today&apos;s Menu
                        </span>
                        <span className="font-editorial text-lg font-bold text-[#2C2623]">
                          {todayDayName}
                        </span>
                        <span className={`text-xs ${theme.textSecondary}`}>
                          • {todayShortDateLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setTargetDay(todayDayName);
                          handleAssignRecipeToDay(selectedRecipeObj, todayDayName);
                        }}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${theme.border} bg-white hover:${theme.accentSoft} flex items-center gap-1 shadow-2xs`}
                        title={`Add selected recipe (${selectedRecipeObj.title}) to Today (${todayDayName})`}
                      >
                        <Plus className="w-3 h-3 text-[#9E5A43]" />
                        <span>Add Selected Recipe</span>
                      </button>
                    </div>

                    {/* Today's Planned Meals List with Inline Edit */}
                    {todayMeals.length === 0 ? (
                      <div className="py-2.5 px-3 mb-2.5 text-center border border-dashed border-[#D5C7B8] bg-white/70 rounded-xl text-xs text-[#6E655F]">
                        No meal set for <strong>Today ({todayDayName})</strong> yet — type below, tap a recipe, or drag here!
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 mb-2.5">
                        {todayMeals.map(meal => {
                          const fullRec = meal.recipeId
                            ? COOKBOOK_RECIPES.find(r => r.id === meal.recipeId)
                            : null;
                          const isCustomMeal = meal.isManual || !fullRec;
                          const isEditingThis =
                            editingMeal &&
                            editingMeal.dayKey === todayDayName &&
                            editingMeal.instanceId === meal.instanceId;

                          return (
                            <div
                              key={meal.instanceId}
                              onClick={e => {
                                e.stopPropagation();
                                if (!isEditingThis && fullRec) setViewingRecipe(fullRec);
                              }}
                              className="px-3 py-2 rounded-xl bg-white border border-[#E2D9CC] shadow-2xs flex items-center justify-between gap-2 group"
                            >
                              {isEditingThis ? (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className="flex items-center gap-1.5 flex-1"
                                >
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editingMeal.title}
                                    onChange={e =>
                                      setEditingMeal(prev => ({
                                        ...prev,
                                        title: e.target.value
                                      }))
                                    }
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSaveEditedMeal(
                                          todayDayName,
                                          meal.instanceId,
                                          editingMeal.title
                                        );
                                      } else if (e.key === 'Escape') {
                                        setEditingMeal(null);
                                      }
                                    }}
                                    className="flex-1 min-w-0 px-2.5 py-1 rounded-lg border border-[#9E5A43] text-xs font-medium outline-none bg-[#FAF7F2]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveEditedMeal(
                                        todayDayName,
                                        meal.instanceId,
                                        editingMeal.title
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-[#9E5A43] text-white text-[11px] font-semibold hover:bg-[#864934] transition shrink-0"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingMeal(null)}
                                    className="px-2 py-1 rounded-lg border border-[#E2D9CC] text-[11px] text-[#6E655F] hover:bg-stone-100 transition shrink-0"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={`text-xs sm:text-sm font-semibold text-[#2C2623] truncate ${
                                        fullRec ? 'group-hover:underline' : ''
                                      }`}
                                    >
                                      {meal.title}
                                    </div>
                                    <div className={`text-[10px] ${theme.textSecondary}`}>
                                      {isCustomMeal
                                        ? 'Today’s Plan • Tap Edit to change'
                                        : `${meal.category} • Tap for recipe or Edit to modify`}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setEditingMeal({
                                          dayKey: todayDayName,
                                          instanceId: meal.instanceId,
                                          title: meal.title
                                        });
                                      }}
                                      className="px-2 py-1 rounded-md text-[11px] font-medium text-[#6E655F] hover:text-[#9E5A43] hover:bg-[#FAF3EA] border border-transparent hover:border-[#E2D9CC] flex items-center gap-1 transition"
                                      title="Edit or change this meal plan"
                                    >
                                      <Pencil className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleRemoveMealFromDay(
                                          todayDayName,
                                          meal.instanceId,
                                          meal.title
                                        );
                                      }}
                                      className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                                      title="Remove meal from Today"
                                      aria-label={`Remove ${meal.title} from ${todayDayName}`}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Add / Change Today's Plan Input */}
                    <form
                      onSubmit={handleAddTodayQuickMeal}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        value={todayQuickInput}
                        onChange={e => setTodayQuickInput(e.target.value)}
                        placeholder={`Add or update ${todayDayName}'s menu plan...`}
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white border border-[#DECFC0] text-xs outline-none focus:border-[#9E5A43]"
                      />
                      <button
                        type="submit"
                        disabled={!todayQuickInput.trim()}
                        className={`px-3 py-1.5 rounded-lg ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1 transition disabled:opacity-40 shrink-0 shadow-2xs`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Today</span>
                      </button>
                    </form>
                  </div>
                );
              })()}

              {/* 7 Visual Day Boxes (Monday through Sunday) */}
              <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-minimal">
                {DAYS_OF_WEEK.map(dayObj => {
                  const dayMeals = mealPlan[dayObj.key] || [];
                  const isTarget = targetDay === dayObj.key;
                  const isTodayBox = dayObj.key === todayDayName;
                  const isDragTarget = dragOverDay === dayObj.key;

                  return (
                    <div
                      key={dayObj.key}
                      onClick={() => setTargetDay(dayObj.key)}
                      onDragOver={e => {
                        e.preventDefault();
                        setDragOverDay(dayObj.key);
                      }}
                      onDragLeave={() => setDragOverDay(null)}
                      onDrop={e => {
                        e.preventDefault();
                        setDragOverDay(null);
                        if (draggedRecipe) {
                          setTargetDay(dayObj.key);
                          handleAssignRecipeToDay(draggedRecipe, dayObj.key);
                        }
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isDragTarget || isTarget
                          ? `${theme.highlightBox}`
                          : `${theme.cardSubtle} ${theme.border} hover:border-[#CBBBA8]`
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-editorial text-base sm:text-lg font-bold">
                              {dayObj.key}
                            </span>
                            {isTodayBox && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#9E5A43] text-white">
                                Today
                              </span>
                            )}
                            {isTarget && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${theme.accentSoft}`}>
                                Selected
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setTargetDay(dayObj.key);
                              handleAssignRecipeToDay(selectedRecipeObj, dayObj.key);
                            }}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft} flex items-center gap-1`}
                            title={`Add currently selected recipe (${selectedRecipeObj.title}) to ${dayObj.key}`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Selected</span>
                          </button>
                        </div>

                        {/* Manual Meal Input for this specific day (Not tied to grocery list) */}
                        <div
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5"
                        >
                          <input
                            type="text"
                            value={customMealInputs[dayObj.key] || ''}
                            onChange={e =>
                              setCustomMealInputs(prev => ({
                                ...prev,
                                [dayObj.key]: e.target.value
                              }))
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomMealToDay(dayObj.key);
                              }
                            }}
                            placeholder={`Type in a meal for ${dayObj.key}...`}
                            className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg ${theme.cardBg} border ${theme.border} text-xs outline-none focus:border-[#9E5A43]`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomMealToDay(dayObj.key)}
                            disabled={!(customMealInputs[dayObj.key] || '').trim()}
                            className={`px-2.5 py-1.5 rounded-lg ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1 transition disabled:opacity-40 shrink-0`}
                            title={`Add custom meal to ${dayObj.key} (no grocery items added)`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>

                        {dayMeals.length === 0 ? (
                          <div className={`py-1.5 text-center border border-dashed ${theme.border} rounded-lg text-[11px] ${theme.textMuted}`}>
                            Blank — Type a meal above, tap a recipe, or drag here
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {dayMeals.map(meal => {
                              const fullRec = meal.recipeId
                                ? COOKBOOK_RECIPES.find(r => r.id === meal.recipeId)
                                : null;
                              const isCustomMeal = meal.isManual || !fullRec;
                              const isEditingThis =
                                editingMeal &&
                                editingMeal.dayKey === dayObj.key &&
                                editingMeal.instanceId === meal.instanceId;

                              return (
                                <div
                                  key={meal.instanceId}
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (!isEditingThis && fullRec) setViewingRecipe(fullRec);
                                  }}
                                  className={`px-2.5 py-2 rounded-lg ${theme.cardBg} border ${theme.border} shadow-2xs flex items-center justify-between gap-2 group`}
                                >
                                  {isEditingThis ? (
                                    <div
                                      onClick={e => e.stopPropagation()}
                                      className="flex items-center gap-1.5 flex-1"
                                    >
                                      <input
                                        type="text"
                                        autoFocus
                                        value={editingMeal.title}
                                        onChange={e =>
                                          setEditingMeal(prev => ({
                                            ...prev,
                                            title: e.target.value
                                          }))
                                        }
                                        onKeyDown={e => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSaveEditedMeal(
                                              dayObj.key,
                                              meal.instanceId,
                                              editingMeal.title
                                            );
                                          } else if (e.key === 'Escape') {
                                            setEditingMeal(null);
                                          }
                                        }}
                                        className="flex-1 min-w-0 px-2 py-1 rounded-md border border-[#9E5A43] text-xs font-medium outline-none bg-[#FAF7F2]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSaveEditedMeal(
                                            dayObj.key,
                                            meal.instanceId,
                                            editingMeal.title
                                          )
                                        }
                                        className="px-2 py-1 rounded-md bg-[#9E5A43] text-white text-[10px] font-semibold hover:bg-[#864934] transition shrink-0"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingMeal(null)}
                                        className="px-1.5 py-1 rounded-md border border-[#E2D9CC] text-[10px] text-[#6E655F] hover:bg-stone-100 transition shrink-0"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="min-w-0 flex-1">
                                        <div
                                          className={`text-xs font-semibold truncate ${
                                            fullRec ? 'group-hover:underline' : ''
                                          }`}
                                        >
                                          {meal.title}
                                        </div>
                                        <div className={`text-[10px] ${theme.textSecondary}`}>
                                          {isCustomMeal
                                            ? 'Custom meal'
                                            : `${meal.category} • Tap for recipe`}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-0.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={e => {
                                            e.stopPropagation();
                                            setEditingMeal({
                                              dayKey: dayObj.key,
                                              instanceId: meal.instanceId,
                                              title: meal.title
                                            });
                                          }}
                                          className="p-1 rounded-md text-stone-400 hover:text-[#9E5A43] hover:bg-[#FAF3EA] transition"
                                          title="Edit meal"
                                          aria-label={`Edit ${meal.title} on ${dayObj.key}`}
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={e => {
                                            e.stopPropagation();
                                            handleRemoveMealFromDay(dayObj.key, meal.instanceId, meal.title);
                                          }}
                                          className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                                          title="Remove meal"
                                          aria-label={`Remove ${meal.title} from ${dayObj.key}`}
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =============================================================== */}
          {/* ROW 2, BOX 3: RUNNING GROCERY LIST                              */}
          {/* =============================================================== */}
          {(activeSection === 'all' || activeSection === 'grocery') && (
            <section
              aria-label="Running Grocery List"
              className={`${
                activeSection === 'grocery' ? 'lg:col-span-12 max-w-3xl mx-auto w-full' : 'lg:col-span-4'
              } ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
            >
              <CardHeaderSquiggle season={activeSeasonKey} />
              <div className="flex items-center justify-between gap-2 border-b pb-3.5 border-[#E2D9CC]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-editorial text-xl font-semibold leading-tight">
                        Running Grocery List
                      </h2>
                      <CutesyBadgeDoodle season={activeSeasonKey} variant={1} />
                    </div>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      {uncheckedGroceryCount} to buy • {checkedGroceryCount} checked off
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyGroceryList}
                    className={`p-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} transition`}
                    title="Copy grocery list for iPhone Notes / iMessage"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {checkedGroceryCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCheckedGrocery}
                      className={`px-2 py-1 rounded-xl border ${theme.border} text-[11px] ${theme.textSecondary} hover:text-stone-900`}
                      title="Remove checked items"
                    >
                      Clear Checked
                    </button>
                  )}
                  {groceryList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllGrocery}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 transition"
                      title="Clear all items"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Add Item Form */}
              <form onSubmit={handleManualAddGrocery} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={manualItemName}
                  onChange={e => setManualItemName(e.target.value)}
                  placeholder="Add item manually (e.g. Almond milk, berries)..."
                  className={`flex-1 min-w-0 px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs sm:text-sm outline-none focus:border-[#9E5A43]`}
                />
                <button
                  type="submit"
                  className={`px-3 py-2 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1 shrink-0 shadow-2xs`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between text-xs gap-1">
                <div className={`flex items-center gap-1 p-0.5 rounded-lg ${theme.cardSubtle} border ${theme.border}`}>
                  {[
                    { id: 'all', label: `All (${groceryList.length})` },
                    { id: 'unchecked', label: `Need (${uncheckedGroceryCount})` },
                    { id: 'checked', label: `Got (${checkedGroceryCount})` }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setGroceryFilter(f.id)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                        groceryFilter === f.id
                          ? `${theme.cardBg} ${theme.textPrimary} shadow-2xs`
                          : theme.textSecondary
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grocery Items Scrollable List */}
              <div className="flex flex-col gap-2 max-h-[550px] overflow-y-auto pr-1 scrollbar-minimal">
                {filteredGroceryList.length === 0 ? (
                  <div className={`p-6 rounded-xl ${theme.cardSubtle} border ${theme.border} text-center space-y-1.5`}>
                    <ShoppingBag className={`w-6 h-6 mx-auto ${theme.textMuted}`} />
                    <div className="font-editorial text-lg font-medium">
                      Your grocery list is empty
                    </div>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      Select any recipe from the cookbook to automatically populate its ingredients here, or type an item above.
                    </p>
                  </div>
                ) : (
                  filteredGroceryList.map(item => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                        item.checked
                          ? `${theme.bgPage} ${theme.border} opacity-60`
                          : `${theme.cardSubtle} ${theme.border}`
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleGroceryItem(item.id)}
                        className="flex items-start gap-2.5 text-left min-w-0 flex-1"
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                            item.checked
                              ? `${theme.accentBg} border-transparent text-white`
                              : `border-[#9C9084] bg-white`
                          }`}
                        >
                          {item.checked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-xs sm:text-sm font-medium leading-snug break-words ${
                              item.checked ? 'line-through text-stone-400' : ''
                            }`}
                          >
                            {item.name}
                          </div>
                          {item.sourceRecipeTitle && (
                            <div className={`text-[10px] ${theme.textSecondary} truncate mt-0.5`}>
                              {item.sourceRecipeTitle}
                              {item.sourceDay ? ` (${item.sourceDay.slice(0, 3)})` : ''}
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Remove Item Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteGroceryItem(item.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                        title="Remove item from grocery list"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        <SeasonalMotifRibbon season={activeSeasonKey} rowSeed={1} />

        {/* ================================================================= */}
        {/* ROW 2B: MACKIE'S PERSONAL HEALTH, FITNESS, POSTPARTUM TIMELINE,   */}
        {/*         SAVED WORKOUT ROUTINES, CYCLE & OURA RING TRACKER         */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'fitness') && (
          <>
            <PersonalHealthFitnessHub
              theme={theme}
              activeSeason={activeSeasonKey}
              healthFitness={boardData?.healthFitness}
              onUpdateHealthFitness={nextHf => {
                const nowTs = Date.now();
                setBoardData(prev => {
                  const next = {
                    ...prev,
                    healthFitness: nextHf
                  };
                  persistBoardToLocalStorage(
                    next,
                    undefined,
                    undefined,
                    nextHf?.updatedAtTs || nowTs
                  );
                  return next;
                });
              }}
              todayDayName={todayDayName}
              todayShortDateLabel={todayShortDateLabel}
              showToast={showToast}
            />
            <SeasonalMotifRibbon season={activeSeasonKey} rowSeed={4} />
          </>
        )}

        {/* ================================================================= */}
        {/* ROW 3: POSTPARTUM TRACKER, LIVE TREND GRAPH, AAP NEWBORN GUIDE    */}
        {/*        + HOVERING COZY TAN TEDDY BEAR AGENT ("TED", DESKTOP)      */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'baby') && (
          <div className="space-y-6">
            <PostpartumBabyHub
              theme={theme}
              activeSeason={activeSeasonKey}
              babyTracker={babyTracker}
              onUpdateBabyTracker={setBabyTracker}
              showToast={showToast}
              onOpenAussieAgent={() => setAussieAgentOpen(true)}
            />

            {/* Cozy Tan Teddy Bear ("Ted") Agent hovering around Newborn Section (Desktop Only, Hidden on iPhone) */}
            <AussieDogAgent
              theme={theme}
              isOpenExternal={aussieAgentOpen}
              onCloseExternal={() => setAussieAgentOpen(false)}
            />
          </div>
        )}

        <SeasonalMotifRibbon season={activeSeasonKey} rowSeed={2} />

        {/* ================================================================= */}
        {/* ROW 4: DAILY U.S. POLICY & TOP NEWS (07:00 AM EST AUTO-UPDATED)   */}
        {/*        + DOWNTOWN D.C. 5 W'S SEASONAL & WEEKLY RECOMMENDATIONS    */}
        {/* ================================================================= */}
        {(activeSection === 'all' || activeSection === 'news') && (
          <DailyNewsAndDcEvents
            theme={theme}
            activeSeason={activeSeasonKey}
            showToast={showToast}
            onCalendarUpdated={newCal =>
              setBoardData(prev => ({
                ...prev,
                calendar: newCal
              }))
            }
          />
        )}

        <SeasonalMotifRibbon season={activeSeasonKey} rowSeed={3} />
      </main>

      {/* =================================================================== */}
      {/* MODAL 1: FULL COOKBOOK RECIPE VIEWER                                */}
      {/* =================================================================== */}
      {viewingRecipe && (
        <div
          onClick={() => setViewingRecipe(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4`}
          >
            <div className="flex items-start justify-between gap-3 border-b pb-3.5 border-[#E2D9CC]">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#9E5A43] font-semibold uppercase tracking-wider">
                  <span>{viewingRecipe.category}</span>
                  <span>•</span>
                  <span>Cookbook Page {viewingRecipe.page}</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold mt-0.5">
                  {viewingRecipe.title}
                </h2>
                <div className={`text-xs ${theme.textSecondary} mt-0.5`}>
                  {viewingRecipe.author && <span>Recipe by {viewingRecipe.author}</span>}
                  {viewingRecipe.yield && <span> • Yield: {viewingRecipe.yield}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingRecipe(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewingRecipe.notes && (
              <div className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs sm:text-sm italic ${theme.textSecondary}`}>
                &ldquo;{viewingRecipe.notes}&rdquo;
              </div>
            )}

            {/* Quick Assign to Day Bar inside Modal */}
            <div className={`p-3 rounded-xl border ${theme.border} ${theme.bgPage} space-y-2`}>
              <div className="text-xs font-semibold">
                Place on Meal Plan &amp; Auto-Populate Grocery List:
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS_OF_WEEK.map(d => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => handleAssignRecipeToDay(viewingRecipe, d.key)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold ${theme.accentBg} ${theme.accentHover} text-white transition`}
                  >
                    + {d.short}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Ingredients Column */}
              <div className="space-y-2">
                <h3 className="font-editorial text-lg font-bold border-b pb-1 border-[#E2D9CC]">
                  Ingredients ({viewingRecipe.ingredients.length})
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  {viewingRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} mt-1.5 shrink-0`} />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Directions Column */}
              <div className="space-y-2">
                <h3 className="font-editorial text-lg font-bold border-b pb-1 border-[#E2D9CC]">
                  Directions
                </h3>
                <ol className="space-y-2.5 text-xs sm:text-sm">
                  {viewingRecipe.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-editorial font-bold text-base leading-none text-[#9E5A43] shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: COOKBOOK CONVERSIONS & SUBSTITUTIONS (PAGE 95)             */}
      {/* =================================================================== */}
      {showConversionsModal && (
        <div
          onClick={() => setShowConversionsModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 text-xs sm:text-sm`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E2D9CC]">
              <div>
                <h3 className="font-editorial text-2xl font-bold">
                  Cookbook Conversions &amp; Substitutions
                </h3>
                <p className={`text-xs ${theme.textSecondary}`}>
                  From Page 95 of M &amp; M&apos;s Family Favorites
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConversionsModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-3.5 rounded-xl ${theme.cardSubtle} space-y-1.5`}>
                <h4 className="font-bold">Spoons &amp; Cups</h4>
                <ul className="space-y-1 text-xs">
                  <li>3 tsp = 1 tbsp</li>
                  <li>6 tsp = 2 tbsp = 1/8 cup</li>
                  <li>12 tsp = 4 tbsp = 1/4 cup</li>
                  <li>16 tsp = 5 tbsp + 1 tsp = 1/3 cup</li>
                  <li>24 tsp = 8 tbsp = 1/2 cup</li>
                  <li>32 tsp = 10 tbsp + 2 tsp = 2/3 cup</li>
                  <li>36 tsp = 12 tbsp = 3/4 cup</li>
                  <li>48 tsp = 16 tbsp = 1 cup</li>
                </ul>
              </div>
              <div className={`p-3.5 rounded-xl ${theme.cardSubtle} space-y-1.5`}>
                <h4 className="font-bold">Liquid Equivalents</h4>
                <ul className="space-y-1 text-xs">
                  <li>1 cup = 8 ounces</li>
                  <li>1 pint = 2 cups = 16 ounces</li>
                  <li>1 quart = 4 cups = 32 ounces</li>
                  <li>1 gallon = 4 quarts = 128 ounces</li>
                </ul>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl ${theme.cardSubtle} space-y-2`}>
              <h4 className="font-bold">Cooking &amp; Baking Substitutions</h4>
              <ul className="space-y-1.5 text-xs">
                <li><strong>Buttermilk (1 cup):</strong> 1 tbsp lemon juice or vinegar plus enough milk to make 1 cup</li>
                <li><strong>Baking powder (1 tsp):</strong> 1/4 tsp baking soda + 1/2 tsp cream of tartar</li>
                <li><strong>Italian seasoning (2 tsp):</strong> 1 tsp dried oregano + 1/2 tsp dried basil + 1/2 tsp dried thyme</li>
                <li><strong>Pumpkin pie spice (1 tsp):</strong> 1/2 tsp cinnamon + 1/4 tsp ground nutmeg + 1/4 tsp ground ginger + 1/8 tsp ground cloves</li>
                <li><strong>Brown sugar (1 cup):</strong> 1 cup granulated sugar + 1 to 3 tbsp molasses</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: GOOGLE CALENDAR SYNC SETTINGS (amblair92@gmail.com)        */}
      {/* =================================================================== */}
      {showCalSettingsModal && (
        <div
          onClick={() => setShowCalSettingsModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-xs sm:text-sm`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E2D9CC]">
              <div>
                <h3 className="font-editorial text-2xl font-bold">
                  Sync Mackie&apos;s Google Calendar
                </h3>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Dedicated Account: <strong>amblair92@gmail.com</strong> (Isolated from Mike&apos;s accounts)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCalSettingsModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {calSaveStatus && (
              <div className={`p-3 rounded-xl ${theme.accentSoft} border text-xs font-medium`}>
                {calSaveStatus}
              </div>
            )}

            <div className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Option 1: Secret iCal Link (No Password Needed)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${theme.accentSoft}`}>
                  Recommended
                </span>
              </div>
              <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>
                Google Calendar provides a private read-only iCal URL that syncs her daily and weekly events 24/7 without ever needing her Google password:
              </p>
              <ol className={`list-decimal list-inside text-xs ${theme.textSecondary} space-y-1`}>
                <li>Open <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="underline font-medium">calendar.google.com</a> signed into <strong>amblair92@gmail.com</strong>.</li>
                <li>Click the 3 dots next to <strong>amblair92@gmail.com</strong> under &ldquo;My calendars&rdquo; &rarr; <strong>Settings and sharing</strong>.</li>
                <li>Scroll down to <strong>Integrate calendar</strong> and copy the <strong>&ldquo;Secret address in iCal format&rdquo;</strong>.</li>
              </ol>

              <form onSubmit={handleSaveCalConfig} className="space-y-2 pt-1">
                <input
                  type="url"
                  value={icalUrlInput}
                  onChange={e => setIcalUrlInput(e.target.value)}
                  placeholder="https://calendar.google.com/calendar/ical/amblair92%40gmail.com/private-.../basic.ics"
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardBg} border ${theme.border} text-xs font-mono outline-none`}
                />
                <button
                  type="submit"
                  className={`w-full py-2 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white font-semibold text-xs`}
                >
                  Save &amp; Sync Calendar Feed
                </button>
              </form>
            </div>

            <div className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-2`}>
              <div className="font-bold text-sm">Option 2: Google OAuth 2.0 Sign-In</div>
              <p className={`text-xs ${theme.textSecondary}`}>
                Sign in directly with Google for <strong>amblair92@gmail.com</strong> (credentials are stored in an isolated file separate from Mike&apos;s dashboard).
              </p>
              <button
                type="button"
                onClick={handleGoogleOAuthSignIn}
                className={`px-3.5 py-2 rounded-xl border ${theme.borderStrong} ${theme.cardBg} font-semibold text-xs hover:${theme.accentSoft}`}
              >
                Sign in with Google (amblair92@gmail.com)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 4: ADD CALENDAR EVENT                                         */}
      {/* =================================================================== */}
      {showAddEventModal && (
        <div
          onClick={() => setShowAddEventModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 text-xs sm:text-sm`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E2D9CC]">
              <h3 className="font-editorial text-2xl font-bold">Add Event to Schedule</h3>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Pediatrician Appt, Coffee with Friends"
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} outline-none`}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className={`w-full px-2.5 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Start</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    className={`w-full px-2.5 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">End</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className={`w-full px-2.5 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Optional"
                    className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border}`}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Family">Family</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Work">Work</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={newEvent.notes}
                  onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border}`}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className={`px-4 py-2 rounded-xl border ${theme.border}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl ${theme.accentBg} text-white font-semibold`}
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 5: IPHONE ACCESS & RIVERPOINT WIFI / ADP BYPASS HUB           */}
      {/* =================================================================== */}
      {showWifiModal && (
        <div
          onClick={() => setShowWifiModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-xs sm:text-sm`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E2D9CC]">
              <div className="flex items-center gap-2">
                <Wifi className={`w-5 h-5 ${theme.accentText}`} />
                <div>
                  <h3 className="font-editorial text-2xl font-bold">
                    iPhone &amp; Riverpoint WiFi (ADP Bypass)
                  </h3>
                  <p className={`text-xs ${theme.textSecondary}`}>
                    Works over Riverpoint WiFi, iCloud Private Relay / ADP &amp; 5G Cellular
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWifiModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-3`}>
              <div className="font-semibold text-sm flex items-center justify-between">
                <span>1. Permanent Published Website Link (24/7 Cloud — Never Terminates)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${theme.accentSoft}`}>
                  Always Online 24/7
                </span>
              </div>
              <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>
                Hosted permanently on Render Cloud alongside your husband&apos;s Executive Daily Briefing. Works 24/7 on desktop and iPhones over <strong>Riverpoint WiFi</strong>, <strong>iCloud Private Relay / ADP</strong>, and <strong>5G Cellular</strong> even if the home computer is off:
              </p>

              <div className="space-y-3">
                <div className={`p-3 rounded-xl ${theme.cardBg} border ${theme.borderStrong} flex items-center justify-between gap-2`}>
                  <a
                    href="https://daily-executive-dashboard.onrender.com/mackie/"
                    target="_blank"
                    rel="noreferrer"
                    className={`font-mono text-xs font-bold ${theme.accentText} underline break-all`}
                  >
                    https://daily-executive-dashboard.onrender.com/mackie/
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://daily-executive-dashboard.onrender.com/mackie/');
                      showToast('Copied permanent 24/7 website link!');
                    }}
                    className={`px-2.5 py-1 rounded-lg ${theme.accentBg} text-white text-xs font-semibold shrink-0`}
                  >
                    Copy Link
                  </button>
                </div>

                {/* Scannable QR Code for iPhone Camera */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#E2D9CC]">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      'https://daily-executive-dashboard.onrender.com/mackie/'
                    )}`}
                    alt="Scan with iPhone Camera to open Mackie's Daily Board"
                    className="w-28 h-28 rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-stone-900">Scan with Mackie&apos;s iPhone Camera (Permanent Link)</div>
                    <p className="text-stone-600 leading-relaxed">
                      1. Point her iPhone camera at this QR code to open the published website in Safari.<br />
                      2. Tap the <strong>Share</strong> icon at the bottom of Safari &rarr; <strong>Add to Home Screen</strong> for a permanent 1-tap app icon!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs space-y-1.5`}>
              <div className="font-semibold">2. Local 24/7 Background Service &amp; Tunnel Links:</div>
              {boardData?.meta?.tunnelUrl && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-600">Cloudflare Tunnel:</span>
                  <a
                    href={boardData.meta.tunnelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-mono font-semibold ${theme.accentText} underline truncate`}
                  >
                    {boardData.meta.tunnelUrl}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-600">Local Network Direct:</span>
                <span className="font-mono text-stone-700">{boardData?.meta?.lanUrl || 'http://192.168.4.21:3005'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 6: MACKIE'S DASHBOARD UPDATE SUGGESTIONS (FOR ANTIGRAVITY)    */}
      {/* =================================================================== */}
      {showSuggestionsModal && (
        <div
          onClick={() => setShowSuggestionsModal(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-xs sm:text-sm`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-5 py-4 border-[#E2D9CC]">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-2xl font-bold leading-none">
                      Mackie&apos;s Dashboard Update Suggestions
                    </h3>
                    <CutesyBadgeDoodle season={activeSeasonKey} variant={5} />
                  </div>
                  <p className={`text-xs ${theme.textSecondary} mt-1`}>
                    Mackie can leave update ideas here anytime • Mike can copy them into Antigravity &amp; delete once remedied
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSuggestionsModal(false)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200"
                aria-label="Close suggestions modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Form for Mackie to Add a New Suggestion */}
              <form
                onSubmit={handleAddSuggestion}
                className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} space-y-3`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-semibold text-xs sm:text-sm">
                    Add a New Dashboard Update Suggestion (for Mike &amp; Antigravity)
                  </label>
                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      'General',
                      'Calendar',
                      'Meals & Recipes',
                      'Grocery List',
                      'Health & Fitness',
                      'Baby & Ted',
                      'Seasonal Decor',
                      'D.C. & News'
                    ].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSuggestionCategory(cat)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition ${
                          suggestionCategory === cat
                            ? `${theme.accentBg} text-white border-transparent`
                            : `${theme.cardBg} ${theme.textSecondary} ${theme.border}`
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows="3"
                  value={suggestionInput}
                  onChange={e => setSuggestionInput(e.target.value)}
                  placeholder="Type your idea or update request here (e.g., 'Add a new recipe to Desserts', 'Change how the weekly meal box looks', 'Add a new baby milestone')..."
                  className={`w-full px-3.5 py-2.5 rounded-xl ${theme.cardBg} border ${theme.borderStrong} text-xs sm:text-sm focus:outline-none`}
                  required
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className={`text-[11px] ${theme.textSecondary}`}>
                    Saved to permanent history so Mike can grab it anytime
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingSuggestion || !suggestionInput.trim()}
                    className={`px-4 py-2 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs disabled:opacity-50`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isSubmittingSuggestion ? 'Saving...' : 'Save Update Suggestion'}</span>
                  </button>
                </div>
              </form>

              {/* Historical Suggestions List for Mike to Grab & Delete After Remedied */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                    <span>Historical Suggestion Queue ({suggestionsList.length})</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live iPhone ↔ PC Sync
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => syncSuggestionsEverywhere(true)}
                      disabled={isSyncingSuggestions}
                      className={`px-2.5 py-1.5 rounded-xl border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft} text-xs font-medium flex items-center gap-1.5 transition`}
                      title="Force immediate sync with Mackie's iPhone & Cloud"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSuggestions ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSuggestions ? 'Syncing...' : 'Sync from iPhone'}</span>
                    </button>
                    {suggestionsList.length > 0 && (
                      <button
                        type="button"
                        onClick={handleCopyAllSuggestionsForAntigravity}
                        className={`px-3 py-1.5 rounded-xl border ${theme.borderStrong} ${theme.cardSubtle} hover:${theme.accentSoft} text-xs font-semibold flex items-center gap-1.5 transition`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All ({suggestionsList.length}) for Antigravity</span>
                      </button>
                    )}
                  </div>
                </div>

                {suggestionsList.length === 0 ? (
                  <div className={`p-6 rounded-xl ${theme.cardSubtle} border ${theme.border} text-center space-y-1.5`}>
                    <MessageSquarePlus className={`w-6 h-6 mx-auto ${theme.textMuted}`} />
                    <div className="font-editorial text-lg font-medium">
                      No open update suggestions right now
                    </div>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      Whenever Mackie thinks of a tweak or feature she wants on her board, she can type it above and it will stay logged here until Mike remedies and deletes it!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {suggestionsList.map(sug => (
                      <div
                        key={sug.id}
                        className={`p-3.5 rounded-xl ${theme.cardSubtle} border ${theme.border} flex flex-col sm:flex-row sm:items-start justify-between gap-3`}
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${theme.accentSoft}`}>
                              {sug.category || 'General'}
                            </span>
                            <span className={`text-[11px] font-mono ${theme.textSecondary}`}>
                              {sug.formattedDate || 'Logged'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
                            {sug.text}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleCopySuggestionForAntigravity(sug)}
                            className={`px-2.5 py-1.5 rounded-lg border ${theme.borderStrong} ${theme.cardBg} hover:${theme.accentSoft} text-xs font-medium flex items-center gap-1 transition`}
                            title="Copy comment to paste into Antigravity"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy for Antigravity</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSuggestion(sug.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/70 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 transition"
                            title="Delete suggestion after remedying with Antigravity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remedied / Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
