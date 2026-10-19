const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const { pushCloudState } = require('./cloudStore.cjs');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const SCHEDULE_FILE = path.join(DATA_DIR, 'schedule.json');
const CAL_CONFIG_FILE = path.join(DATA_DIR, 'calendar_config.json');
// Strictly isolated credential storage for Mackie (amblair92@gmail.com) - NEVER touches Mike's credentials!
const MACKIE_CREDS_PATH = path.join(DATA_DIR, 'mackie_google_credentials.json');
const GCP_KEYS_FALLBACK = 'C:\\Users\\micha\\.gmail-mcp\\gcp-oauth.keys.json';

const TARGET_ACCOUNT = 'amblair92@gmail.com';
const PORT = process.env.PORT || 3005;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly'
];

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getGcpKeys() {
  if (process.env.GCP_OAUTH_KEYS) {
    try { return JSON.parse(process.env.GCP_OAUTH_KEYS); } catch (e) {}
  }
  const localKeys = path.join(DATA_DIR, 'gcp-oauth.keys.json');
  if (fs.existsSync(localKeys)) {
    try { return JSON.parse(fs.readFileSync(localKeys, 'utf8')); } catch (e) {}
  }
  if (fs.existsSync(GCP_KEYS_FALLBACK)) {
    try { return JSON.parse(fs.readFileSync(GCP_KEYS_FALLBACK, 'utf8')); } catch (e) {}
  }
  return null;
}

function getMackieCredentials() {
  if (process.env.MACKIE_GOOGLE_CREDENTIALS) {
    try { return JSON.parse(process.env.MACKIE_GOOGLE_CREDENTIALS); } catch (e) {}
  }
  if (fs.existsSync(MACKIE_CREDS_PATH)) {
    try { return JSON.parse(fs.readFileSync(MACKIE_CREDS_PATH, 'utf8')); } catch (e) {}
  }
  return null;
}

function getOAuthClient() {
  const keysContent = getGcpKeys();
  if (!keysContent) return null;
  const installed = keysContent.installed || keysContent.web;
  if (!installed) return null;
  return new OAuth2Client({
    clientId: installed.client_id,
    clientSecret: installed.client_secret,
    redirectUri: REDIRECT_URI
  });
}

/**
 * Generate Google OAuth consent URL strictly for amblair92@gmail.com
 */
function getGoogleAuthUrl() {
  const client = getOAuthClient();
  if (!client) return null;
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    login_hint: TARGET_ACCOUNT
  });
}

/**
 * Exchange OAuth code for tokens and save strictly to data/mackie_google_credentials.json
 */
async function handleTokenExchange(code) {
  const client = getOAuthClient();
  if (!client) throw new Error('OAuth client configuration not found');
  const { tokens } = await client.getToken(code);

  let existing = {};
  if (fs.existsSync(MACKIE_CREDS_PATH)) {
    try { existing = JSON.parse(fs.readFileSync(MACKIE_CREDS_PATH, 'utf8')); } catch (e) {}
  }

  const merged = {
    ...existing,
    ...tokens,
    account: TARGET_ACCOUNT,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(MACKIE_CREDS_PATH, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`[MackieCalendarSync] Saved isolated Google Calendar credentials for ${TARGET_ACCOUNT}`);
  return merged;
}

async function getAccessToken() {
  const keysContent = getGcpKeys();
  const creds = getMackieCredentials();
  if (!keysContent || !creds) return null;

  const installed = keysContent.installed || keysContent.web;
  if (!installed || !creds.refresh_token) return null;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: installed.client_id,
        client_secret: installed.client_secret,
        refresh_token: creds.refresh_token,
        grant_type: 'refresh_token'
      }).toString()
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error('[MackieCalendarSync] Failed to refresh access token:', err.message);
    return null;
  }
}

function parseIcsDateInfo(str) {
  if (!str) return null;
  const clean = str.replace(/[^0-9TZ]/g, '');
  if (clean.length === 8) {
    const y = clean.slice(0, 4);
    const m = clean.slice(4, 6);
    const d = clean.slice(6, 8);
    const dateStr = `${y}-${m}-${d}`;
    return {
      dateObj: new Date(Date.UTC(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), 12, 0, 0)),
      dateStr,
      timeStr: 'ALL DAY',
      endTimeStr: '',
      isAllDay: true
    };
  }
  if (clean.endsWith('Z')) {
    const y = parseInt(clean.slice(0, 4), 10);
    const m = parseInt(clean.slice(4, 6), 10) - 1;
    const d = parseInt(clean.slice(6, 8), 10);
    const h = parseInt(clean.slice(9, 11), 10);
    const min = parseInt(clean.slice(11, 13), 10);
    const s = parseInt(clean.slice(13, 15), 10) || 0;
    const utcDate = new Date(Date.UTC(y, m, d, h, min, s));
    return {
      dateObj: utcDate,
      dateStr: formatDateEst(utcDate),
      timeStr: formatTimeEst(utcDate),
      isAllDay: false
    };
  } else {
    // Local timestamp (already in America/New_York)
    const y = clean.slice(0, 4);
    const m = clean.slice(4, 6);
    const d = clean.slice(6, 8);
    const h = clean.slice(9, 11);
    const min = clean.slice(11, 13);
    const dateStr = `${y}-${m}-${d}`;
    const timeStr = `${h}:${min}`;
    const dateObj = new Date(Date.UTC(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), 12, 0, 0));
    return {
      dateObj,
      dateStr,
      timeStr,
      isAllDay: false
    };
  }
}

function parseIcsDate(str) {
  const info = parseIcsDateInfo(str);
  return info ? info.dateObj : null;
}

function formatDateEst(d) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
}

function formatTimeEst(d) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

function getNext7DaysKeys() {
  return getUpcomingDaysKeys(7);
}

function getUpcomingDaysKeys(days = 60) {
  const now = new Date();
  const keys = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    keys.push(formatDateEst(d));
  }
  return keys;
}

function expandRrule(raw, windowStart, windowEnd) {
  if (!raw.rrule) return [];
  const parts = {};
  for (const part of raw.rrule.split(';')) {
    const [k, v] = part.split('=');
    if (k && v) parts[k.toUpperCase()] = v.toUpperCase();
  }

  const freq = parts.FREQ;
  const interval = parseInt(parts.INTERVAL, 10) || 1;
  const until = parts.UNTIL ? parseIcsDate(parts.UNTIL) : null;
  const count = parts.COUNT ? parseInt(parts.COUNT, 10) : null;
  const byDay = parts.BYDAY ? parts.BYDAY.split(',') : null;
  const byMonthDay = parts.BYMONTHDAY ? parseInt(parts.BYMONTHDAY, 10) : null;

  const dtStart = parseIcsDate(raw.dtstart);
  if (!dtStart || isNaN(dtStart.getTime())) return [];

  const results = [];
  const maxIterations = 2000;
  let iter = 0;
  let totalCount = 0;

  let current = new Date(dtStart.getTime());

  if (freq === 'DAILY') {
    // Fast-forward towards windowStart
    const daysDiff = Math.floor((windowStart.getTime() - dtStart.getTime()) / (24 * 60 * 60 * 1000));
    if (daysDiff > 0 && !count) {
      const steps = Math.floor(daysDiff / interval);
      current.setDate(current.getDate() + steps * interval);
    }

    while (current <= windowEnd && iter++ < maxIterations) {
      if (until && current > until) break;
      if (count && totalCount >= count) break;
      if (current >= windowStart) {
        results.push(new Date(current.getTime()));
      }
      totalCount++;
      current.setDate(current.getDate() + interval);
    }
  } else if (freq === 'WEEKLY') {
    const dayMap = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
    const targetDays = byDay
      ? byDay.map(d => dayMap[d.slice(-2)]).filter(x => x !== undefined)
      : [dtStart.getDay()];

    let weekStart = new Date(dtStart.getTime());
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    // Fast-forward towards windowStart
    const weeksDiff = Math.floor((windowStart.getTime() - dtStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    if (weeksDiff > 0 && !count) {
      const steps = Math.floor(weeksDiff / interval);
      weekStart.setDate(weekStart.getDate() + steps * 7 * interval);
    }

    while (weekStart <= windowEnd && iter++ < maxIterations) {
      for (const dayOfWeek of targetDays) {
        const candidate = new Date(weekStart.getTime());
        candidate.setDate(candidate.getDate() + dayOfWeek);
        candidate.setHours(dtStart.getHours(), dtStart.getMinutes(), dtStart.getSeconds(), 0);

        if (candidate < dtStart) continue;
        if (until && candidate > until) continue;
        if (candidate > windowEnd) continue;

        if (candidate >= windowStart && candidate <= windowEnd) {
          results.push(candidate);
        }
        totalCount++;
        if (count && totalCount >= count) break;
      }
      if (count && totalCount >= count) break;
      if (until && weekStart > until) break;
      weekStart.setDate(weekStart.getDate() + (7 * interval));
    }
  } else if (freq === 'MONTHLY') {
    let targetDay = byMonthDay || dtStart.getDate();
    let monthCursor = new Date(dtStart.getFullYear(), dtStart.getMonth(), targetDay, dtStart.getHours(), dtStart.getMinutes(), 0);

    // Fast-forward towards windowStart
    const monthsDiff = (windowStart.getFullYear() - dtStart.getFullYear()) * 12 + (windowStart.getMonth() - dtStart.getMonth());
    if (monthsDiff > 0 && !count) {
      const steps = Math.floor(monthsDiff / interval);
      monthCursor = new Date(dtStart.getFullYear(), dtStart.getMonth() + steps * interval, targetDay, dtStart.getHours(), dtStart.getMinutes(), 0);
    }

    while (monthCursor <= windowEnd && iter++ < maxIterations) {
      if (until && monthCursor > until) break;
      if (count && totalCount >= count) break;
      if (monthCursor >= windowStart && monthCursor >= dtStart) {
        results.push(new Date(monthCursor.getTime()));
      }
      totalCount++;
      monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + interval, targetDay, dtStart.getHours(), dtStart.getMinutes(), 0);
    }
  } else if (freq === 'YEARLY') {
    let yearCursor = new Date(dtStart.getTime());
    const yearsDiff = windowStart.getFullYear() - dtStart.getFullYear();
    if (yearsDiff > 0 && !count) {
      const steps = Math.floor(yearsDiff / interval);
      yearCursor.setFullYear(dtStart.getFullYear() + steps * interval);
    }

    while (yearCursor <= windowEnd && iter++ < maxIterations) {
      if (until && yearCursor > until) break;
      if (count && totalCount >= count) break;
      if (yearCursor >= windowStart) {
        results.push(new Date(yearCursor.getTime()));
      }
      totalCount++;
      yearCursor.setFullYear(yearCursor.getFullYear() + interval);
    }
  }

  return results;
}

function parseIcsEvents(icsContent) {
  const unfolded = icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  const rawEvents = [];
  let inEvent = false;
  let cur = {};

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      cur = {};
      continue;
    }
    if (line.startsWith('END:VEVENT')) {
      if (cur.summary && cur.dtstart) {
        rawEvents.push(cur);
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const rawKey = line.slice(0, colonIdx);
    const val = line.slice(colonIdx + 1).trim();
    const key = rawKey.split(';')[0].toUpperCase();

    if (key === 'SUMMARY') cur.summary = val.replace(/\\,/g, ',').replace(/\\;/g, ';');
    if (key === 'LOCATION') cur.location = val.replace(/\\,/g, ',').replace(/\\;/g, ';');
    if (key === 'DESCRIPTION') cur.description = val.replace(/\\n/g, '\n').replace(/\\,/g, ',');
    if (key === 'UID') cur.uid = val;
    if (key === 'DTSTART') cur.dtstart = val;
    if (key === 'DTEND') cur.dtend = val;
    if (key === 'RRULE') cur.rrule = val;
    if (key === 'EXDATE') {
      cur.exdates = cur.exdates || [];
      cur.exdates.push(val);
    }
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

  const parsedEvents = [];

  for (const raw of rawEvents) {
    const summary = raw.summary || 'Calendar Event';
    let category = 'personal';
    if (/dr|doctor|ob|pediatric|appointment|clinic|hospital|dentist/i.test(summary)) category = 'Appointment';
    else if (/work|shift|meeting|retina|clinic/i.test(summary)) category = 'Work';
    else if (/dinner|lunch|breakfast|brunch|party|family|date/i.test(summary)) category = 'Family';

    const isAllDay = (raw.dtstart || '').length === 8;
    const startDateObj = parseIcsDate(raw.dtstart);
    const endDateObj = raw.dtend ? parseIcsDate(raw.dtend) : null;
    const durationMs = (startDateObj && endDateObj && !isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime()))
      ? Math.max(0, endDateObj.getTime() - startDateObj.getTime())
      : 60 * 60 * 1000;

    // Handle recurring events via RRULE expansion
    if (raw.rrule) {
      const occurrenceDates = expandRrule(raw, windowStart, windowEnd);
      const exdateSet = new Set((raw.exdates || []).map(x => x.replace(/[^0-9]/g, '').slice(0, 8)));

      for (const occ of occurrenceDates) {
        const dateStr = formatDateEst(occ);
        const compactDate = dateStr.replace(/-/g, '');
        if (exdateSet.has(compactDate)) continue;

        let timeStr = 'ALL DAY';
        let endTimeStr = '';
        if (!isAllDay) {
          timeStr = formatTimeEst(occ);
          const endOcc = new Date(occ.getTime() + durationMs);
          endTimeStr = formatTimeEst(endOcc);
        }

        parsedEvents.push({
          id: `${raw.uid || 'ical'}_${dateStr}`,
          date: dateStr,
          time: timeStr,
          endTime: endTimeStr,
          title: summary,
          location: raw.location || '',
          category,
          notes: raw.description ? raw.description.slice(0, 180) : '',
          recurring: true
        });
      }
      continue;
    }

    // Single (non-recurring) event
    const startInfo = parseIcsDateInfo(raw.dtstart);
    if (!startInfo) continue;
    const endInfo = raw.dtend ? parseIcsDateInfo(raw.dtend) : null;

    const dateStr = startInfo.dateStr;
    const timeStr = startInfo.timeStr;
    const endTimeStr = (endInfo && !endInfo.isAllDay) ? endInfo.timeStr : '';

    if (dateStr) {
      parsedEvents.push({
        id: raw.uid || `ical-${parsedEvents.length + 1}`,
        date: dateStr,
        time: timeStr,
        endTime: endTimeStr,
        title: summary,
        location: raw.location || '',
        category,
        notes: raw.description ? raw.description.slice(0, 180) : '',
        source: 'Google Calendar'
      });
    }
  }

  return parsedEvents;
}

async function syncIcalFeed(icalUrl) {
  try {
    console.log(`[MackieCalendarSync] Fetching fresh iCal feed for ${TARGET_ACCOUNT}...`);
    const cbUrl = icalUrl + (icalUrl.includes('?') ? '&' : '?') + '_cb=' + Date.now();
    const res = await fetch(cbUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const icsText = await res.text();
    const events = parseIcsEvents(icsText);

    let existing = {};
    if (fs.existsSync(SCHEDULE_FILE)) {
      try { existing = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); } catch (e) {}
    }

    const deletedSet = new Set(existing.deletedEventIds || []);

    // 1. Build an index of all existing known events to ensure nothing is ever dropped
    const eventMap = new Map();
    const makeKey = (e) => {
      if (!e) return null;
      if (e.id) return String(e.id);
      return `${e.date || ''}_${e.time || 'all'}_${(e.title || '').trim().toLowerCase()}`;
    };

    // Load existing weekSchedule events
    if (existing.weekSchedule && typeof existing.weekSchedule === 'object') {
      for (const dayList of Object.values(existing.weekSchedule)) {
        if (Array.isArray(dayList)) {
          for (const ev of dayList) {
            const k = makeKey(ev);
            if (k && !deletedSet.has(ev.id)) eventMap.set(k, { ...ev, source: ev.source || 'Google Calendar' });
          }
        }
      }
    }

    // Load existing events array
    if (Array.isArray(existing.events)) {
      for (const ev of existing.events) {
        const k = makeKey(ev);
        if (k && !deletedSet.has(ev.id)) eventMap.set(k, { ...ev, source: ev.source || 'Google Calendar' });
      }
    }

    // Load existing custom events
    const customEvents = (existing.customEvents || []).filter(e => !deletedSet.has(e.id));
    for (const ce of customEvents) {
      const k = makeKey(ce);
      if (k) eventMap.set(k, { ...ce, isCustom: true });
    }

    // Overlay freshly fetched events from Google Calendar
    for (const fe of events) {
      if (deletedSet.has(fe.id)) continue;
      const k = makeKey(fe);
      if (k) {
        const prev = eventMap.get(k) || {};
        eventMap.set(k, { ...prev, ...fe, source: 'Google Calendar' });
      }
    }

    const allEvents = Array.from(eventMap.values());

    // Build schedule for the next 60 days to support up to 8 weeks ahead
    const rangeKeys = getUpcomingDaysKeys(60);
    const weekSchedule = {};
    for (const k of rangeKeys) {
      weekSchedule[k] = [];
    }

    for (const evt of allEvents) {
      if (evt.date) {
        if (!weekSchedule[evt.date]) {
          weekSchedule[evt.date] = [];
        }
        if (!weekSchedule[evt.date].some(e => e.id === evt.id || (e.title === evt.title && e.time === evt.time && e.date === evt.date))) {
          weekSchedule[evt.date].push(evt);
          weekSchedule[evt.date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        }
      }
    }

    const todayStr = rangeKeys[0];
    const todayEvents = weekSchedule[todayStr] || [];

    const nowTs = Date.now();
    const scheduleData = {
      events: todayEvents,
      weekSchedule,
      customEvents,
      deletedEventIds: Array.from(deletedSet),
      lastSynced: new Date(nowTs).toISOString(),
      updatedAt: new Date(nowTs).toISOString(),
      updatedAtTs: nowTs,
      source: 'Google Calendar (Live iCal Sync)',
      account: TARGET_ACCOUNT,
      authorized: true
    };

    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2), 'utf8');
    pushCloudState({
      schedule: scheduleData,
      scheduleUpdatedAt: nowTs
    }).catch(() => {});

    return scheduleData;
  } catch (err) {
    console.error('[MackieCalendarSync] iCal sync error:', err.message);
    throw err;
  }
}

async function syncCalendar() {
  // 1. Check if iCal feed URL is configured
  let calConfig = null;
  if (fs.existsSync(CAL_CONFIG_FILE)) {
    try { calConfig = JSON.parse(fs.readFileSync(CAL_CONFIG_FILE, 'utf8')); } catch (e) {}
  }

  if (calConfig && calConfig.icalUrl) {
    try {
      return await syncIcalFeed(calConfig.icalUrl);
    } catch (e) {
      console.warn('[MackieCalendarSync] Configured iCal sync failed:', e.message);
    }
  }

  // 2. Check if Mackie's OAuth credentials exist
  const token = await getAccessToken();
  if (token) {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endWindow = new Date(startOfDay.getTime() + 60 * 24 * 60 * 60 * 1000);

      const calUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      calUrl.searchParams.set('timeMin', startOfDay.toISOString());
      calUrl.searchParams.set('timeMax', endWindow.toISOString());
      calUrl.searchParams.set('singleEvents', 'true');
      calUrl.searchParams.set('orderBy', 'startTime');

      const res = await fetch(calUrl.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const rawItems = data.items || [];
        const parsedEvents = rawItems.map((item, idx) => {
          let timeStr = '09:00';
          let endTimeStr = '10:00';
          let dateStr = '';

          if (item.start?.dateTime) {
            const s = new Date(item.start.dateTime);
            timeStr = new Intl.DateTimeFormat('en-US', {
              timeZone: 'America/New_York',
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            }).format(s);
            dateStr = new Intl.DateTimeFormat('en-CA', {
              timeZone: 'America/New_York',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(s);
          } else if (item.start?.date) {
            timeStr = 'ALL DAY';
            dateStr = item.start.date;
          }

          if (item.end?.dateTime) {
            const e = new Date(item.end.dateTime);
            endTimeStr = new Intl.DateTimeFormat('en-US', {
              timeZone: 'America/New_York',
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            }).format(e);
          } else {
            endTimeStr = '';
          }

          return {
            id: item.id || `gcal-${idx + 1}`,
            date: dateStr,
            time: timeStr,
            endTime: endTimeStr,
            title: item.summary || 'Calendar Event',
            location: item.location || '',
            category: 'Personal',
            notes: item.description ? item.description.slice(0, 180) : ''
          };
        });

        let existing = {};
        if (fs.existsSync(SCHEDULE_FILE)) {
          try { existing = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); } catch (e) {}
        }
        const deletedSet = new Set(existing.deletedEventIds || []);
        const customEvents = (existing.customEvents || []).filter(e => !deletedSet.has(e.id));

        // Build an index of all existing known events to ensure nothing is ever dropped
        const eventMap = new Map();
        const makeKey = (e) => {
          if (!e) return null;
          if (e.id) return String(e.id);
          return `${e.date || ''}_${e.time || 'all'}_${(e.title || '').trim().toLowerCase()}`;
        };

        // Load existing weekSchedule
        if (existing.weekSchedule && typeof existing.weekSchedule === 'object') {
          for (const dayList of Object.values(existing.weekSchedule)) {
            if (Array.isArray(dayList)) {
              for (const ev of dayList) {
                const k = makeKey(ev);
                if (k && !deletedSet.has(ev.id)) eventMap.set(k, { ...ev, source: ev.source || 'Google Calendar' });
              }
            }
          }
        }

        // Overlay custom events
        for (const ce of customEvents) {
          const k = makeKey(ce);
          if (k) eventMap.set(k, { ...ce, isCustom: true });
        }

        // Overlay freshly fetched events from Google Calendar
        for (const fe of parsedEvents) {
          if (deletedSet.has(fe.id)) continue;
          const k = makeKey(fe);
          if (k) {
            const prev = eventMap.get(k) || {};
            eventMap.set(k, { ...prev, ...fe, source: `Google Calendar (${TARGET_ACCOUNT})` });
          }
        }

        const allEvents = Array.from(eventMap.values());
        const rangeKeys = getUpcomingDaysKeys(60);
        const weekSchedule = {};
        for (const k of rangeKeys) weekSchedule[k] = [];

        for (const evt of allEvents) {
          if (evt.date) {
            if (!weekSchedule[evt.date]) weekSchedule[evt.date] = [];
            if (!weekSchedule[evt.date].some(e => e.id === evt.id || (e.title === evt.title && e.time === evt.time && e.date === evt.date))) {
              weekSchedule[evt.date].push(evt);
              weekSchedule[evt.date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
            }
          }
        }

        const nowTs = Date.now();
        const scheduleData = {
          events: weekSchedule[rangeKeys[0]] || [],
          weekSchedule,
          customEvents,
          deletedEventIds: Array.from(deletedSet),
          lastSynced: new Date(nowTs).toISOString(),
          updatedAt: new Date(nowTs).toISOString(),
          updatedAtTs: nowTs,
          source: `Google Calendar (${TARGET_ACCOUNT})`,
          account: TARGET_ACCOUNT,
          authorized: true
        };
        fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2), 'utf8');
        pushCloudState({ schedule: scheduleData, scheduleUpdatedAt: nowTs }).catch(() => {});
        return scheduleData;
      }
    } catch (err) {
      console.error('[MackieCalendarSync] Google API sync error:', err.message);
    }
  }

  return ensureDefaultSchedule();
}

function ensureDefaultSchedule() {
  const rangeKeys = getUpcomingDaysKeys(60);
  let existing = null;
  if (fs.existsSync(SCHEDULE_FILE)) {
    try { existing = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); } catch (e) {}
  }

  const customEvents = existing?.customEvents || [];
  const weekSchedule = { ...(existing?.weekSchedule || {}) };
  for (const k of rangeKeys) {
    weekSchedule[k] = Array.isArray(weekSchedule[k]) ? weekSchedule[k] : [];
  }

  for (const evt of customEvents) {
    if (evt.date) {
      weekSchedule[evt.date] = weekSchedule[evt.date] || [];
      if (!weekSchedule[evt.date].some(e => e.id === evt.id)) {
        weekSchedule[evt.date].push(evt);
        weekSchedule[evt.date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      }
    }
  }

  const nowTs = Date.now();
  const scheduleData = {
    events: weekSchedule[rangeKeys[0]] || [],
    weekSchedule,
    customEvents,
    lastSynced: existing?.lastSynced || null,
    updatedAt: new Date(nowTs).toISOString(),
    updatedAtTs: nowTs,
    source: existing?.authorized ? existing.source : 'Local Schedule + Ready for Google Calendar Sync',
    account: TARGET_ACCOUNT,
    authorized: Boolean(existing?.authorized)
  };

  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2), 'utf8');
  pushCloudState({ schedule: scheduleData, scheduleUpdatedAt: nowTs }).catch(() => {});
  return scheduleData;
}

async function addCalendarEvent(eventData) {
  const token = await getAccessToken();
  const rangeKeys = getUpcomingDaysKeys(60);
  const dateStr = eventData.date || rangeKeys[0];
  const isAllDay = eventData.isAllDay || eventData.time === 'All Day' || eventData.time === 'ALL DAY' || /all\s*day/i.test(eventData.time || '');
  const startTime = isAllDay ? 'All Day' : (eventData.time || '09:00');
  const endTime = isAllDay ? '' : (eventData.endTime || '10:00');

  let googleId = null;
  let googleSynced = false;

  if (token) {
    try {
      const payload = {
        summary: eventData.title || 'New Event',
        location: eventData.location || '',
        description: eventData.notes || '',
        start: isAllDay
          ? { date: dateStr }
          : { dateTime: `${dateStr}T${startTime}:00-04:00`, timeZone: 'America/New_York' },
        end: isAllDay
          ? { date: dateStr }
          : { dateTime: `${dateStr}T${endTime}:00-04:00`, timeZone: 'America/New_York' }
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const created = await res.json();
        googleId = created.id;
        googleSynced = true;
      }
    } catch (e) {
      console.warn('[MackieCalendarSync] Direct Google insert warning:', e.message);
    }
  }

  const newEvent = {
    id: googleId || `evt-${Date.now()}`,
    date: dateStr,
    time: startTime,
    endTime: endTime,
    isAllDay: Boolean(isAllDay),
    title: eventData.title || 'New Event',
    location: eventData.location || '',
    category: eventData.category || 'Personal',
    notes: eventData.notes || '',
    googleSynced
  };

  let sched = ensureDefaultSchedule();
  sched.customEvents = sched.customEvents || [];
  sched.customEvents = sched.customEvents.filter(e => e.id !== newEvent.id);
  sched.customEvents.push(newEvent);

  sched.weekSchedule = sched.weekSchedule || {};
  sched.weekSchedule[dateStr] = sched.weekSchedule[dateStr] || [];
  sched.weekSchedule[dateStr] = sched.weekSchedule[dateStr].filter(e => e.id !== newEvent.id);
  sched.weekSchedule[dateStr].push(newEvent);
  sched.weekSchedule[dateStr].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const todayKey = rangeKeys[0];
  sched.events = sched.weekSchedule[todayKey] || [];
  sched.updatedAt = new Date().toISOString();
  sched.updatedAtTs = Date.now();

  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(sched, null, 2), 'utf8');
  await pushCloudState({ schedule: sched, scheduleUpdatedAt: sched.updatedAtTs }).catch(() => {});
  return { success: true, event: newEvent, googleSynced };
}

function deleteCalendarEvent(eventId) {
  let sched = ensureDefaultSchedule();
  sched.deletedEventIds = sched.deletedEventIds || [];
  if (eventId && !sched.deletedEventIds.includes(eventId)) {
    sched.deletedEventIds.push(eventId);
  }
  sched.customEvents = (sched.customEvents || []).filter(e => e.id !== eventId);
  if (sched.weekSchedule) {
    for (const k of Object.keys(sched.weekSchedule)) {
      sched.weekSchedule[k] = sched.weekSchedule[k].filter(e => e.id !== eventId);
    }
  }
  sched.events = (sched.events || []).filter(e => e.id !== eventId);
  sched.updatedAt = new Date().toISOString();
  sched.updatedAtTs = Date.now();
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(sched, null, 2), 'utf8');
  pushCloudState({ schedule: sched, scheduleUpdatedAt: sched.updatedAtTs }).catch(() => {});
  return { success: true };
}

module.exports = {
  TARGET_ACCOUNT,
  syncCalendar,
  syncIcalFeed,
  getGoogleAuthUrl,
  handleTokenExchange,
  addCalendarEvent,
  deleteCalendarEvent,
  getNext7DaysKeys,
  getUpcomingDaysKeys
};
