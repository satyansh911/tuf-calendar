'use client';

import React, { useMemo } from 'react';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface CalendarGridProps {
  currentDate: Date;
  dateRange: DateRange;
  onDateClick: (day: number) => void;
  holidays: Record<number, string>;
  themePalette: {
    startBg: string;
    startBorder: string;
    rangeBg: string;
    rangeBorder: string;
    rangeText: string;
  };
}

export default function CalendarGrid({
  currentDate,
  dateRange,
  onDateClick,
  holidays,
  themePalette,
}: CalendarGridProps) {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create array of calendar days
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts (adjust for Monday start)
    const startEmpty = (firstDay + 6) % 7; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    for (let i = 0; i < startEmpty; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentDate]);

  const weekCount = Math.ceil(calendarDays.length / 7);

  const toDayStamp = (d: Date): number =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const getDayStamp = (day: number | null): number | null => {
    if (!day) return null;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getTime();
  };

  const isDateInRange = (day: number | null): boolean => {
    if (!day || !dateRange.start || !dateRange.end) return false;
    const stamp = getDayStamp(day);
    if (!stamp) return false;

    const startStamp = toDayStamp(dateRange.start);
    const endStamp = toDayStamp(dateRange.end);

    return stamp > startStamp && stamp < endStamp;
  };

  const isStartDate = (day: number | null): boolean => {
    if (!day || !dateRange.start) return false;
    return (
      day === dateRange.start.getDate() &&
      currentDate.getMonth() === dateRange.start.getMonth() &&
      currentDate.getFullYear() === dateRange.start.getFullYear()
    );
  };

  const isEndDate = (day: number | null): boolean => {
    if (!day || !dateRange.end) return false;
    return (
      day === dateRange.end.getDate() &&
      currentDate.getMonth() === dateRange.end.getMonth() &&
      currentDate.getFullYear() === dateRange.end.getFullYear()
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Day of week headers */}
      <div className="mb-1.5 grid grid-cols-7 gap-1 md:gap-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="py-0.5 text-center text-[10px] font-semibold tracking-wider text-white/45 md:py-1 md:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid flex-1 grid-cols-7 gap-1 md:gap-2"
        style={{ gridTemplateRows: `repeat(${weekCount}, minmax(0, 1fr))` }}
      >
        {calendarDays.map((day, index) => {
          const inRange = isDateInRange(day);
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);
          const isHoliday = Boolean(day && holidays[day]);
          const holidayLabel = day ? holidays[day] : '';

          const stateStyle = isStart || isEnd
            ? {
              backgroundColor: themePalette.startBg,
              borderColor: themePalette.startBorder,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.12), 0 10px 30px ${themePalette.startBg}66`,
              color: '#ffffff',
            }
            : inRange
              ? {
                backgroundColor: themePalette.rangeBg,
                borderColor: themePalette.rangeBorder,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.14), 0 8px 24px ${themePalette.rangeBg}66`,
                color: themePalette.rangeText,
              }
              : undefined;

          return (
            <button
              key={index}
              onClick={() => day && onDateClick(day)}
              disabled={!day}
              data-day={day ? 'filled' : 'empty'}
              title={holidayLabel || undefined}
              style={stateStyle}
              className={`
                calendar-day relative h-full min-h-[2.25rem] rounded-xl border text-sm font-semibold transition-all duration-200 md:min-h-[2.65rem] md:rounded-2xl md:text-base
                ${
                  !day
                    ? 'cursor-default border-transparent bg-transparent text-white/15'
                    : 'cursor-pointer border-white/12 bg-white/8 text-white hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/14'
                }
              `}
            >
              {isHoliday && day ? (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-300 shadow-[0_0_8px_rgba(251,113,133,0.85)]" />
              ) : null}

              {day}

              {isHoliday && day ? (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-medium lowercase tracking-tight text-rose-200/95 md:bottom-1 md:text-[10px] md:tracking-normal">
                  holiday
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
