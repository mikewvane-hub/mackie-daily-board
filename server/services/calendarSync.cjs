const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

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

function getNext7DaysKeys() {
  const now = new Date();
  const keys = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
    keys.push(dateStr);
  }
  return keys;
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
  }

  const parsedEvents = [];
  for (const raw of rawEvents) {
    let dateStr = '';
    let timeStr = '09:00';
    let endTimeStr = '10:00';

    if (raw.dtstart.length === 8) {
      dateStr = `${raw.dtstart.slice(0, 4)}-${raw.dtstart.slice(4, 6)}-${raw.dtstart.slice(6, 8)}`;
      timeStr = 'ALL DAY';
      endTimeStr = '';
    } else {
      const cleanStart = raw.dtstart.replace(/[^0-9TZ]/g, '');
      let sDate = null;
      if (cleanStart.endsWith('Z')) {
        const y = parseInt(cleanStart.slice(0, 4));
        const m = parseInt(cleanStart.slice(4, 6)) - 1;
        const d = parseInt(cleanStart.slice(6, 8));
        const h = parseInt(cleanStart.slice(9, 11));
        const min = parseInt(cleanStart.slice(11, 13));
        const s = parseInt(cleanStart.slice(13, 15)) || 0;
        sDate = new Date(Date.UTC(y, m, d, h, min, s));
      } else {
        const y = parseInt(cleanStart.slice(0, 4));
        const m = parseInt(cleanStart.slice(4, 6)) - 1;
        const d = parseInt(cleanStart.slice(6, 8));
        const h = parseInt(cleanStart.slice(9, 11));
        const min = parseInt(cleanStart.slice(11, 13));
        sDate = new Date(y, m, d, h, min);
      }

      if (sDate && !isNaN(sDate.getTime())) {
        dateStr = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(sDate);
        timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        }).format(sDate);
      }

      if (raw.dtend) {
        const cleanEnd = raw.dtend.replace(/[^0-9TZ]/g, '');
        let eDate = null;
        if (cleanEnd.endsWith('Z')) {
          const y = parseInt(cleanEnd.slice(0, 4));
          const m = parseInt(cleanEnd.slice(4, 6)) - 1;
          const d = parseInt(cleanEnd.slice(6, 8));
          const h = parseInt(cleanEnd.slice(9, 11));
          const min = parseInt(cleanEnd.slice(11, 13));
          const s = parseInt(cleanEnd.slice(13, 15)) || 0;
          eDate = new Date(Date.UTC(y, m, d, h, min, s));
        } else {
          const y = parseInt(cleanEnd.slice(0, 4));
          const m = parseInt(cleanEnd.slice(4, 6)) - 1;
          const d = parseInt(cleanEnd.slice(6, 8));
          const h = parseInt(cleanEnd.slice(9, 11));
          const min = parseInt(cleanEnd.slice(11, 13));
          eDate = new Date(y, m, d, h, min);
        }
        if (eDate && !isNaN(eDate.getTime())) {
          endTimeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }).format(eDate);
        }
      }
    }

    const summary = raw.summary || 'Calendar Event';
    let category = 'personal';
    if (/dr|doctor|ob|pediatric|appointment|clinic|hospital|dentist/i.test(summary)) category = 'Appointment';
    else if (/work|shift|meeting|retina|clinic/i.test(summary)) category = 'Work';
    else if (/dinner|lunch|breakfast|brunch|party|family|date/i.test(summary)) category = 'Family';

    parsedEvents.push({
      id: raw.uid || `ical-${parsedEvents.length + 1}`,
      date: dateStr,
      time: timeStr,
      endTime: endTimeStr,
      title: summary,
      location: raw.location || '',
      category,
      notes: raw.description ? raw.description.slice(0, 180) : ''
    });
  }

  return parsedEvents;
}

async function syncIcalFeed(icalUrl) {
  try {
    console.log(`[MackieCalendarSync] Fetching iCal feed for ${TARGET_ACCOUNT}...`);
    const res = await fetch(icalUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const icsText = await res.text();
    const events = parseIcsEvents(icsText);

    let existing = {};
    if (fs.existsSync(SCHEDULE_FILE)) {
      try { existing = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); } catch (e) {}
    }

    // Keep any custom events added directly on the dashboard
    const customEvents = (existing.customEvents || []);
    const allEvents = [...events, ...customEvents];

    const weekKeys = getNext7DaysKeys();
    const weekSchedule = {};
    for (const k of weekKeys) {
      weekSchedule[k] = [];
    }

    for (const evt of allEvents) {
      if (evt.date) {
        if (!weekSchedule[evt.date]) {
          weekSchedule[evt.date] = [];
        }
        if (!weekSchedule[evt.date].some(e => e.id === evt.id || (e.title === evt.title && e.time === evt.time))) {
          weekSchedule[evt.date].push(evt);
          weekSchedule[evt.date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        }
      }
    }

    const todayStr = weekKeys[0];
    const todayEvents = weekSchedule[todayStr] || [];

    const scheduleData = {
      events: todayEvents,
      weekSchedule,
      customEvents,
      lastSynced: new Date().toISOString(),
      source: 'Google Calendar (Live iCal Sync)',
      account: TARGET_ACCOUNT,
      authorized: true
    };

    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2), 'utf8');
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
        const customEvents = existing.customEvents || [];
        const allEvents = [...parsedEvents, ...customEvents];

        const weekKeys = getNext7DaysKeys();
        const weekSchedule = {};
        for (const k of weekKeys) weekSchedule[k] = [];
        for (const evt of allEvents) {
          if (evt.date) {
            weekSchedule[evt.date] = weekSchedule[evt.date] || [];
            if (!weekSchedule[evt.date].some(e => e.id === evt.id)) {
              weekSchedule[evt.date].push(evt);
              weekSchedule[evt.date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
            }
          }
        }

        const scheduleData = {
          events: weekSchedule[weekKeys[0]] || [],
          weekSchedule,
          customEvents,
          lastSynced: new Date().toISOString(),
          source: `Google Calendar (${TARGET_ACCOUNT})`,
          account: TARGET_ACCOUNT,
          authorized: true
        };
        fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2), 'utf8');
        return scheduleData;
      }
    } catch (err) {
      console.error('[MackieCalendarSync] Google API sync error:', err.message);
    }
  }

  return ensureDefaultSchedule();
}

function ensureDefaultSchedule() {
  const weekKeys = getNext7DaysKeys();
  let existing = null;
  if (fs.existsSync(SCHEDULE_FILE)) {
    try { existing = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); } catch (e) {}
  }

  const customEvents = existing?.customEvents || [];
  const weekSchedule = { ...(existing?.weekSchedule || {}) };
  for (const k of weekKeys) {
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

  const scheduleData = {
    events: weekSchedule[weekKeys[0]] || [],
    weekSchedule,
    customEvents,
    lastSynced: existing?.lastSynced || null,
    source: existing?.authorized ? existing.source : 'Local Schedule + Ready for Google Calendar Sync',
    account: TARGET_ACCOUNT,
    authorized: Boolean(existing?.authorized)
  };

  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2), 'utf8');
  return scheduleData;
}

async function addCalendarEvent(eventData) {
  const token = await getAccessToken();
  const dateStr = eventData.date || getNext7DaysKeys()[0];
  const startTime = eventData.time || '09:00';
  const endTime = eventData.endTime || '10:00';

  let googleId = null;
  let googleSynced = false;

  if (token && startTime !== 'ALL DAY') {
    try {
      const payload = {
        summary: eventData.title || 'New Event',
        location: eventData.location || '',
        description: eventData.notes || '',
        start: {
          dateTime: `${dateStr}T${startTime}:00-04:00`,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: `${dateStr}T${endTime}:00-04:00`,
          timeZone: 'America/New_York'
        }
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
    endTime: startTime === 'ALL DAY' ? '' : endTime,
    title: eventData.title || 'New Event',
    location: eventData.location || '',
    category: eventData.category || 'Personal',
    notes: eventData.notes || '',
    googleSynced
  };

  let sched = ensureDefaultSchedule();
  sched.customEvents = sched.customEvents || [];
  sched.customEvents.push(newEvent);
  sched.weekSchedule = sched.weekSchedule || {};
  sched.weekSchedule[dateStr] = sched.weekSchedule[dateStr] || [];
  sched.weekSchedule[dateStr].push(newEvent);
  sched.weekSchedule[dateStr].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const todayKey = getNext7DaysKeys()[0];
  sched.events = sched.weekSchedule[todayKey] || [];

  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(sched, null, 2), 'utf8');
  return { success: true, event: newEvent, googleSynced };
}

function deleteCalendarEvent(eventId) {
  let sched = ensureDefaultSchedule();
  sched.customEvents = (sched.customEvents || []).filter(e => e.id !== eventId);
  if (sched.weekSchedule) {
    for (const k of Object.keys(sched.weekSchedule)) {
      sched.weekSchedule[k] = sched.weekSchedule[k].filter(e => e.id !== eventId);
    }
  }
  sched.events = (sched.events || []).filter(e => e.id !== eventId);
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(sched, null, 2), 'utf8');
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
  getNext7DaysKeys
};
