'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface SavedRangeNote {
  title: string;
  info: string;
}

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
  dateRange: DateRange;
  onClearSelection: () => void;
  onSelectSavedRange: (start: Date, end: Date) => void;
  currentTime: string;
  lastSyncedText: string;
}

export default function NotesSection({
  notes,
  setNotes,
  dateRange,
  onClearSelection,
  onSelectSavedRange,
  currentTime,
  lastSyncedText,
}: NotesSectionProps) {
  const [rangeNotes, setRangeNotes] = useState<Map<string, SavedRangeNote>>(new Map());
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState<string>('');

  // Load range notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rangeNotes');
    if (saved) {
      const parsed = JSON.parse(saved) as Array<[string, string | SavedRangeNote]>;
      const normalized = new Map<string, SavedRangeNote>();

      for (const [key, value] of parsed) {
        if (typeof value === 'string') {
          normalized.set(key, {
            title: 'Saved Note',
            info: value,
          });
        } else {
          normalized.set(key, {
            title: value.title || 'Saved Note',
            info: value.info || '',
          });
        }
      }

      window.requestAnimationFrame(() => {
        setRangeNotes(normalized);
      });
    }
  }, []);

  // Save range notes to localStorage
  useEffect(() => {
    localStorage.setItem('rangeNotes', JSON.stringify(Array.from(rangeNotes.entries())));
  }, [rangeNotes]);

  const formatLocalDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getRangeKey = (): string | null => {
    if (!dateRange.start || !dateRange.end) return null;
    const start = formatLocalDateKey(dateRange.start);
    const end = formatLocalDateKey(dateRange.end);
    return `${start}_${end}`;
  };

  const handleSaveRangeNote = () => {
    const key = getRangeKey();
    const trimmedInfo = notes.trim();
    const trimmedTitle = noteTitle.trim() || 'Saved Note';

    if (key && trimmedInfo) {
      const existing = rangeNotes.get(key);
      if (existing && existing.title.trim() === trimmedTitle && existing.info.trim() === trimmedInfo) {
        setSaveFeedback('Identical item already exists for this range.');
        return;
      }

      const newNotes = new Map(rangeNotes);
      newNotes.set(key, {
        title: trimmedTitle,
        info: trimmedInfo,
      });
      setRangeNotes(newNotes);
      setSaveFeedback(existing ? 'Saved item updated for this range.' : 'New item saved for this range.');
    }
  };

  const handleLoadRangeNote = () => {
    const key = getRangeKey();
    if (key && rangeNotes.has(key)) {
      const item = rangeNotes.get(key);
      if (!item) return;
      setNotes(item.info);
      setNoteTitle(item.title);
      setSaveFeedback('Loaded saved item for current selected range.');
    } else {
      setSaveFeedback('No saved item found for current selected range.');
    }
  };

  const handleDeleteRangeNote = () => {
    const key = getRangeKey();
    if (key) {
      const newNotes = new Map(rangeNotes);
      newNotes.delete(key);
      setRangeNotes(newNotes);
      setNotes('');
      setNoteTitle('');
      setSaveFeedback('Saved item deleted for current selected range.');
    }
  };

  const parseRangeKey = (key: string): { start: Date; end: Date } | null => {
    const parts = key.split('_');
    if (parts.length !== 2) return null;

    const parseLocalDate = (value: string): Date | null => {
      const dateParts = value.split('-').map(Number);
      if (dateParts.length !== 3) return null;
      const [year, month, day] = dateParts;
      if (!year || !month || !day) return null;
      return new Date(year, month - 1, day);
    };

    const start = parseLocalDate(parts[0]);
    const end = parseLocalDate(parts[1]);
    if (!start || !end) return null;

    return { start, end };
  };

  const handleLoadByKey = (key: string) => {
    const item = rangeNotes.get(key);
    if (!item) return;

    setNotes(item.info);
    setNoteTitle(item.title);
    const parsed = parseRangeKey(key);
    if (parsed) {
      onSelectSavedRange(parsed.start, parsed.end);
    }
    setSaveFeedback('Loaded item. You can now edit title/info and save to update.');
  };

  const handleDeleteByKey = (key: string) => {
    const newNotes = new Map(rangeNotes);
    newNotes.delete(key);
    setRangeNotes(newNotes);
    if (rangeKey === key) {
      setNotes('');
      setNoteTitle('');
    }
    setSaveFeedback('Saved item deleted.');
  };

  const rangeKey = getRangeKey();
  const hasRangeNote = Boolean(rangeKey && rangeNotes.has(rangeKey));

  return (
    <div className="flex h-auto min-h-0 flex-col overflow-visible rounded-3xl border border-white/10 bg-[#090c11]/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:h-full lg:overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-white/90">Notes & Schedule</h3>
      </div>

      <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 text-[11px] text-white/65">
        <p>Time: <span className="font-semibold text-white/85">{currentTime}</span></p>
        <p className="mt-1">Last synced: <span className="font-semibold text-white/85">{lastSyncedText}</span></p>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-white/80">Selected range</p>
        {dateRange.start && (
          <span className="rounded-full border border-cyan-300/25 bg-cyan-400/15 px-2.5 py-1 text-[11px] font-medium text-cyan-100">
            {dateRange.end
              ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
              : dateRange.start.toLocaleDateString()}
          </span>
        )}
      </div>

      {!dateRange.start && (
        <p className="mb-3 text-xs text-white/45">Select a date or range from the calendar.</p>
      )}

      <input
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        placeholder="Item title (editable when loading saved item)"
        className="mb-2 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-violet-300/40 focus:outline-none"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write quick notes, reminders, or plan details (info)..."
        className="h-24 w-full resize-none rounded-2xl border border-white/15 bg-black/25 p-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-300/40 focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setNotes('')}
          className="rounded-xl border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/16"
        >
          Clear
        </button>

        <button
          onClick={onClearSelection}
          className="rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/20"
        >
          Clear Range
        </button>

        {dateRange.start && (
          <>
            <button
              onClick={handleSaveRangeNote}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                notes.trim()
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'cursor-not-allowed bg-white/10 text-white/35'
              }`}
              disabled={!notes.trim()}
            >
              Save/Update Range
            </button>

            {hasRangeNote && (
              <>
                <button
                  onClick={handleLoadRangeNote}
                  className="rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/25"
                >
                  Load Saved
                </button>
                <button
                  onClick={handleDeleteRangeNote}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-300/30 bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/25"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            )}
          </>
        )}
      </div>

      {hasRangeNote && (
        <div className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-2.5">
          <p className="text-xs text-emerald-200">
            ✓ Item exists for this selected range
          </p>
        </div>
      )}

      {saveFeedback && (
        <div className="mt-2 rounded-xl border border-violet-300/20 bg-violet-500/10 p-2.5">
          <p className="text-xs text-violet-200">{saveFeedback}</p>
        </div>
      )}

      {/* Saved Notes Preview */}
      <div className="mt-3 min-h-0 flex-1 border-t border-white/10 pt-3">
        <h4 className="mb-2 text-sm font-semibold text-white/80">Saved Items</h4>
        {rangeNotes.size > 0 ? (
          <div className="space-y-2 overflow-y-visible pr-1 lg:h-full lg:overflow-y-auto">
            {Array.from(rangeNotes.entries()).map(([key, note]) => (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLoadByKey(key)}
                    className="text-left font-medium text-white/85 transition hover:text-cyan-200"
                  >
                    {key.replace('_', ' to ')}
                  </button>
                  <button
                    onClick={() => handleDeleteByKey(key)}
                    className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-2 py-1 text-[11px] font-medium text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
                <p className="line-clamp-1 text-xs font-medium text-white/80">{note.title}</p>
                <p className="line-clamp-2 text-xs text-white/60">{note.info}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/35">No saved schedule items yet.</p>
        )}
      </div>
    </div>
  );
}
