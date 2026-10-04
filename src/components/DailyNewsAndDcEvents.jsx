import React, { useState, useEffect } from 'react';
import {
  Landmark,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Calendar,
  Compass,
  Plus,
  Clock,
  X
} from 'lucide-react';
import { CutesyBadgeDoodle } from './SquigglyDecorations';
import { API_BASE } from '../apiBase.js';

/**
 * Helper to build a Google Calendar event creation URL targeted at amblair92@gmail.com
 */
function buildGoogleCalendarTemplateUrl({ title, date, time, endTime, location, notes }) {
  const cleanDate = String(date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const cleanStart = String(time || '11:00').replace(':', '') + '00';
  const cleanEnd = String(endTime || '13:00').replace(':', '') + '00';
  const datesParam = `${cleanDate}T${cleanStart}/${cleanDate}T${cleanEnd}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Downtown D.C. Outing',
    dates: datesParam,
    location: location || 'Washington, D.C.',
    details: notes || '',
    authuser: 'amblair92@gmail.com'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function DailyNewsAndDcEvents({
  theme,
  activeSeason,
  showToast,
  onCalendarUpdated
}) {
  const [newsData, setNewsData] = useState(null);
  const [dcData, setDcData] = useState(null);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [isCyclingDc, setIsCyclingDc] = useState(false);
  const [dcCycleOffset, setDcCycleOffset] = useState(0);

  // State for "Add D.C. Event to Calendar (amblair92@gmail.com)" modal
  const [schedulingEvent, setSchedulingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    endTime: '13:00',
    location: '',
    category: 'D.C. Outing',
    notes: '',
    openGoogleCalTab: false
  });
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/news`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data) setNewsData(data);
      })
      .catch(err => console.error('Error loading daily news:', err));

    fetch(`${API_BASE}/dc-recommendations?cycleOffset=0`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data) setDcData(data);
      })
      .catch(err => console.error('Error loading D.C. recommendations:', err));
  }, []);

  const handleRefreshNews = async () => {
    setIsRefreshingNews(true);
    try {
      const res = await fetch(`${API_BASE}/news/refresh`, { method: 'POST' });
      if (res.ok) {
        const fresh = await res.json();
        setNewsData(fresh);
        showToast('Verified & refreshed Top U.S. Policy & Daily News');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshingNews(false);
    }
  };

  const handleCycleDcRecommendations = async () => {
    const nextOffset = dcCycleOffset + 1;
    setDcCycleOffset(nextOffset);
    setIsCyclingDc(true);
    try {
      const res = await fetch(`${API_BASE}/dc-recommendations?cycleOffset=${nextOffset}`);
      if (res.ok) {
        const fresh = await res.json();
        setDcData(fresh);
        showToast('Cycled to next set of Downtown D.C. seasonal recommendations');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCyclingDc(false);
    }
  };

  const openScheduleModalForDcEvent = rec => {
    // Default to upcoming Saturday if today is a weekday, or today
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun..6=Sat
    const daysUntilSat = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;
    const defaultDateObj = new Date(now);
    defaultDateObj.setDate(now.getDate() + daysUntilSat);
    const yyyy = defaultDateObj.getFullYear();
    const mm = String(defaultDateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(defaultDateObj.getDate()).padStart(2, '0');
    const defaultDateStr = `${yyyy}-${mm}-${dd}`;

    setSchedulingEvent(rec);
    setEventForm({
      title: rec.title,
      date: defaultDateStr,
      time: '11:00',
      endTime: '13:00',
      location: rec.where || rec.neighborhood || 'Downtown Washington, D.C.',
      category: 'D.C. Outing',
      notes: `${rec.what}\n• When: ${rec.when}\n• Why: ${rec.why}\n• Event Page: ${rec.url}`,
      openGoogleCalTab: false
    });
  };

  const handleConfirmAddDcEvent = async e => {
    e.preventDefault();
    if (!eventForm.title.trim() || isSavingEvent) return;
    setIsSavingEvent(true);

    try {
      const res = await fetch(`${API_BASE}/calendar/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventForm.title.trim(),
          date: eventForm.date,
          time: eventForm.time,
          endTime: eventForm.endTime,
          location: eventForm.location.trim(),
          category: eventForm.category || 'D.C. Outing',
          notes: eventForm.notes.trim()
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (onCalendarUpdated && json.calendar) {
          onCalendarUpdated(json.calendar);
        }

        if (eventForm.openGoogleCalTab) {
          const gcalUrl = buildGoogleCalendarTemplateUrl(eventForm);
          window.open(gcalUrl, '_blank', 'noopener,noreferrer');
        }

        showToast(
          json.googleSynced
            ? `Added "${eventForm.title}" to Mackie's Calendar & synced to amblair92@gmail.com!`
            : `Added "${eventForm.title}" (${eventForm.date}) to Mackie's Calendar!`
        );
        setSchedulingEvent(null);
      }
    } catch (err) {
      console.error('Failed to add D.C. event to calendar:', err);
    } finally {
      setIsSavingEvent(false);
    }
  };

  // Helper quick date options for the modal (Today, Tomorrow, This Saturday, This Sunday)
  const quickDates = (() => {
    const base = new Date();
    const formatYMD = d => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    const todayStr = formatYMD(base);

    const tmrw = new Date(base);
    tmrw.setDate(base.getDate() + 1);

    const sat = new Date(base);
    const daysToSat = (6 - base.getDay() + 7) % 7 || 7;
    sat.setDate(base.getDate() + daysToSat);

    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);

    return [
      { label: 'Today', date: todayStr },
      { label: 'Tomorrow', date: formatYMD(tmrw) },
      { label: `Sat (${sat.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`, date: formatYMD(sat) },
      { label: `Sun (${sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`, date: formatYMD(sun) }
    ];
  })();

  const articles = newsData?.articles || [];
  const dcRecommendations = dcData?.recommendations || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* =================================================================== */}
      {/* LEFT 6 COLS: DAILY NEWS & U.S. POLICY BRIEFING (TOP 3-5 VERIFIED)   */}
      {/* =================================================================== */}
      <section
        aria-label="Daily U.S. Policy and Top News Briefing"
        className={`lg:col-span-6 ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
      >
        <div className={`flex items-start justify-between border-b ${theme.border} pb-3.5 gap-3 flex-wrap`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial text-xl sm:text-2xl font-semibold leading-tight">
                  Daily News &amp; U.S. Policy Briefing
                </h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.accentSoft}`}>
                  Top {articles.length || 5} Verified
                </span>
                <CutesyBadgeDoodle season={activeSeason} variant={2} />
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Auto-updated once daily at 07:00 AM EST • Deduplicated • Every article link HTTP verified
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshNews}
            disabled={isRefreshingNews}
            className={`px-3 py-1.5 rounded-xl border ${theme.border} ${theme.cardSubtle} hover:${theme.accentSoft} text-xs font-medium flex items-center gap-1.5 transition`}
            title="Verify all links and refresh stories now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingNews ? 'animate-spin' : ''}`} />
            <span>{isRefreshingNews ? 'Verifying...' : 'Verify & Refresh'}</span>
          </button>
        </div>

        {/* Articles List (Top 3-5) */}
        <div className="flex flex-col gap-3">
          {articles.length === 0 ? (
            <div className={`p-6 rounded-xl ${theme.cardSubtle} border ${theme.border} text-center text-xs ${theme.textSecondary}`}>
              Verifying live U.S. policy &amp; national news links...
            </div>
          ) : (
            articles.map((art, idx) => (
              <article
                key={art.id || idx}
                className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} flex flex-col gap-2.5 transition hover:border-[#CBBBA8]`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full ${theme.accentBg} text-white text-[11px] font-bold flex items-center justify-center`}>
                      {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.accentSoft}`}>
                      {art.category || 'U.S. Policy Update'}
                    </span>
                    <span className={`text-[11px] ${theme.textSecondary} font-medium`}>
                      {art.source}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Link Verified
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-editorial text-lg font-bold leading-snug text-[#2C2520]">
                  {art.title}
                </h3>

                {/* What Happened */}
                {art.whatHappened && art.whatHappened !== art.title && (
                  <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>
                    {art.whatHappened}
                  </p>
                )}

                {/* Why It Matters / Policy Significance */}
                <div className={`p-2.5 rounded-lg ${theme.cardBg} border ${theme.border} text-xs leading-relaxed`}>
                  <span className={`font-bold ${theme.accentText}`}>Why It Matters: </span>
                  <span className="text-[#2C2520]">{art.significance}</span>
                </div>

                {/* Verified Full Article Link */}
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] font-mono ${theme.textMuted}`}>
                    Daily 07:00 AM EST Edition
                  </span>
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${theme.accentText} hover:underline`}
                  >
                    <span>Read Full Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* RIGHT 6 COLS: DOWNTOWN D.C. WEEKLY & SEASONAL RECOMMENDATIONS (5Ws) */}
      {/* =================================================================== */}
      <section
        aria-label="Downtown Washington D.C. Weekly and Monthly Seasonal Recommendations"
        className={`lg:col-span-6 ${theme.cardBg} border ${theme.border} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4`}
      >
        <div className={`flex items-start justify-between border-b ${theme.border} pb-3.5 gap-3 flex-wrap`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${theme.cardSubtle} ${theme.accentText}`}>
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-editorial text-xl sm:text-2xl font-semibold leading-tight">
                  Downtown D.C. Seasonal &amp; Weekly Guide
                </h2>
                <CutesyBadgeDoodle season={activeSeason} variant={3} />
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Curated Washington, D.C. happenings with the 5 W&apos;s • Click &ldquo;Add to Calendar&rdquo; to schedule on Mackie&apos;s Calendar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCycleDcRecommendations}
            disabled={isCyclingDc}
            className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs`}
            title="Cycle to next weekly/monthly set of Downtown D.C. recommendations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCyclingDc ? 'animate-spin' : ''}`} />
            <span>Cycle D.C. Picks</span>
          </button>
        </div>

        {/* D.C. 5 W's Cards */}
        <div className="flex flex-col gap-3.5">
          {dcRecommendations.map(rec => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl ${theme.cardSubtle} border ${theme.border} flex flex-col gap-2.5 transition hover:border-[#CBBBA8]`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.accentSoft}`}>
                  {rec.timeframeBadge}
                </span>
                <span className={`text-[11px] font-medium ${theme.textSecondary} flex items-center gap-1`}>
                  <MapPin className={`w-3 h-3 ${theme.accentText}`} />
                  {rec.neighborhood}
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold leading-snug text-[#2C2520]">
                {rec.title}
              </h3>

              {/* The 5 W's Grid */}
              <div className={`p-3 rounded-xl ${theme.cardBg} border ${theme.border} space-y-1.5 text-xs`}>
                <div className="flex items-start gap-2">
                  <span className={`font-bold uppercase text-[10px] tracking-wider w-14 shrink-0 ${theme.accentText} mt-0.5`}>
                    WHAT:
                  </span>
                  <span className="text-[#2C2520] leading-snug">{rec.what}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className={`font-bold uppercase text-[10px] tracking-wider w-14 shrink-0 ${theme.accentText} mt-0.5`}>
                    WHEN:
                  </span>
                  <span className="text-[#2C2520] font-medium leading-snug">{rec.when}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className={`font-bold uppercase text-[10px] tracking-wider w-14 shrink-0 ${theme.accentText} mt-0.5`}>
                    WHERE:
                  </span>
                  <span className="text-[#2C2520] leading-snug">{rec.where}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className={`font-bold uppercase text-[10px] tracking-wider w-14 shrink-0 ${theme.accentText} mt-0.5`}>
                    WHO:
                  </span>
                  <span className={`${theme.textSecondary} leading-snug`}>{rec.who}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className={`font-bold uppercase text-[10px] tracking-wider w-14 shrink-0 ${theme.accentText} mt-0.5`}>
                    WHY:
                  </span>
                  <span className="text-[#2C2520] italic leading-snug">{rec.why}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-medium text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Official D.C. Event Page Verified
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openScheduleModalForDcEvent(rec)}
                    className={`px-3 py-1.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs`}
                    title="Choose date, time & details to add this D.C. event to Mackie's Calendar (amblair92@gmail.com)"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <Plus className="w-3 h-3 -ml-1" />
                    <span>Add to Calendar</span>
                  </button>

                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2.5 py-1.5 rounded-xl border ${theme.border} ${theme.cardBg} hover:${theme.accentSoft} inline-flex items-center gap-1.5 text-xs font-semibold ${theme.accentText} transition`}
                  >
                    <span>Event Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* MODAL: CHOOSE DATE & DETAILS TO ADD D.C. EVENT TO MACKIE'S CALENDAR */}
      {/* =================================================================== */}
      {schedulingEvent && (
        <div
          onClick={() => setSchedulingEvent(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`${theme.cardBg} ${theme.textPrimary} border ${theme.border} rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-start justify-between gap-3 border-b pb-3 border-[#E2D9CC]">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E5A43] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Add D.C. Event to Calendar (amblair92@gmail.com)</span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold mt-0.5">
                  {schedulingEvent.title}
                </h3>
                <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                  Recommended Window: <strong>{schedulingEvent.when}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingEvent(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddDcEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-sm outline-none focus:border-[#9E5A43]`}
                />
              </div>

              {/* Date Picker + Quick Date Shortcuts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="font-semibold">Choose Date</label>
                  <div className="flex items-center gap-1 flex-wrap">
                    {quickDates.map(qd => (
                      <button
                        key={qd.label}
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, date: qd.date })}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition ${
                          eventForm.date === qd.date
                            ? `${theme.accentBg} text-white border-transparent`
                            : `${theme.cardSubtle} ${theme.textSecondary} ${theme.border} hover:${theme.accentSoft}`
                        }`}
                      >
                        {qd.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="date"
                  required
                  value={eventForm.date}
                  onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-sm outline-none focus:border-[#9E5A43]`}
                />
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-sm outline-none focus:border-[#9E5A43]`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>End Time</span>
                  </label>
                  <input
                    type="time"
                    value={eventForm.endTime}
                    onChange={e => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-sm outline-none focus:border-[#9E5A43]`}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold mb-1">Location (Where)</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-sm outline-none focus:border-[#9E5A43]`}
                />
              </div>

              {/* Custom Details / Notes */}
              <div>
                <label className="block font-semibold mb-1">
                  Event Details &amp; Notes (Customize before adding)
                </label>
                <textarea
                  rows={4}
                  value={eventForm.notes}
                  onChange={e => setEventForm({ ...eventForm, notes: e.target.value })}
                  placeholder="Add any custom details, stroller notes, tickets, or reminders..."
                  className={`w-full px-3 py-2 rounded-xl ${theme.cardSubtle} border ${theme.border} text-xs leading-relaxed outline-none focus:border-[#9E5A43]`}
                />
              </div>

              {/* Direct Google Calendar (amblair92@gmail.com) Option */}
              <label
                className={`p-3 rounded-xl ${theme.cardSubtle} border ${theme.border} flex items-start gap-2.5 cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={eventForm.openGoogleCalTab}
                  onChange={e =>
                    setEventForm({ ...eventForm, openGoogleCalTab: e.target.checked })
                  }
                  className="mt-0.5 rounded accent-[#9E5A43]"
                />
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#2C2520]">
                    Also open pre-filled in Google Calendar (amblair92@gmail.com)
                  </div>
                  <div className={`text-[11px] ${theme.textSecondary}`}>
                    Saves immediately to Mackie&apos;s Daily &amp; Weekly Board Calendar (and syncs via Google OAuth if connected, or opens Google Calendar directly with these details).
                  </div>
                </div>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSchedulingEvent(null)}
                  className={`px-4 py-2 rounded-xl border ${theme.border} ${theme.cardSubtle} font-medium`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEvent}
                  className={`px-4 py-2 rounded-xl ${theme.accentBg} ${theme.accentHover} text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-60`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isSavingEvent ? 'Adding to Calendar...' : 'Add to Mackie’s Calendar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
