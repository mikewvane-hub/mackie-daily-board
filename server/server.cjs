const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cron = require('node-cron');
const {
  TARGET_ACCOUNT,
  syncCalendar,
  getGoogleAuthUrl,
  handleTokenExchange,
  addCalendarEvent,
  deleteCalendarEvent,
  getNext7DaysKeys
} = require('./services/calendarSync.cjs');
const {
  getDailyNews,
  refreshDailyNews,
  getDcRecommendations
} = require('./services/newsAndEvents.cjs');
const { askNewbornMedicalAgent } = require('./services/babyMedicalAgent.cjs');
const { pullCloudState, pushCloudState } = require('./services/cloudStore.cjs');

const app = express();
const PORT = process.env.PORT || 3005;

const DIST_PATH = path.join(__dirname, '..', 'dist');
const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SCHEDULE_FILE = path.join(DATA_DIR, 'schedule.json');
const CAL_CONFIG_FILE = path.join(DATA_DIR, 'calendar_config.json');
const MEAL_PLAN_FILE = path.join(DATA_DIR, 'meal_plan.json');
const GROCERY_FILE = path.join(DATA_DIR, 'grocery_list.json');
const TUNNEL_FILE = path.join(DATA_DIR, 'tunnel_url.json');
const BABY_TRACKER_FILE = path.join(DATA_DIR, 'baby_tracker.json');
const SUGGESTIONS_FILE = path.join(DATA_DIR, 'suggestions.json');
const HEALTH_FITNESS_FILE = path.join(DATA_DIR, 'health_fitness.json');

app.use(cors());
app.use(express.json());

// Support both root (/api/...) and /mackie subpath (/mackie/api/...)
app.use((req, res, next) => {
  if (req.url === '/mackie') {
    return res.redirect(301, '/mackie/');
  }
  if (req.url.startsWith('/mackie/')) {
    req.url = req.url.slice('/mackie'.length) || '/';
  }
  next();
});

if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
}
if (fs.existsSync(PUBLIC_PATH)) {
  app.use(express.static(PUBLIC_PATH));
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const readJson = (file, fallback) => {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
  return fallback;
};

const writeJson = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    return false;
  }
};

function getEmptyMealPlan() {
  return {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };
}

function getLocalLanIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function getEstDateTime() {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);

  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  }).format(now);

  const month = parseInt(dateStr.split('-')[1], 10);
  let autoSeason = 'Autumn';
  if (month === 12 || month === 1 || month === 2) autoSeason = 'Winter';
  else if (month >= 3 && month <= 5) autoSeason = 'Spring';
  else if (month >= 6 && month <= 8) autoSeason = 'Summer';
  else autoSeason = 'Autumn';

  return { dateStr, timeStr, autoSeason };
}

function enrichScheduleEvents(scheduleData) {
  const { dateStr, timeStr } = getEstDateTime();
  const weekKeys = getNext7DaysKeys();
  const weekSchedule = scheduleData.weekSchedule || {};

  for (const k of weekKeys) {
    if (!Array.isArray(weekSchedule[k])) {
      weekSchedule[k] = [];
    }
  }

  if (Array.isArray(scheduleData.events)) {
    for (const evt of scheduleData.events) {
      const dKey = evt.date || dateStr;
      weekSchedule[dKey] = weekSchedule[dKey] || [];
      if (!weekSchedule[dKey].some(e => e.id === evt.id)) {
        weekSchedule[dKey].push(evt);
      }
    }
  }

  const todayRaw = weekSchedule[dateStr] || [];
  todayRaw.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const todayEvents = todayRaw.map(evt => {
    const isAllDay = evt.time === 'ALL DAY' || (evt.time && evt.time.toLowerCase().includes('all day'));
    let status = 'upcoming';
    if (isAllDay) {
      status = 'all_day';
    } else {
      const start = evt.time || '00:00';
      const end = evt.endTime || '';
      if (end) {
        if (timeStr >= end) status = 'completed';
        else if (timeStr >= start && timeStr < end) status = 'in_progress';
      } else if (timeStr >= start) {
        status = 'in_progress';
      }
    }
    return { ...evt, status };
  });

  return {
    todayDate: dateStr,
    currentTime: timeStr,
    todayEvents,
    weekSchedule,
    authorized: Boolean(scheduleData.authorized),
    lastSynced: scheduleData.lastSynced || null,
    account: TARGET_ACCOUNT,
    source: scheduleData.source || `Google Calendar (${TARGET_ACCOUNT})`
  };
}

// ============================================================================
// 1. Complete Board State Endpoint & Permanent Cloud State Sync
// ============================================================================
function countMealsInPlan(daysObj) {
  if (!daysObj || typeof daysObj !== 'object') return 0;
  return Object.values(daysObj).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );
}

function saveMealPlanAndSync(mealPlanData) {
  const nowTs = Date.now();
  mealPlanData.updatedAt = new Date(nowTs).toISOString();
  mealPlanData.updatedAtTs = nowTs;
  writeJson(MEAL_PLAN_FILE, mealPlanData);
  pushCloudState({
    mealPlan: mealPlanData.days || getEmptyMealPlan(),
    mealPlanUpdatedAt: nowTs
  }).catch(() => {});
  return nowTs;
}

function saveGroceryAndSync(groceryData) {
  const nowTs = Date.now();
  groceryData.updatedAt = new Date(nowTs).toISOString();
  groceryData.updatedAtTs = nowTs;
  writeJson(GROCERY_FILE, groceryData);
  pushCloudState({
    groceryList: groceryData.items || [],
    groceryUpdatedAt: nowTs
  }).catch(() => {});
  return nowTs;
}

function getDefaultHealthFitnessData() {
  return {
    customRoutines: [],
    weeklyWorkouts: getEmptyMealPlan(),
    deliveryDate: '2026-11-03',
    selectedPhaseId: null,
    cycleLogs: [],
    averageCycleLength: 28,
    periodDurationDays: 5,
    ouraToken: '',
    ouraConnected: false,
    ouraLastSynced: null,
    dailyLogs: [],
    updatedAt: null,
    updatedAtTs: 0
  };
}

function saveHealthFitnessAndSync(hfData) {
  const nowTs = Date.now();
  hfData.updatedAt = new Date(nowTs).toISOString();
  hfData.updatedAtTs = nowTs;
  writeJson(HEALTH_FITNESS_FILE, hfData);
  pushCloudState({
    healthFitness: hfData,
    healthFitnessUpdatedAt: nowTs
  }).catch(() => {});
  return nowTs;
}

async function hydrateBoardFromCloud(force = false) {
  try {
    const cloud = await pullCloudState(force);
    if (!cloud) return;

    // 1. Hydrate Meal Plan if cloud has newer state (or if local disk was wiped on Render spin-down)
    const localMp = readJson(MEAL_PLAN_FILE, { days: getEmptyMealPlan(), updatedAtTs: 0 });
    const localMpTs = Number(localMp.updatedAtTs) || 0;
    const cloudMpTs = Number(cloud.mealPlanUpdatedAt) || 0;
    if (cloud.mealPlan && (cloudMpTs > localMpTs || (localMpTs === 0 && countMealsInPlan(cloud.mealPlan) > 0))) {
      writeJson(MEAL_PLAN_FILE, {
        days: cloud.mealPlan,
        updatedAt: new Date(cloudMpTs || Date.now()).toISOString(),
        updatedAtTs: cloudMpTs || Date.now()
      });
    }

    // 2. Hydrate Grocery List if cloud has newer state (or if local disk was wiped on Render spin-down)
    const localGr = readJson(GROCERY_FILE, { items: [], updatedAtTs: 0 });
    const localGrTs = Number(localGr.updatedAtTs) || 0;
    const cloudGrTs = Number(cloud.groceryUpdatedAt) || 0;
    if (Array.isArray(cloud.groceryList) && (cloudGrTs > localGrTs || (localGrTs === 0 && cloud.groceryList.length > 0))) {
      writeJson(GROCERY_FILE, {
        items: cloud.groceryList,
        updatedAt: new Date(cloudGrTs || Date.now()).toISOString(),
        updatedAtTs: cloudGrTs || Date.now()
      });
    }

    // 3. Hydrate Baby Tracker if cloud has newer state
    const localBt = readJson(BABY_TRACKER_FILE, null);
    const localBtTs = Number(localBt?.updatedAtTs) || 0;
    const cloudBtTs = Number(cloud.babyTrackerUpdatedAt) || 0;
    if (cloud.babyTracker && cloudBtTs > localBtTs) {
      writeJson(BABY_TRACKER_FILE, {
        ...cloud.babyTracker,
        updatedAtTs: cloudBtTs
      });
    }

    // 4. Hydrate Suggestions by merging
    if (cloud.suggestions && typeof loadSuggestionsState === 'function') {
      const localSug = loadSuggestionsState();
      const mergedSug = mergeSuggestionsStates(localSug, cloud.suggestions);
      if (
        mergedSug.items.length !== localSug.items.length ||
        mergedSug.deletedIds.length !== localSug.deletedIds.length
      ) {
        saveSuggestionsStateToDisk(mergedSug, false);
      }
    }

    // 5. Hydrate Health & Fitness if cloud has newer state
    const localHf = readJson(HEALTH_FITNESS_FILE, getDefaultHealthFitnessData());
    const localHfTs = Number(localHf?.updatedAtTs) || 0;
    const cloudHfTs = Number(cloud.healthFitnessUpdatedAt) || 0;
    if (cloud.healthFitness && cloudHfTs > localHfTs) {
      writeJson(HEALTH_FITNESS_FILE, {
        ...getDefaultHealthFitnessData(),
        ...cloud.healthFitness,
        updatedAtTs: cloudHfTs
      });
    }
  } catch (err) {
    console.warn('[HydrateCloud] warning:', err.message);
  }
}

app.get('/api/board', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { dateStr, timeStr, autoSeason } = getEstDateTime();
  const scheduleData = readJson(SCHEDULE_FILE, { events: [], weekSchedule: {}, authorized: false });
  const calConfig = readJson(CAL_CONFIG_FILE, { icalUrl: '' });
  const mealPlanData = readJson(MEAL_PLAN_FILE, { days: getEmptyMealPlan(), updatedAt: null, updatedAtTs: 0 });
  const groceryData = readJson(GROCERY_FILE, { items: [], updatedAt: null, updatedAtTs: 0 });
  const healthFitnessData = readJson(HEALTH_FITNESS_FILE, getDefaultHealthFitnessData());
  const tunnelInfo = readJson(TUNNEL_FILE, { url: null });
  const suggestionsData = typeof loadSuggestionsState === 'function'
    ? loadSuggestionsState()
    : readJson(SUGGESTIONS_FILE, { items: [], deletedIds: [] });

  const lanIp = getLocalLanIp();

  res.json({
    meta: {
      title: "Mackie's Daily Board",
      owner: "Anne Mackenzie (Mackie)",
      account: TARGET_ACCOUNT,
      currentDateEST: dateStr,
      currentTimeEST: timeStr,
      autoSeason,
      lanUrl: `http://${lanIp}:${PORT}`,
      tunnelUrl: tunnelInfo.url || null,
      hasIcalConfigured: Boolean(calConfig.icalUrl),
      mealPlanUpdatedAt: Number(mealPlanData.updatedAtTs) || 0,
      groceryUpdatedAt: Number(groceryData.updatedAtTs) || 0,
      healthFitnessUpdatedAt: Number(healthFitnessData.updatedAtTs) || 0
    },
    calendar: enrichScheduleEvents(scheduleData),
    mealPlan: mealPlanData.days || getEmptyMealPlan(),
    groceryList: groceryData.items || [],
    healthFitness: healthFitnessData,
    suggestions: suggestionsData.items || []
  });
});

// Two-way client <-> server board state sync (restores iPhone localStorage if newer than server)
app.post('/api/board/sync', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const {
    mealPlan: incomingMealPlan,
    mealPlanUpdatedAt: incomingMpTs,
    groceryList: incomingGroceryList,
    groceryUpdatedAt: incomingGrTs,
    healthFitness: incomingHealthFitness,
    healthFitnessUpdatedAt: incomingHfTs
  } = req.body || {};

  let mealPlanData = readJson(MEAL_PLAN_FILE, { days: getEmptyMealPlan(), updatedAtTs: 0 });
  let groceryData = readJson(GROCERY_FILE, { items: [], updatedAtTs: 0 });
  let healthFitnessData = readJson(HEALTH_FITNESS_FILE, getDefaultHealthFitnessData());

  const curMpTs = Number(mealPlanData.updatedAtTs) || 0;
  const incMpTs = Number(incomingMpTs) || 0;
  if (
    incomingMealPlan &&
    typeof incomingMealPlan === 'object' &&
    (incMpTs > curMpTs || (curMpTs === 0 && countMealsInPlan(incomingMealPlan) > 0))
  ) {
    mealPlanData = {
      days: incomingMealPlan,
      updatedAt: new Date(incMpTs || Date.now()).toISOString(),
      updatedAtTs: incMpTs || Date.now()
    };
    writeJson(MEAL_PLAN_FILE, mealPlanData);
    pushCloudState({
      mealPlan: mealPlanData.days,
      mealPlanUpdatedAt: mealPlanData.updatedAtTs
    }).catch(() => {});
  }

  const curGrTs = Number(groceryData.updatedAtTs) || 0;
  const incGrTs = Number(incomingGrTs) || 0;
  if (
    Array.isArray(incomingGroceryList) &&
    (incGrTs > curGrTs || (curGrTs === 0 && incomingGroceryList.length > 0))
  ) {
    groceryData = {
      items: incomingGroceryList,
      updatedAt: new Date(incGrTs || Date.now()).toISOString(),
      updatedAtTs: incGrTs || Date.now()
    };
    writeJson(GROCERY_FILE, groceryData);
    pushCloudState({
      groceryList: groceryData.items,
      groceryUpdatedAt: groceryData.updatedAtTs
    }).catch(() => {});
  }

  const curHfTs = Number(healthFitnessData.updatedAtTs) || 0;
  const incHfTs = Number(incomingHfTs) || 0;
  if (incomingHealthFitness && typeof incomingHealthFitness === 'object' && incHfTs > curHfTs) {
    healthFitnessData = {
      ...getDefaultHealthFitnessData(),
      ...healthFitnessData,
      ...incomingHealthFitness,
      updatedAt: new Date(incHfTs || Date.now()).toISOString(),
      updatedAtTs: incHfTs || Date.now()
    };
    writeJson(HEALTH_FITNESS_FILE, healthFitnessData);
    pushCloudState({
      healthFitness: healthFitnessData,
      healthFitnessUpdatedAt: healthFitnessData.updatedAtTs
    }).catch(() => {});
  }

  res.json({
    success: true,
    mealPlan: mealPlanData.days || getEmptyMealPlan(),
    mealPlanUpdatedAt: Number(mealPlanData.updatedAtTs) || 0,
    groceryList: groceryData.items || [],
    groceryUpdatedAt: Number(groceryData.updatedAtTs) || 0,
    healthFitness: healthFitnessData,
    healthFitnessUpdatedAt: Number(healthFitnessData.updatedAtTs) || 0
  });
});

// ============================================================================
// Helper: Clean Recipe Ingredient String -> Pure Item Name (No Quantities)
// ============================================================================
function cleanGroceryItemName(raw) {
  let s = String(raw || '').trim();
  if (!s) return '';
  const lower = s.toLowerCase();

  if (/^you wish/i.test(s) || /maker's mark/i.test(lower)) return "Maker's Mark Bourbon & Pecans";
  if (/\beggs?\b/i.test(lower) && !/eggplant|noodle/i.test(lower)) return 'Eggs';
  if (/sweet potato/i.test(lower)) return 'Sweet potatoes';
  if (/russet potato/i.test(lower)) return 'Russet potatoes';
  if (/mashed potato/i.test(lower)) return 'Mashed potatoes';
  if (/olive oil/i.test(lower)) return 'Olive oil';
  if (/avocado oil/i.test(lower)) return 'Avocado oil';
  if (/coconut oil/i.test(lower)) return 'Coconut oil';
  if (/vegetable oil|canola|cooking oil/i.test(lower)) return 'Cooking oil';
  if (/cream cheese/i.test(lower)) {
    if (/chive/i.test(lower)) return 'Chive & onion cream cheese';
    return 'Cream cheese';
  }
  if (/cottage cheese/i.test(lower)) return 'Cottage cheese';
  if (/ricotta/i.test(lower)) return 'Ricotta cheese';
  if (/boursin|boursain/i.test(lower)) return 'Boursin garlic & herb cheese';
  if (/feta/i.test(lower)) return 'Feta cheese';
  if (/pecorino/i.test(lower)) return 'Pecorino Romano cheese';
  if (/parmesan|parm\b/i.test(lower)) return 'Parmesan cheese';
  if (/mozzarella pearls/i.test(lower)) return 'Fresh mozzarella pearls';
  if (/mozzarella|mozzerella/i.test(lower)) return 'Mozzarella cheese';
  if (/monterey jack|mjack/i.test(lower)) return 'Monterey Jack cheese';
  if (/pepper\s*jack/i.test(lower)) return 'Pepperjack cheese';
  if (/smoked gouda/i.test(lower)) return 'Smoked gouda cheese';
  if (/swiss cheese/i.test(lower)) return 'Swiss cheese';
  if (/provolone/i.test(lower)) return 'Provolone cheese';
  if (/american cheese/i.test(lower)) return 'American cheese slices';
  if (/laughing cow/i.test(lower)) return 'Laughing Cow cheese wedges';
  if (/cheddar/i.test(lower) && !/cheez|smokies|cracker/i.test(lower)) return 'Shredded cheddar cheese';
  if (/shredded cheese/i.test(lower)) return 'Shredded cheese';
  if (/sour cream/i.test(lower)) return 'Sour cream';
  if (/heavy whipping cream|heavy cream/i.test(lower)) return 'Heavy cream';
  if (/half\s*(&|and)\s*half/i.test(lower)) return 'Half and half';
  if (/buttermilk/i.test(lower)) return 'Buttermilk';
  if (/\bmilk\b/i.test(lower) && !/coconut|condensed/i.test(lower)) return 'Milk';
  if (/garlic and herb butter/i.test(lower)) return 'Garlic and herb butter';
  if (/butter\b/i.test(lower) && !/peanut|buttermilk|buttercream|buttery/i.test(lower)) return 'Butter';
  if (/peanut butter/i.test(lower)) return 'Peanut butter';
  if (/greek yogurt/i.test(lower)) return 'Plain Greek yogurt';
  if (/rotisserie chicken/i.test(lower)) return 'Rotisserie chicken';
  if (/just bare/i.test(lower)) return 'Just Bare chicken bites';
  if (/chicken thighs/i.test(lower)) return 'Boneless skinless chicken thighs';
  if (/chicken cutlets/i.test(lower)) return 'Chicken cutlets';
  if (/chicken breast|shredded chicken|diced.*chicken|chicken, cooked|cooked chicken/i.test(lower)) return 'Chicken breast';
  if (/chicken sausage/i.test(lower)) return 'Chicken sausage';
  if (/turkey breakfast sausage/i.test(lower)) return 'Turkey breakfast sausage';
  if (/breakfast sausage/i.test(lower)) return 'Breakfast sausage';
  if (/italian sausage/i.test(lower)) return 'Italian sausage';
  if (/ground beef/i.test(lower) && !/turkey/i.test(lower)) return 'Ground beef';
  if (/ground turkey/i.test(lower)) return 'Ground turkey, beef, or pork';
  if (/short ribs/i.test(lower)) return 'Bone-in beef short ribs';
  if (/chuck tender roast/i.test(lower)) return 'Beef chuck roast';
  if (/pulled pork/i.test(lower)) return 'Pulled pork';
  if (/lamb chops/i.test(lower)) return 'Bone-in lamb chops';
  if (/chorizo/i.test(lower)) return 'Chorizo';
  if (/meatballs/i.test(lower)) return 'Frozen meatballs';
  if (/smokies/i.test(lower)) return "Hillshire Farm Lit'l Smokies";
  if (/deli turkey/i.test(lower)) return 'Deli turkey';
  if (/deli ham|ham cubes/i.test(lower)) return 'Ham';
  if (/bacon bits/i.test(lower)) return 'Bacon bits';
  if (/bacon/i.test(lower)) return 'Bacon';
  if (/salmon/i.test(lower)) return 'Salmon fillets';
  if (/shrimp|scallops|seafood/i.test(lower)) return 'Shrimp & scallops';
  if (/cherry.*tomato|grape.*tomato|baby tomatoes/i.test(lower)) return 'Cherry tomatoes';
  if (/roma tomatoes/i.test(lower)) return 'Roma tomatoes';
  if (/rotel/i.test(lower)) return 'Rotel diced tomatoes & green chilies';
  if (/diced tomatoes with green chilies/i.test(lower)) return 'Diced tomatoes with green chilies';
  if (/diced tomatoes/i.test(lower)) return 'Diced tomatoes';
  if (/tomato paste/i.test(lower)) return 'Tomato paste';
  if (/tomato sauce/i.test(lower)) return 'Tomato sauce';
  if (/tomatoes/i.test(lower)) return 'Tomatoes';
  if (/green onion/i.test(lower)) return 'Green onion';
  if (/red onion/i.test(lower)) return 'Red onion';
  if (/minced dried onion|dry minced onion/i.test(lower)) return 'Dried minced onion';
  if (/\bonions?\b/i.test(lower) && !/powder|soup|chive/i.test(lower)) return 'Onion';
  if (/\bgarlic\b/i.test(lower) && !/powder|bread|salt|herb|boursin/i.test(lower)) return 'Garlic';
  if (/sweet peppers|bell pepper/i.test(lower)) return 'Bell peppers / sweet peppers';
  if (/poblano pepper/i.test(lower)) return 'Poblano pepper';
  if (/jalape/i.test(lower)) return 'Jalapeños';
  if (/banana peppers|pepperoncinis/i.test(lower)) return 'Banana peppers';
  if (/green chiles/i.test(lower)) return 'Diced green chiles';
  if (/chipotles? in adobo/i.test(lower)) return 'Chipotle peppers in adobo';
  if (/avocado/i.test(lower) && !/mayo|oil/i.test(lower)) return 'Avocado';
  if (/spinach/i.test(lower) && !/dip|sausage/i.test(lower)) return 'Spinach';
  if (/kale/i.test(lower)) return 'Fresh kale';
  if (/broccoli/i.test(lower)) return 'Broccoli florets';
  if (/asparagus/i.test(lower)) return 'Asparagus';
  if (/zucchini/i.test(lower)) return 'Zucchini';
  if (/mushrooms/i.test(lower)) return 'Mushrooms';
  if (/carrots/i.test(lower) && !/corn|ruffles/i.test(lower)) return 'Carrots';
  if (/celery/i.test(lower)) return 'Celery';
  if (/frozen mixed vegetables|veggies \(corn/i.test(lower)) return 'Frozen mixed vegetables';
  if (/\bcorn\b/i.test(lower) && !/tortilla/i.test(lower)) return 'Corn';
  if (/cilantro/i.test(lower)) return 'Fresh cilantro';
  if (/parsley/i.test(lower)) return 'Parsley';
  if (/fresh basil/i.test(lower)) return 'Fresh basil';
  if (/fresh rosemary/i.test(lower)) return 'Fresh rosemary';
  if (/fresh thyme/i.test(lower)) return 'Fresh thyme';
  if (/fresh oregano/i.test(lower)) return 'Fresh oregano';
  if (/limes?\b/i.test(lower) && !/mayo|mojito/i.test(lower)) return 'Limes';
  if (/lemons?\b/i.test(lower) && !/pepper/i.test(lower)) return 'Lemons';
  if (/bananas/i.test(lower)) return 'Ripe bananas';
  if (/medjool dates|pitted dates/i.test(lower)) return 'Medjool dates';
  if (/pumpkin puree/i.test(lower)) return 'Pumpkin puree';
  if (/chicken broth|chicken stock/i.test(lower)) return 'Chicken broth';
  if (/beef stock|beef consomme/i.test(lower)) return 'Beef broth / stock';
  if (/bone broth/i.test(lower)) return 'Bone broth';
  if (/marinara|spaghetti sauce/i.test(lower)) return "Rao's marinara / spaghetti sauce";
  if (/alfredo sauce/i.test(lower)) return "Rao's Alfredo sauce";
  if (/pesto/i.test(lower)) return 'Pesto';
  if (/salsa verde/i.test(lower)) return 'Salsa Verde';
  if (/sweet chili sauce/i.test(lower)) return 'Sweet chili sauce';
  if (/bbq sauce|sweet baby ray/i.test(lower)) return 'BBQ sauce';
  if (/franks hot|buffalo wing sauce/i.test(lower)) return 'Buffalo wing sauce';
  if (/sriracha/i.test(lower)) return 'Sriracha';
  if (/soy sauce/i.test(lower)) return 'Soy sauce';
  if (/ranch dip mix|ranch dressing powder|ranch seasoning/i.test(lower)) return 'Ranch seasoning packet';
  if (/ranch\b/i.test(lower)) return 'Ranch dressing';
  if (/taco seasoning/i.test(lower)) return 'Taco seasoning';
  if (/chili magic/i.test(lower)) return 'Chili Magic (canned)';
  if (/cream of chicken/i.test(lower)) return 'Cream of chicken soup';
  if (/onion soup mix/i.test(lower)) return 'Lipton onion soup mix';
  if (/au jus/i.test(lower)) return 'Au Jus gravy mix';
  if (/spinach artichoke dip/i.test(lower)) return 'Spinach artichoke dip';
  if (/chipotle.*mayo/i.test(lower)) return 'Chipotle mayo';
  if (/mayonnaise|mayo\b/i.test(lower)) return 'Mayonnaise';
  if (/honey mustard/i.test(lower)) return 'Honey mustard';
  if (/grape jelly/i.test(lower)) return 'Grape jelly';
  if (/honey\b/i.test(lower)) return 'Honey';
  if (/maple syrup/i.test(lower)) return 'Maple syrup';
  if (/sourdough bread/i.test(lower)) return 'Sourdough bread';
  if (/ciabatta/i.test(lower)) return 'Ciabatta bread';
  if (/hawaiian.*rolls/i.test(lower)) return 'Hawaiian sweet rolls';
  if (/dinner rolls/i.test(lower)) return 'Dinner rolls';
  if (/hoagie buns/i.test(lower)) return 'Hoagie buns';
  if (/texas toast/i.test(lower)) return 'Texas toast';
  if (/garlic bread/i.test(lower)) return 'Garlic bread';
  if (/pie crusts?/i.test(lower)) return 'Pie crust';
  if (/cinnamon rolls/i.test(lower)) return 'Pillsbury cinnamon rolls';
  if (/pie filling/i.test(lower)) return 'Pie filling';
  if (/corn tortillas/i.test(lower)) return 'Corn tortillas';
  if (/tortillas/i.test(lower)) return 'Flour tortillas';
  if (/tortilla chips|tortilla strips/i.test(lower)) return 'Tortilla chips';
  if (/oyster crackers/i.test(lower)) return 'Oyster crackers';
  if (/cheez-its/i.test(lower)) return 'Cheddar Jack Cheez-Its';
  if (/doritos or ritz/i.test(lower)) return 'Ritz crackers or Doritos';
  if (/ruffles/i.test(lower)) return 'Ruffles potato chips';
  if (/panko/i.test(lower)) return 'Panko breadcrumbs';
  if (/bread crumbs/i.test(lower)) return 'Breadcrumbs';
  if (/rigatoni or penne|ziti or penne|rigatoni pasta/i.test(lower)) return 'Rigatoni or penne pasta';
  if (/spaghetti/i.test(lower)) return 'Spaghetti noodles';
  if (/lasagna noodles/i.test(lower)) return 'Oven-ready lasagna noodles';
  if (/tortellini/i.test(lower)) return 'Tortellini';
  if (/pasta shells/i.test(lower)) return 'Pasta shells';
  if (/orzo/i.test(lower)) return 'Orzo pasta';
  if (/bob evans mac/i.test(lower)) return 'Bob Evans refrigerated Mac & Cheese';
  if (/mac n cheese/i.test(lower)) return 'Boxed Mac & Cheese';
  if (/brown rice/i.test(lower)) return 'Brown rice';
  if (/\brice\b/i.test(lower)) return 'Rice';
  if (/oat flour/i.test(lower)) return 'Oat flour';
  if (/rolled oats|old fashioned oats/i.test(lower)) return 'Old fashioned rolled oats';
  if (/cake flour/i.test(lower)) return 'Cake flour';
  if (/\bflour\b/i.test(lower)) return 'All-purpose flour';
  if (/powdered sugar/i.test(lower)) return 'Powdered sugar';
  if (/brown sugar/i.test(lower)) return 'Brown sugar';
  if (/granulated sugar|\bsugar\b/i.test(lower)) return 'Sugar';
  if (/stevia/i.test(lower)) return 'Stevia';
  if (/cocoa|cacao/i.test(lower)) return 'Cocoa / cacao powder';
  if (/chocolate chips/i.test(lower)) return 'Chocolate chips';
  if (/shredded coconut/i.test(lower)) return 'Shredded coconut';
  if (/vanilla/i.test(lower)) return 'Vanilla extract';
  if (/yeast/i.test(lower)) return 'Active dry yeast';
  if (/espresso powder/i.test(lower)) return 'Instant espresso powder';
  if (/brewed coffee/i.test(lower)) return 'Coffee';
  if (/chai\b/i.test(lower) && /tea/i.test(lower)) return 'Chai tea bags';
  if (/desired beans/i.test(lower)) return 'Canned beans';
  if (/chopped peanuts/i.test(lower)) return 'Peanuts';
  if (/chopped walnuts/i.test(lower)) return 'Walnuts';
  if (/pumpkin seeds/i.test(lower)) return 'Roasted pumpkin seeds';
  if (/baking powder/i.test(lower) && /baking soda/i.test(lower)) return 'Baking powder & baking soda';
  if (/baking soda/i.test(lower)) return 'Baking soda';
  if (/baking powder/i.test(lower)) return 'Baking powder';
  if (/sea salt/i.test(lower)) return 'Sea salt';
  if (/^1\/2 tsp salt/i.test(lower)) return 'Salt & pepper';

  s = s.replace(/^[~*•\-\d\s\/½¼¾.,+()]+/, '');
  s = s.replace(/^(cups?|c|tbsp|tbls|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|ml|pkg|pkgs|packages?|jars?|cans?|bottles?|bags?|boxes|box|sticks?|containers?|cartons?|bunch|handfuls?|cloves?|slices?|pieces?|blocks?|racks?|bundles?|pinch|splash|large|medium|small|of)\b\s*/i, '');
  s = s.replace(/^(cups?|c|tbsp|tbls|tablespoons?|tsp|teaspoons?|oz|ounces?|lbs?|pounds?|of)\b\s*/i, '');
  s = s.replace(/\s*\([^)]*\)/g, '');
  s = s.replace(/,\s*(diced|minced|chopped|halved|sliced|softened|melted|cooked|shredded|crumbled|beaten|peeled|seeded|to taste|for serving|for garnish|optional).*$/i, '');
  s = s.trim();
  if (!s) return raw;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ============================================================================
// 2. Meal Plan Endpoints (Assign Recipe -> Auto-Populates Grocery List Once!)
// ============================================================================
app.post('/api/meal-plan/assign', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { day, recipe, slot, isManual, customTitle } = req.body;
  if (!day || !DAYS_OF_WEEK.includes(day)) {
    return res.status(400).json({ error: 'Valid day (Monday-Sunday) is required' });
  }

  const mealPlanData = readJson(MEAL_PLAN_FILE, { days: getEmptyMealPlan() });
  mealPlanData.days = mealPlanData.days || getEmptyMealPlan();
  mealPlanData.days[day] = mealPlanData.days[day] || [];

  const instanceId = `meal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Handle manually typed custom meal (not tied to grocery list)
  if (isManual || customTitle || (recipe && recipe.isManual)) {
    const manualTitle = String(customTitle || recipe?.title || '').trim();
    if (!manualTitle) {
      return res.status(400).json({ error: 'Meal name is required' });
    }
    const mealEntry = {
      instanceId,
      recipeId: null,
      title: manualTitle,
      category: 'Custom Meal',
      isManual: true,
      slot: slot || 'Custom',
      addedAt: new Date().toISOString()
    };
    mealPlanData.days[day].push(mealEntry);
    const mpTs = saveMealPlanAndSync(mealPlanData);

    const groceryData = readJson(GROCERY_FILE, { items: [] });
    return res.json({
      success: true,
      mealPlan: mealPlanData.days,
      mealPlanUpdatedAt: mpTs,
      groceryList: groceryData.items || [],
      addedIngredientsCount: 0
    });
  }

  if (!recipe) {
    return res.status(400).json({ error: 'Valid recipe is required' });
  }

  const mealEntry = {
    instanceId,
    recipeId: recipe.id,
    title: recipe.title,
    category: recipe.category,
    page: recipe.page,
    isManual: false,
    slot: slot || recipe.category || 'Meal',
    addedAt: new Date().toISOString()
  };

  mealPlanData.days[day].push(mealEntry);
  const mpTs = saveMealPlanAndSync(mealPlanData);

  // Automatically populate unique, quantity-free items onto the running grocery list
  const groceryData = readJson(GROCERY_FILE, { items: [] });
  groceryData.items = groceryData.items || [];

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  let addedCount = 0;

  ingredients.forEach((rawIng, idx) => {
    const cleanName = cleanGroceryItemName(rawIng);
    if (!cleanName) return;

    // Only add if this item is NOT already on the grocery list
    const existingItem = groceryData.items.find(
      item => item.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingItem) {
      if (existingItem.sourceRecipeTitle && !existingItem.sourceRecipeTitle.includes(recipe.title)) {
        existingItem.sourceRecipeTitle = `${existingItem.sourceRecipeTitle}, ${recipe.title}`;
      }
      existingItem.sourceInstanceIds = existingItem.sourceInstanceIds || [];
      if (!existingItem.sourceInstanceIds.includes(instanceId)) {
        existingItem.sourceInstanceIds.push(instanceId);
      }
    } else {
      groceryData.items.push({
        id: `groc-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        name: cleanName,
        checked: false,
        sourceRecipeTitle: recipe.title,
        sourceDay: day,
        sourceInstanceIds: [instanceId],
        isManual: false,
        createdAt: new Date().toISOString()
      });
      addedCount++;
    }
  });

  const grTs = saveGroceryAndSync(groceryData);

  res.json({
    success: true,
    mealPlan: mealPlanData.days,
    mealPlanUpdatedAt: mpTs,
    groceryList: groceryData.items,
    groceryUpdatedAt: grTs,
    addedIngredientsCount: addedCount
  });
});

app.delete('/api/meal-plan/:day/:instanceId', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { day, instanceId } = req.params;
  const removeIngredients = req.query.removeIngredients === 'true';

  const mealPlanData = readJson(MEAL_PLAN_FILE, { days: getEmptyMealPlan() });
  let mpTs = Number(mealPlanData.updatedAtTs) || Date.now();
  if (mealPlanData.days && Array.isArray(mealPlanData.days[day])) {
    mealPlanData.days[day] = mealPlanData.days[day].filter(m => m.instanceId !== instanceId);
    mpTs = saveMealPlanAndSync(mealPlanData);
  }

  const groceryData = readJson(GROCERY_FILE, { items: [] });
  let grTs = Number(groceryData.updatedAtTs) || Date.now();
  if (removeIngredients && Array.isArray(groceryData.items)) {
    groceryData.items = groceryData.items.filter(item => {
      if (Array.isArray(item.sourceInstanceIds) && item.sourceInstanceIds.includes(instanceId)) {
        if (item.sourceInstanceIds.length > 1) {
          item.sourceInstanceIds = item.sourceInstanceIds.filter(id => id !== instanceId);
          return true;
        }
        return false;
      }
      return true;
    });
    grTs = saveGroceryAndSync(groceryData);
  }

  res.json({
    success: true,
    mealPlan: mealPlanData.days,
    mealPlanUpdatedAt: mpTs,
    groceryList: groceryData.items,
    groceryUpdatedAt: grTs
  });
});

app.put('/api/meal-plan/:day/:instanceId', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { day, instanceId } = req.params;
  const { title, recipeId, category } = req.body || {};
  const cleanTitle = String(title || '').trim();
  if (!cleanTitle) {
    return res.status(400).json({ error: 'Meal title is required' });
  }

  const mealPlanData = readJson(MEAL_PLAN_FILE, { days: getEmptyMealPlan() });
  mealPlanData.days = mealPlanData.days || getEmptyMealPlan();
  let mpTs = Number(mealPlanData.updatedAtTs) || Date.now();
  if (Array.isArray(mealPlanData.days[day])) {
    const target = mealPlanData.days[day].find(m => m.instanceId === instanceId);
    if (target) {
      target.title = cleanTitle;
      if (recipeId !== undefined) target.recipeId = recipeId;
      if (category !== undefined) target.category = category;
      if (!recipeId) target.isManual = true;
      target.updatedAt = new Date().toISOString();
      mpTs = saveMealPlanAndSync(mealPlanData);
    }
  }

  res.json({
    success: true,
    mealPlan: mealPlanData.days,
    mealPlanUpdatedAt: mpTs
  });
});

app.post('/api/meal-plan/clear', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const empty = getEmptyMealPlan();
  const mpTs = saveMealPlanAndSync({ days: empty });
  res.json({ success: true, mealPlan: empty, mealPlanUpdatedAt: mpTs });
});

// ============================================================================
// 3. Running Grocery List Endpoints (Manual Add, Subtract, Check, Clear)
// ============================================================================
app.post('/api/grocery/add', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { name, note } = req.body;
  const cleanName = String(name || '').trim();
  if (!cleanName) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  const groceryData = readJson(GROCERY_FILE, { items: [] });
  groceryData.items = groceryData.items || [];

  const existing = groceryData.items.find(
    i => i.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (existing) {
    existing.checked = false;
  } else {
    groceryData.items.unshift({
      id: `groc-manual-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: cleanName,
      checked: false,
      sourceRecipeTitle: note || 'Manual Addition',
      isManual: true,
      createdAt: new Date().toISOString()
    });
  }

  const grTs = saveGroceryAndSync(groceryData);
  res.json({ success: true, groceryList: groceryData.items, groceryUpdatedAt: grTs });
});

app.post('/api/grocery/add-recipe-ingredients', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { recipe } = req.body;
  if (!recipe || !Array.isArray(recipe.ingredients)) {
    return res.status(400).json({ error: 'Valid recipe with ingredients required' });
  }

  const groceryData = readJson(GROCERY_FILE, { items: [] });
  groceryData.items = groceryData.items || [];

  recipe.ingredients.forEach((rawIng, idx) => {
    const cleanName = cleanGroceryItemName(rawIng);
    if (!cleanName) return;

    const existing = groceryData.items.find(
      i => i.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (existing) {
      if (existing.sourceRecipeTitle && !existing.sourceRecipeTitle.includes(recipe.title)) {
        existing.sourceRecipeTitle = `${existing.sourceRecipeTitle}, ${recipe.title}`;
      }
    } else {
      groceryData.items.push({
        id: `groc-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        name: cleanName,
        checked: false,
        sourceRecipeTitle: recipe.title,
        isManual: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  const grTs = saveGroceryAndSync(groceryData);
  res.json({ success: true, groceryList: groceryData.items, groceryUpdatedAt: grTs });
});

app.post('/api/grocery/:id/toggle', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const groceryData = readJson(GROCERY_FILE, { items: [] });
  const item = (groceryData.items || []).find(i => i.id === req.params.id);
  let grTs = Number(groceryData.updatedAtTs) || Date.now();
  if (item) {
    item.checked = !item.checked;
    grTs = saveGroceryAndSync(groceryData);
  }
  res.json({ success: true, groceryList: groceryData.items || [], groceryUpdatedAt: grTs });
});

app.delete('/api/grocery/:id', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const groceryData = readJson(GROCERY_FILE, { items: [] });
  groceryData.items = (groceryData.items || []).filter(i => i.id !== req.params.id);
  const grTs = saveGroceryAndSync(groceryData);
  res.json({ success: true, groceryList: groceryData.items, groceryUpdatedAt: grTs });
});

app.post('/api/grocery/clear-checked', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const groceryData = readJson(GROCERY_FILE, { items: [] });
  groceryData.items = (groceryData.items || []).filter(i => !i.checked);
  const grTs = saveGroceryAndSync(groceryData);
  res.json({ success: true, groceryList: groceryData.items, groceryUpdatedAt: grTs });
});

app.post('/api/grocery/clear-all', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const grTs = saveGroceryAndSync({ items: [] });
  res.json({ success: true, groceryList: [], groceryUpdatedAt: grTs });
});

// ============================================================================
// 4. Google Calendar Sync & OAuth Endpoints (amblair92@gmail.com)
// ============================================================================
app.post('/api/calendar/sync', async (req, res) => {
  try {
    const synced = await syncCalendar();
    res.json({
      success: true,
      calendar: enrichScheduleEvents(synced)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/calendar/config', (req, res) => {
  const config = readJson(CAL_CONFIG_FILE, { icalUrl: '', account: TARGET_ACCOUNT });
  res.json(config);
});

app.post('/api/calendar/config', async (req, res) => {
  const { icalUrl } = req.body;
  const config = {
    icalUrl: String(icalUrl || '').trim(),
    account: TARGET_ACCOUNT,
    updatedAt: new Date().toISOString()
  };
  writeJson(CAL_CONFIG_FILE, config);

  try {
    const synced = await syncCalendar();
    res.json({
      success: true,
      config,
      calendar: enrichScheduleEvents(synced)
    });
  } catch (err) {
    res.status(400).json({ error: `Could not sync iCal URL: ${err.message}` });
  }
});

app.post('/api/calendar/event', async (req, res) => {
  try {
    const result = await addCalendarEvent(req.body);
    const scheduleData = readJson(SCHEDULE_FILE, { events: [], weekSchedule: {} });
    res.json({
      success: true,
      event: result.event,
      googleSynced: result.googleSynced,
      calendar: enrichScheduleEvents(scheduleData)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/calendar/event/:id', (req, res) => {
  deleteCalendarEvent(req.params.id);
  const scheduleData = readJson(SCHEDULE_FILE, { events: [], weekSchedule: {} });
  res.json({
    success: true,
    calendar: enrichScheduleEvents(scheduleData)
  });
});

app.get('/api/auth/google/url', (req, res) => {
  const authUrl = getGoogleAuthUrl();
  if (!authUrl) {
    return res.status(400).json({ error: 'OAuth client keys not configured. Please use the Secret iCal URL option.' });
  }
  res.json({ authUrl });
});

app.get('/oauth2callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) {
    return res.status(400).send(`<h2>Google Authorization Cancelled</h2><p>${error}</p>`);
  }
  if (!code) {
    return res.status(400).send('<h2>Missing authorization code</h2>');
  }
  try {
    await handleTokenExchange(code);
    await syncCalendar();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(`<h2>Authorization Error</h2><p>${err.message}</p>`);
  }
});

// ============================================================================
// 5. Postpartum & Newborn Tracker (Aiden James Vane — Due Nov 3)
// ============================================================================
function getPastDateKeysEST(daysCount = 7) {
  const keys = [];
  const now = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const k = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
    keys.push(k);
  }
  return keys;
}

function getDefaultBabyTrackerData() {
  const past7 = getPastDateKeysEST(7);
  const sampleDaily = {};
  const sampleFeeds = [];

  // Pre-seed a realistic 7-day curve so the live visual graph is immediately interactive & clear
  const sampleWeights = [7.4, 7.3, 7.25, 7.3, 7.4, 7.5, 7.6];
  const sampleWet = [5, 6, 7, 7, 8, 8, 7];
  const sampleDirty = [2, 3, 3, 4, 4, 3, 4];
  const sampleSleep = [15.5, 16.0, 14.5, 15.0, 16.0, 15.5, 16.0];
  const sampleFeedCounts = [8, 9, 10, 9, 10, 9, 8];
  const sampleAvgMins = [22, 20, 24, 21, 23, 22, 24];

  past7.forEach((dateKey, idx) => {
    sampleDaily[dateKey] = {
      date: dateKey,
      wetDiapers: sampleWet[idx],
      dirtyDiapers: sampleDirty[idx],
      totalDiapers: sampleWet[idx] + sampleDirty[idx],
      weightLbs: sampleWeights[idx],
      sleepHours: sampleSleep[idx]
    };

    const count = sampleFeedCounts[idx];
    const avgMin = sampleAvgMins[idx];
    const sides = ['Left Breast', 'Right Breast', 'Both'];
    for (let f = 0; f < count; f++) {
      const hr = String((f * 3 + 1) % 24).padStart(2, '0');
      sampleFeeds.push({
        id: `feed-seed-${dateKey}-${f}`,
        date: dateKey,
        time: `${hr}:15`,
        side: sides[f % sides.length],
        durationMinutes: avgMin + (f % 2 === 0 ? 2 : -2),
        notes: idx === 6 && f === count - 1 ? 'Strong latch, nursed well' : '',
        createdAt: new Date().toISOString()
      });
    }
  });

  return {
    babyName: 'Aiden James Vane',
    dueDate: '2026-11-03',
    feedingGoalPerDay: 8,
    feedingDurationGoalMinutes: 140,
    diaperGoalPerDay: 8,
    sleepGoalHours: 15,
    dailyMetrics: sampleDaily,
    feedingSessions: sampleFeeds,
    completedVaccines: ['hepb-birth'],
    updatedAt: new Date().toISOString()
  };
}

function getBabyTrackerState() {
  let state = readJson(BABY_TRACKER_FILE, null);
  if (!state || !state.dailyMetrics) {
    state = getDefaultBabyTrackerData();
    writeJson(BABY_TRACKER_FILE, state);
  }

  const past7Keys = getPastDateKeysEST(7);
  state.dailyMetrics = state.dailyMetrics || {};
  state.feedingSessions = Array.isArray(state.feedingSessions) ? state.feedingSessions : [];
  state.completedVaccines = Array.isArray(state.completedVaccines) ? state.completedVaccines : [];

  // Ensure every day in the last 7 days has a computed summary point for the visual trend graph
  const graphSeries = past7Keys.map(dateKey => {
    const dayEntry = state.dailyMetrics[dateKey] || {
      date: dateKey,
      wetDiapers: 0,
      dirtyDiapers: 0,
      totalDiapers: 0,
      weightLbs: 0,
      sleepHours: 0
    };

    const dayFeeds = state.feedingSessions.filter(f => f.date === dateKey);
    const feedingFrequency = dayFeeds.length;
    const feedingDurationMinutes = dayFeeds.reduce(
      (sum, f) => sum + (Number(f.durationMinutes) || 0),
      0
    );
    const avgFeedDuration =
      feedingFrequency > 0 ? Math.round(feedingDurationMinutes / feedingFrequency) : 0;

    const wet = Number(dayEntry.wetDiapers) || 0;
    const dirty = Number(dayEntry.dirtyDiapers) || 0;
    const totalDiapers =
      dayEntry.totalDiapers !== undefined
        ? Number(dayEntry.totalDiapers)
        : wet + dirty;

    const dObj = new Date(dateKey + 'T12:00:00');
    const shortLabel = dObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric'
    });

    return {
      date: dateKey,
      shortLabel,
      feedingFrequency,
      feedingDurationMinutes,
      avgFeedDuration,
      wetDiapers: wet,
      dirtyDiapers: dirty,
      totalDiapers,
      weightLbs: Number(dayEntry.weightLbs) || 0,
      sleepHours: Number(dayEntry.sleepHours) || 0
    };
  });

  return {
    ...state,
    graphSeries
  };
}

function saveBabyTrackerAndSync(state) {
  const nowTs = Date.now();
  state.updatedAt = new Date(nowTs).toISOString();
  state.updatedAtTs = nowTs;
  writeJson(BABY_TRACKER_FILE, state);
  pushCloudState({
    babyTracker: state,
    babyTrackerUpdatedAt: nowTs
  }).catch(() => {});
}

app.get('/api/baby-tracker', async (req, res) => {
  await hydrateBoardFromCloud(false);
  res.json(getBabyTrackerState());
});

// Add a breastfeeding / feeding session
app.post('/api/baby-tracker/feeding', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { date, time, side, durationMinutes, notes } = req.body;
  const { dateStr, timeStr } = getEstDateTime();
  const targetDate = date || dateStr;
  const dur = Math.max(1, Number(durationMinutes) || 15);

  const state = readJson(BABY_TRACKER_FILE, getDefaultBabyTrackerData());
  state.feedingSessions = Array.isArray(state.feedingSessions) ? state.feedingSessions : [];

  const newSession = {
    id: `feed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: targetDate,
    time: time || timeStr,
    side: side || 'Left Breast',
    durationMinutes: dur,
    notes: String(notes || '').trim(),
    createdAt: new Date().toISOString()
  };

  state.feedingSessions.unshift(newSession);
  saveBabyTrackerAndSync(state);

  res.json(getBabyTrackerState());
});

// Update an existing feeding session
app.put('/api/baby-tracker/feeding/:id', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { id } = req.params;
  const { side, durationMinutes, time, date, notes } = req.body;
  const state = readJson(BABY_TRACKER_FILE, getDefaultBabyTrackerData());
  state.feedingSessions = Array.isArray(state.feedingSessions) ? state.feedingSessions : [];

  const idx = state.feedingSessions.findIndex(f => f.id === id);
  if (idx !== -1) {
    if (side !== undefined) state.feedingSessions[idx].side = side;
    if (durationMinutes !== undefined) {
      state.feedingSessions[idx].durationMinutes = Math.max(1, Number(durationMinutes) || 1);
    }
    if (time !== undefined) state.feedingSessions[idx].time = time;
    if (date !== undefined) state.feedingSessions[idx].date = date;
    if (notes !== undefined) state.feedingSessions[idx].notes = notes;
    saveBabyTrackerAndSync(state);
  }

  res.json(getBabyTrackerState());
});

// Delete a feeding session
app.delete('/api/baby-tracker/feeding/:id', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { id } = req.params;
  const state = readJson(BABY_TRACKER_FILE, getDefaultBabyTrackerData());
  state.feedingSessions = (state.feedingSessions || []).filter(f => f.id !== id);
  saveBabyTrackerAndSync(state);

  res.json(getBabyTrackerState());
});

// Update daily metrics (Changed diapers, Daily weight, Hours of sleep)
app.post('/api/baby-tracker/metrics', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const {
    date,
    wetDiapers,
    dirtyDiapers,
    totalDiapers,
    deltaWet,
    deltaDirty,
    deltaDiapers,
    weightLbs,
    sleepHours,
    deltaSleep
  } = req.body;

  const { dateStr } = getEstDateTime();
  const targetDate = date || dateStr;

  const state = readJson(BABY_TRACKER_FILE, getDefaultBabyTrackerData());
  state.dailyMetrics = state.dailyMetrics || {};

  const current = state.dailyMetrics[targetDate] || {
    date: targetDate,
    wetDiapers: 0,
    dirtyDiapers: 0,
    totalDiapers: 0,
    weightLbs: 0,
    sleepHours: 0
  };

  if (wetDiapers !== undefined) current.wetDiapers = Math.max(0, Number(wetDiapers) || 0);
  if (dirtyDiapers !== undefined) current.dirtyDiapers = Math.max(0, Number(dirtyDiapers) || 0);
  if (deltaWet !== undefined) current.wetDiapers = Math.max(0, (current.wetDiapers || 0) + Number(deltaWet));
  if (deltaDirty !== undefined) current.dirtyDiapers = Math.max(0, (current.dirtyDiapers || 0) + Number(deltaDirty));

  if (totalDiapers !== undefined) {
    current.totalDiapers = Math.max(0, Number(totalDiapers) || 0);
  } else if (deltaDiapers !== undefined) {
    current.totalDiapers = Math.max(0, (current.totalDiapers || 0) + Number(deltaDiapers));
  } else {
    current.totalDiapers = (current.wetDiapers || 0) + (current.dirtyDiapers || 0);
  }

  if (weightLbs !== undefined) {
    current.weightLbs = Math.max(0, Math.round(Number(weightLbs) * 100) / 100);
  }

  if (sleepHours !== undefined) {
    current.sleepHours = Math.max(0, Math.min(24, Math.round(Number(sleepHours) * 10) / 10));
  } else if (deltaSleep !== undefined) {
    current.sleepHours = Math.max(
      0,
      Math.min(24, Math.round(((current.sleepHours || 0) + Number(deltaSleep)) * 10) / 10)
    );
  }

  state.dailyMetrics[targetDate] = current;
  saveBabyTrackerAndSync(state);

  res.json(getBabyTrackerState());
});

// Toggle completed AAP vaccine on schedule
app.post('/api/baby-tracker/vaccine/toggle', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const { vaccineId } = req.body;
  if (!vaccineId) return res.status(400).json({ error: 'vaccineId required' });

  const state = readJson(BABY_TRACKER_FILE, getDefaultBabyTrackerData());
  state.completedVaccines = Array.isArray(state.completedVaccines) ? state.completedVaccines : [];

  if (state.completedVaccines.includes(vaccineId)) {
    state.completedVaccines = state.completedVaccines.filter(id => id !== vaccineId);
  } else {
    state.completedVaccines.push(vaccineId);
  }

  saveBabyTrackerAndSync(state);
  res.json(getBabyTrackerState());
});

// Reset / Clear Baby Tracker data to fresh zero state
app.post('/api/baby-tracker/reset', async (req, res) => {
  await hydrateBoardFromCloud(false);

  const past7 = getPastDateKeysEST(7);
  const emptyDaily = {};
  past7.forEach(d => {
    emptyDaily[d] = {
      date: d,
      wetDiapers: 0,
      dirtyDiapers: 0,
      totalDiapers: 0,
      weightLbs: 0,
      sleepHours: 0
    };
  });
  const fresh = {
    babyName: 'Aiden James Vane',
    dueDate: '2026-11-03',
    feedingGoalPerDay: 8,
    feedingDurationGoalMinutes: 140,
    diaperGoalPerDay: 8,
    sleepGoalHours: 15,
    dailyMetrics: emptyDaily,
    feedingSessions: [],
    completedVaccines: [],
    updatedAt: new Date().toISOString()
  };
  saveBabyTrackerAndSync(fresh);
  res.json(getBabyTrackerState());
});

// ============================================================================
// 5B. Mackie's Personal Health, Fitness, Postpartum Timeline, Cycle & Oura Hub
// ============================================================================
app.get('/api/health-fitness', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const hf = readJson(HEALTH_FITNESS_FILE, getDefaultHealthFitnessData());
  res.json({
    ...getDefaultHealthFitnessData(),
    ...hf
  });
});

app.post('/api/health-fitness/update', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const current = {
    ...getDefaultHealthFitnessData(),
    ...readJson(HEALTH_FITNESS_FILE, getDefaultHealthFitnessData())
  };
  const updates = req.body || {};

  if (Array.isArray(updates.customRoutines)) current.customRoutines = updates.customRoutines;
  if (updates.weeklyWorkouts && typeof updates.weeklyWorkouts === 'object') {
    current.weeklyWorkouts = updates.weeklyWorkouts;
  }
  if (updates.deliveryDate !== undefined) current.deliveryDate = updates.deliveryDate;
  if (updates.selectedPhaseId !== undefined) current.selectedPhaseId = updates.selectedPhaseId;
  if (Array.isArray(updates.cycleLogs)) current.cycleLogs = updates.cycleLogs;
  if (updates.averageCycleLength !== undefined) {
    current.averageCycleLength = Math.max(20, Math.min(45, Number(updates.averageCycleLength) || 28));
  }
  if (updates.periodDurationDays !== undefined) {
    current.periodDurationDays = Math.max(2, Math.min(10, Number(updates.periodDurationDays) || 5));
  }
  if (Array.isArray(updates.dailyLogs)) current.dailyLogs = updates.dailyLogs;
  if (updates.ouraToken !== undefined) current.ouraToken = String(updates.ouraToken || '').trim();
  if (updates.ouraConnected !== undefined) current.ouraConnected = Boolean(updates.ouraConnected);

  const ts = saveHealthFitnessAndSync(current);
  res.json({
    success: true,
    healthFitness: current,
    healthFitnessUpdatedAt: ts
  });
});

// Connect & Sync Oura Ring Cloud API v2 (Sleep, Activity, Readiness & Cycle Temp Deviation)
app.post('/api/health-fitness/oura/sync', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const current = {
    ...getDefaultHealthFitnessData(),
    ...readJson(HEALTH_FITNESS_FILE, getDefaultHealthFitnessData())
  };

  const incomingToken = req.body?.token !== undefined ? String(req.body.token).trim() : current.ouraToken;
  if (!incomingToken) {
    return res.status(400).json({
      error: 'Please enter your Oura Ring Personal Access Token from cloud.ouraring.com/personal-access-tokens'
    });
  }

  try {
    const endDate = getEstDateTime().dateStr;
    const startObj = new Date(endDate + 'T12:00:00');
    startObj.setDate(startObj.getDate() - 14);
    const startDate = startObj.toISOString().split('T')[0];

    const headers = {
      Authorization: `Bearer ${incomingToken}`,
      Accept: 'application/json'
    };

    const [sleepRes, actRes, readyRes, detailSleepRes] = await Promise.all([
      fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${startDate}&end_date=${endDate}`, { headers }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${startDate}&end_date=${endDate}`, { headers }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${startDate}&end_date=${endDate}`, { headers }),
      fetch(`https://api.ouraring.com/v2/usercollection/sleep?start_date=${startDate}&end_date=${endDate}`, { headers })
    ]);

    if (sleepRes.status === 401 || actRes.status === 401) {
      return res.status(401).json({
        error: 'Oura Ring token was rejected (401 Unauthorized). Please verify your Personal Access Token.'
      });
    }

    const sleepJson = sleepRes.ok ? await sleepRes.json() : { data: [] };
    const actJson = actRes.ok ? await actRes.json() : { data: [] };
    const readyJson = readyRes.ok ? await readyRes.json() : { data: [] };
    const detailSleepJson = detailSleepRes.ok ? await detailSleepRes.json() : { data: [] };

    const byDate = new Map();
    for (const item of current.dailyLogs || []) {
      if (item && item.date) byDate.set(item.date, { ...item });
    }

    for (const s of sleepJson.data || []) {
      if (!s.day) continue;
      const existing = byDate.get(s.day) || { date: s.day };
      existing.sleepScore = s.score ?? existing.sleepScore ?? null;
      existing.source = 'Oura Ring';
      byDate.set(s.day, existing);
    }

    for (const ds of detailSleepJson.data || []) {
      if (!ds.day) continue;
      const existing = byDate.get(ds.day) || { date: ds.day };
      if (ds.total_sleep_duration) {
        existing.sleepHours = Math.round((ds.total_sleep_duration / 3600) * 10) / 10;
      }
      if (ds.deep_sleep_duration) {
        existing.deepSleepMins = Math.round(ds.deep_sleep_duration / 60);
      }
      if (ds.rem_sleep_duration) {
        existing.remSleepMins = Math.round(ds.rem_sleep_duration / 60);
      }
      if (ds.lowest_heart_rate) {
        existing.restingHr = ds.lowest_heart_rate;
      }
      if (ds.average_hrv) {
        existing.hrvMs = ds.average_hrv;
      }
      existing.source = 'Oura Ring';
      byDate.set(ds.day, existing);
    }

    for (const a of actJson.data || []) {
      if (!a.day) continue;
      const existing = byDate.get(a.day) || { date: a.day };
      existing.activityScore = a.score ?? existing.activityScore ?? null;
      existing.steps = a.steps ?? existing.steps ?? 0;
      existing.activeCalories = a.active_calories ?? existing.activeCalories ?? 0;
      if (a.equivalent_walking_distance) {
        existing.walkingMiles = Math.round((a.equivalent_walking_distance / 1609.34) * 10) / 10;
      }
      if (a.medium_activity_time || a.high_activity_time) {
        existing.walkingMinutes = Math.round(((a.medium_activity_time || 0) + (a.high_activity_time || 0)) / 60);
      }
      existing.source = 'Oura Ring';
      byDate.set(a.day, existing);
    }

    for (const r of readyJson.data || []) {
      if (!r.day) continue;
      const existing = byDate.get(r.day) || { date: r.day };
      existing.readinessScore = r.score ?? existing.readinessScore ?? null;
      if (r.temperature_deviation !== undefined && r.temperature_deviation !== null) {
        existing.tempDeviationC = Math.round(Number(r.temperature_deviation) * 100) / 100;
      }
      existing.source = 'Oura Ring';
      byDate.set(r.day, existing);
    }

    const mergedLogs = Array.from(byDate.values()).sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || ''))
    );

    current.ouraToken = incomingToken;
    current.ouraConnected = true;
    current.ouraLastSynced = new Date().toISOString();
    current.dailyLogs = mergedLogs.slice(0, 60);

    const ts = saveHealthFitnessAndSync(current);
    res.json({
      success: true,
      healthFitness: current,
      healthFitnessUpdatedAt: ts,
      syncedDaysCount: mergedLogs.length
    });
  } catch (err) {
    res.status(500).json({ error: `Oura sync failed: ${err.message}` });
  }
});

// ============================================================================
// 6. Daily News (Top 3-5 Verified U.S. Policy & National News, 07:00 AM EST)
//    & Downtown D.C. Weekly/Monthly Seasonal Recommendations (5 W's)
// ============================================================================
app.get('/api/news', async (req, res) => {
  try {
    const news = await getDailyNews(false);
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news/refresh', async (req, res) => {
  try {
    const news = await refreshDailyNews();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dc-recommendations', async (req, res) => {
  try {
    const cycleOffset = parseInt(req.query.cycleOffset || '0', 10) || 0;
    const dcData = await getDcRecommendations(cycleOffset);
    res.json(dcData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 7. Interactive Tri-Color Australian Shepherd Newborn Medical Research Agent
// ============================================================================
app.post('/api/baby-agent/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await askNewbornMedicalAgent(question);
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 7B. Mackie's Dashboard Update Suggestions (Historical Log for Antigravity)
// ============================================================================
const CLOUD_MACKIE_API = 'https://daily-executive-dashboard.onrender.com/mackie/api';
const IS_RENDER_ENV = Boolean(process.env.RENDER || process.env.RENDER_EXTERNAL_URL);

// Mirror paths on local Windows PC so both standalone (port 3005) and mounted (port 3001) share the exact same file
const LOCAL_MIRROR_SUGGESTIONS_FILES = !IS_RENDER_ENV
  ? [
      SUGGESTIONS_FILE,
      'c:\\Users\\micha\\OneDrive\\Desktop\\ANTIGRAVITY PROJECTS\\Mackie Mom Board\\data\\suggestions.json',
      'c:\\Users\\micha\\OneDrive\\Desktop\\ANTIGRAVITY PROJECTS\\Daily Dashboard\\mackie-board\\data\\suggestions.json'
    ]
  : [SUGGESTIONS_FILE];

function mergeSuggestionsStates(localState, remoteState) {
  const deletedSet = new Set([
    ...((localState && localState.deletedIds) || []),
    ...((remoteState && remoteState.deletedIds) || [])
  ]);
  const map = new Map();
  const combined = [
    ...((remoteState && (remoteState.items || remoteState.suggestions)) || []),
    ...((localState && (localState.items || localState.suggestions)) || [])
  ];
  for (const item of combined) {
    if (item && item.id && item.text && !deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  }
  const mergedItems = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  return {
    items: mergedItems,
    deletedIds: Array.from(deletedSet),
    updatedAt: new Date().toISOString()
  };
}

function loadSuggestionsState() {
  let merged = { items: [], deletedIds: [] };
  for (const filePath of LOCAL_MIRROR_SUGGESTIONS_FILES) {
    const raw = readJson(filePath, null);
    if (raw) {
      merged = mergeSuggestionsStates(merged, {
        items: Array.isArray(raw.items) ? raw.items : (Array.isArray(raw.suggestions) ? raw.suggestions : []),
        deletedIds: Array.isArray(raw.deletedIds) ? raw.deletedIds : []
      });
    }
  }
  return merged;
}

function saveSuggestionsStateToDisk(state, syncToGitHub = true) {
  const normalized = {
    items: Array.isArray(state.items) ? state.items : [],
    deletedIds: Array.isArray(state.deletedIds) ? state.deletedIds : [],
    updatedAt: new Date().toISOString()
  };
  for (const filePath of LOCAL_MIRROR_SUGGESTIONS_FILES) {
    try {
      const dir = path.dirname(filePath);
      if (fs.existsSync(dir)) {
        writeJson(filePath, normalized);
      }
    } catch {}
  }
  if (syncToGitHub) {
    pushCloudState({
      suggestions: {
        items: normalized.items,
        deletedIds: normalized.deletedIds
      },
      suggestionsUpdatedAt: Date.now()
    }).catch(() => {});
  }
  return normalized;
}

// Background two-way sync between local PC, Render Cloud, and permanent GitHub store
async function syncSuggestionsWithCloud() {
  await hydrateBoardFromCloud(false);
  let state = loadSuggestionsState();
  if (IS_RENDER_ENV) return state;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const r = await fetch(`${CLOUD_MACKIE_API}/suggestions/sync?localOnly=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: state.items,
        deletedIds: state.deletedIds
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (r.ok) {
      const remote = await r.json();
      state = mergeSuggestionsStates(state, {
        items: remote.suggestions || remote.items || [],
        deletedIds: remote.deletedIds || []
      });
      saveSuggestionsStateToDisk(state, false);
    }
  } catch {}
  return state;
}

app.get('/api/suggestions', async (req, res) => {
  await hydrateBoardFromCloud(false);
  let state = loadSuggestionsState();
  if (!IS_RENDER_ENV && !req.query.localOnly) {
    state = await syncSuggestionsWithCloud();
  }
  res.json({
    suggestions: state.items,
    deletedIds: state.deletedIds
  });
});

app.post('/api/suggestions/sync', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const incoming = req.body || {};
  const current = loadSuggestionsState();
  let merged = mergeSuggestionsStates(current, {
    items: Array.isArray(incoming.items)
      ? incoming.items
      : (Array.isArray(incoming.suggestions) ? incoming.suggestions : []),
    deletedIds: Array.isArray(incoming.deletedIds) ? incoming.deletedIds : []
  });

  const changed =
    merged.items.length !== current.items.length ||
    merged.deletedIds.length !== current.deletedIds.length;

  saveSuggestionsStateToDisk(merged, changed);

  if (!IS_RENDER_ENV && !req.query.localOnly) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const r = await fetch(`${CLOUD_MACKIE_API}/suggestions/sync?localOnly=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: merged.items,
          deletedIds: merged.deletedIds
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (r.ok) {
        const remote = await r.json();
        merged = mergeSuggestionsStates(merged, {
          items: remote.suggestions || remote.items || [],
          deletedIds: remote.deletedIds || []
        });
        saveSuggestionsStateToDisk(merged, false);
      }
    } catch {}
  }

  res.json({
    success: true,
    suggestions: merged.items,
    deletedIds: merged.deletedIds
  });
});

app.post('/api/suggestions', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const { text, category, id: providedId, createdAt: providedCreatedAt, formattedDate: providedDate } = req.body || {};
  const cleanText = String(text || '').trim();
  if (!cleanText) {
    return res.status(400).json({ error: 'Suggestion comment is required' });
  }

  const now = new Date();
  const formattedDate =
    providedDate ||
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(now) + ' EST';

  const newEntry = {
    id: providedId || `sug-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text: cleanText,
    category: String(category || 'General').trim(),
    author: 'Mackie',
    createdAt: providedCreatedAt || now.toISOString(),
    formattedDate
  };

  const state = loadSuggestionsState();
  // Remove from deletedIds if re-added explicitly
  state.deletedIds = (state.deletedIds || []).filter(id => id !== newEntry.id);
  if (!state.items.some(i => i.id === newEntry.id)) {
    state.items.unshift(newEntry);
  }
  saveSuggestionsStateToDisk(state, true);

  // Forward to Render cloud if added locally so both cloud & desktop stay in sync
  if (!IS_RENDER_ENV && !req.query.localOnly) {
    fetch(`${CLOUD_MACKIE_API}/suggestions/sync?localOnly=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: state.items,
        deletedIds: state.deletedIds
      })
    }).catch(() => {});
  }

  res.json({
    success: true,
    suggestion: newEntry,
    suggestions: state.items,
    deletedIds: state.deletedIds
  });
});

app.delete('/api/suggestions/:id', async (req, res) => {
  await hydrateBoardFromCloud(false);
  const targetId = req.params.id;
  const state = loadSuggestionsState();
  state.items = state.items.filter(i => i.id !== targetId);
  if (targetId && !state.deletedIds.includes(targetId)) {
    state.deletedIds.push(targetId);
  }
  saveSuggestionsStateToDisk(state, true);

  if (!IS_RENDER_ENV && !req.query.localOnly) {
    fetch(`${CLOUD_MACKIE_API}/suggestions/${encodeURIComponent(targetId)}?localOnly=1`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  res.json({
    success: true,
    suggestions: state.items,
    deletedIds: state.deletedIds
  });
});

// Hydrate from permanent GitHub Cloud Store immediately on boot (for both Render & Local PC)
hydrateBoardFromCloud(true).catch(() => {});

// Start continuous 15-second Cloud <-> Local PC sync & Render keep-alive daemon
if (!IS_RENDER_ENV) {
  setTimeout(() => {
    syncSuggestionsWithCloud().catch(() => {});
  }, 2000);
  setInterval(() => {
    syncSuggestionsWithCloud().catch(() => {});
  }, 15000);
}

// ============================================================================
// 8. Automated Background Sync (Every 15 Mins Calendar + 07:00 AM EST News)
// ============================================================================
cron.schedule('*/15 * * * *', async () => {
  try {
    await syncCalendar();
  } catch (e) {
    console.warn('[Cron] Calendar background sync warning:', e.message);
  }
});

// Daily News automatic update at 07:00 AM EST every day
cron.schedule(
  '0 7 * * *',
  async () => {
    try {
      console.log('[Cron 07:00 AM EST] Running daily U.S. Policy & Top News update with link verification...');
      await refreshDailyNews();
    } catch (e) {
      console.warn('[Cron 07:00 AM EST] News refresh warning:', e.message);
    }
  },
  { timezone: 'America/New_York' }
);

// SPA Fallback
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/oauth2callback')) return next();
  const distIndex = path.join(DIST_PATH, 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  next();
});

const { spawn } = require('child_process');

function startCloudflareTunnel() {
  const cfPath = path.join(__dirname, '..', 'cloudflared.exe');
  if (!fs.existsSync(cfPath)) {
    return;
  }

  console.log('[Tunnel] Starting Cloudflare HTTP/2 Tunnel (Riverpoint WiFi / ADP Bypass)...');
  const cf = spawn(cfPath, ['tunnel', '--url', `http://localhost:${PORT}`, '--protocol', 'http2'], {
    windowsHide: true
  });

  const handleOutput = (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && match[0]) {
      const url = match[0];
      writeJson(TUNNEL_FILE, {
        url,
        protocol: 'http2 (Riverpoint WiFi & iPhone ADP Compatible)',
        updatedAt: new Date().toISOString()
      });
      console.log(`[Tunnel] Live iPhone & Website HTTPS URL Ready: ${url}`);
    }
  };

  cf.stdout.on('data', handleOutput);
  cf.stderr.on('data', handleOutput);
  cf.on('error', (err) => {
    console.warn('[Tunnel] Cloudflare tunnel error:', err.message);
  });
}

// Initial calendar & daily news setup on boot
syncCalendar().catch(err => console.warn('[Boot] Initial calendar check:', err.message));
getDailyNews(false).catch(err => console.warn('[Boot] Initial news check:', err.message));
getDcRecommendations(0).catch(err => console.warn('[Boot] Initial D.C. recommendations check:', err.message));

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mackie's Mom Board Server running on http://0.0.0.0:${PORT}`);
    console.log(`Dedicated Calendar Account: ${TARGET_ACCOUNT}`);
    startCloudflareTunnel();
  });
}

module.exports = app;



