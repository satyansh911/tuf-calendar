'use client';

import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, Clock3, Upload } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import NotesSection from './NotesSection';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface SeasonalBackground {
  name: 'Winter' | 'Spring' | 'Summer' | 'Autumn';
  color: string;
}

interface ThemePalette {
  name: 'cool' | 'warm' | 'forest';
  startBg: string;
  startBorder: string;
  rangeBg: string;
  rangeBorder: string;
  rangeText: string;
  chipBg: string;
  chipBorder: string;
}

const PALETTES: Record<ThemePalette['name'], ThemePalette> = {
  cool: {
    name: 'cool',
    startBg: '#7c3aed',
    startBorder: '#c4b5fd',
    rangeBg: '#93c5fd',
    rangeBorder: '#dbeafe',
    rangeText: '#0b1220',
    chipBg: 'rgba(30, 64, 175, 0.35)',
    chipBorder: 'rgba(147, 197, 253, 0.45)',
  },
  warm: {
    name: 'warm',
    startBg: '#db2777',
    startBorder: '#f9a8d4',
    rangeBg: '#fcd34d',
    rangeBorder: '#fde68a',
    rangeText: '#1a1206',
    chipBg: 'rgba(180, 83, 9, 0.35)',
    chipBorder: 'rgba(253, 186, 116, 0.45)',
  },
  forest: {
    name: 'forest',
    startBg: '#16a34a',
    startBorder: '#86efac',
    rangeBg: '#bef264',
    rangeBorder: '#d9f99d',
    rangeText: '#11260f',
    chipBg: 'rgba(22, 101, 52, 0.35)',
    chipBorder: 'rgba(134, 239, 172, 0.45)',
  },
};

const SEASONAL_BACKGROUNDS: SeasonalBackground[] = [
  {
    name: 'Winter',
    color: '#07111d',
  },
  {
    name: 'Spring',
    color: '#0b1a14',
  },
  {
    name: 'Summer',
    color: '#1a1008',
  },
  {
    name: 'Autumn',
    color: '#170c08',
  },
];

const PARTICLE_STOPS = Array.from({ length: 26 }, (_, i) => 2 + i * 3.7);

const toHsl = (r: number, g: number, b: number) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return { hue: hue * 360, saturation, lightness };
};

export default function Calendar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const calendarPanelRef = useRef<HTMLDivElement>(null);
  const navDirectionRef = useRef<1 | -1>(1);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<string>('');
  const [heroImage, setHeroImage] = useState<string>('/seasons.gif');
  const [now, setNow] = useState<Date>(new Date());
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [themePalette, setThemePalette] = useState<ThemePalette>(PALETTES.cool);
  const [seasonBgIndex, setSeasonBgIndex] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('calendarData');
    if (saved) {
      const {
        dateRange: savedRange,
        notes: savedNotes,
        currentDate: savedDate,
        heroImage: savedHeroImage,
        lastSynced: savedLastSynced,
      } = JSON.parse(saved);
      window.requestAnimationFrame(() => {
        if (savedRange.start) savedRange.start = new Date(savedRange.start);
        if (savedRange.end) savedRange.end = new Date(savedRange.end);
        setDateRange(savedRange);
        setNotes(savedNotes);
        if (savedDate) setCurrentDate(new Date(savedDate));
        if (savedHeroImage) setHeroImage(savedHeroImage);
        if (savedLastSynced) setLastSynced(new Date(savedLastSynced));
      });
    }
  }, []);

  // Keep a live clock in the top bar.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Loop full-page seasonal background every 5s.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeasonBgIndex((prev) => (prev + 1) % SEASONAL_BACKGROUNDS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  // Save to localStorage and update sync metadata.
  useEffect(() => {
    const syncedAt = new Date();
    localStorage.setItem('calendarData', JSON.stringify({
      dateRange,
      notes,
      currentDate,
      heroImage,
      lastSynced: syncedAt.toISOString(),
    }));
    window.requestAnimationFrame(() => {
      setLastSynced(syncedAt);
    });
  }, [dateRange, notes, currentDate, heroImage]);

  // Initial page-load animations.
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.animate-shell', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.from('.animate-chip', {
        opacity: 0,
        y: -10,
        duration: 0.45,
        stagger: 0.08,
        delay: 0.25,
        ease: 'power2.out',
      });

      gsap.fromTo('.calendar-day[data-day="filled"]', {
        opacity: 0,
        y: 12,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.012,
        delay: 0.35,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Re-run a subtle stagger when month changes.
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.calendar-day[data-day="filled"]',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.34,
          stagger: 0.01,
          ease: 'power1.out',
          clearProps: 'opacity,transform',
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [currentDate]);

  // Calendar flip animation when month changes.
  useEffect(() => {
    if (!calendarPanelRef.current) return;

    gsap.fromTo(
      calendarPanelRef.current,
      {
        rotateX: -20,
        rotateY: navDirectionRef.current * 8,
        opacity: 0.75,
        transformPerspective: 1000,
        transformOrigin: '50% 0%',
      },
      {
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      }
    );
  }, [currentDate]);

  // Theme palette switches automatically based on dominant hero-image hue.
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = heroImage;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 48;
      const height = 48;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const { data } = ctx.getImageData(0, 0, width, height);
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count += 1;
      }

      if (count === 0) return;

      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);
      const { hue, saturation } = toHsl(avgR, avgG, avgB);

      if (saturation < 0.12) {
        setThemePalette(PALETTES.cool);
      } else if (hue >= 70 && hue <= 165) {
        setThemePalette(PALETTES.forest);
      } else if (hue >= 170 && hue <= 260) {
        setThemePalette(PALETTES.cool);
      } else {
        setThemePalette(PALETTES.warm);
      }
    };
  }, [heroImage]);

  const handlePrevMonth = () => {
    navDirectionRef.current = -1;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    navDirectionRef.current = 1;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (dateRange.start === null) {
      // First click - set start date
      setDateRange({ start: clickedDate, end: null });
    } else if (dateRange.end === null) {
      // Second click - set end date
      if (clickedDate < dateRange.start) {
        // If clicked date is before start, swap them
        setDateRange({ start: clickedDate, end: dateRange.start });
      } else {
        setDateRange({ ...dateRange, end: clickedDate });
      }
    } else {
      // Third click - reset and start new range
      setDateRange({ start: clickedDate, end: null });
    }
  };

  const handleClearSelection = () => {
    setDateRange({ start: null, end: null });
  };

  const handleSelectSavedRange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    setCurrentDate(new Date(start.getFullYear(), start.getMonth(), 1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setHeroImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const lastSyncedText = lastSynced
    ? lastSynced.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Not synced yet';
  const heroMonth = currentDate.toLocaleString('default', { month: 'long' });
  const heroYear = currentDate.getFullYear();
  const monthSeason = ['Winter', 'Spring', 'Summer', 'Fall'][Math.floor((currentDate.getMonth() % 12) / 3)];

  const holidays = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const map: Record<number, string> = {};
    const list = [
      { m: 1, d: 1, name: "New Year's Day" },
      { m: 2, d: 14, name: "Valentine's Day" },
      { m: 3, d: 17, name: "St. Patrick's Day" },
      { m: 4, d: 22, name: 'Earth Day' },
      { m: 7, d: 4, name: 'Independence Day' },
      { m: 10, d: 31, name: 'Halloween' },
      { m: 11, d: 11, name: 'Veterans Day' },
      { m: 12, d: 25, name: 'Christmas Day' },
    ];

    list.forEach((holiday) => {
      if (holiday.m === month) {
        map[holiday.d] = `${holiday.name} ${year}`;
      }
    });

    return map;
  })();

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-y-auto bg-[#05070a] px-2 py-2 md:h-screen md:overflow-hidden md:px-5 md:py-4"
    >
      <div className="pointer-events-none absolute inset-0">
        {SEASONAL_BACKGROUNDS.map((background, index) => (
          <div
            key={background.name}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === seasonBgIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: background.color }}
          >
            {background.name === 'Winter' && (
              <div className="absolute inset-0 overflow-hidden">
                {PARTICLE_STOPS.map((leftStop, i) => (
                  <span
                    key={`snow-${i}`}
                    className="season-snowflake"
                    style={{
                      left: `${leftStop}%`,
                      animationDelay: `-${(i % 9) * 0.22}s`,
                      animationDuration: `${2.2 + (i % 4) * 0.45}s`,
                      opacity: `${0.45 + (i % 4) * 0.12}`,
                    }}
                  />
                ))}
              </div>
            )}

            {background.name === 'Spring' && (
              <div className="absolute inset-0 overflow-hidden">
                {PARTICLE_STOPS.map((leftStop, i) => (
                  <span
                    key={`petal-${i}`}
                    className="season-petal"
                    style={{
                      left: `${leftStop}%`,
                      animationDelay: `-${(i % 8) * 0.24}s`,
                      animationDuration: `${2.4 + (i % 4) * 0.5}s`,
                      opacity: `${0.5 + (i % 3) * 0.13}`,
                    }}
                  />
                ))}
              </div>
            )}

            {background.name === 'Summer' && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="season-sun" />
                <div className="season-sun-rays">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={`ray-${i}`}
                      className="season-sun-ray"
                      style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {background.name === 'Autumn' && (
              <div className="absolute inset-0 overflow-hidden">
                {PARTICLE_STOPS.map((leftStop, i) => (
                  <span
                    key={`leaf-${i}`}
                    className="season-leaf"
                    style={{
                      left: `${leftStop}%`,
                      animationDelay: `-${(i % 9) * 0.2}s`,
                      animationDuration: `${2.35 + (i % 4) * 0.5}s`,
                      opacity: `${0.5 + (i % 4) * 0.1}`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md md:bottom-4 md:left-5">
        Season: {SEASONAL_BACKGROUNDS[seasonBgIndex].name}
      </div>

      <div className="animate-shell relative z-10 mx-auto grid max-w-6xl gap-3 md:h-full md:gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="grid grid-rows-[auto_1fr] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f14]/85 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:h-full">
          <div className="relative h-24 overflow-hidden md:h-36">
            <NextImage
              src={heroImage}
              alt="Calendar hero"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              unoptimized
              className="object-cover"
              onError={() => setHeroImage('/seasons.gif')}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-[#0b0f14]" />

            <div className="absolute left-2 top-2 max-w-[58%] rounded-2xl border border-white/20 bg-black/35 px-3 py-2 backdrop-blur-md md:left-4 md:top-4 md:max-w-none md:px-4 md:py-3">
              <p className="text-3xl font-extrabold leading-none tracking-tight text-white md:text-5xl">{heroMonth}</p>
              <p className="mt-1 text-sm font-semibold text-white/85 md:text-lg">{heroYear} • {monthSeason}</p>
            </div>

            <div className="absolute bottom-2 right-2 flex max-w-[42%] flex-col items-end gap-1 md:right-4 md:top-4 md:bottom-auto md:max-w-none md:flex-row md:flex-wrap md:items-start md:gap-2">
              <div
                className="animate-chip rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{
                  backgroundColor: themePalette.chipBg,
                  border: `1px solid ${themePalette.chipBorder}`,
                }}
              >
                <Clock3 className="mr-1 inline h-3.5 w-3.5" />
                Time {currentTime}
              </div>
              <div
                className="animate-chip rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{
                  backgroundColor: themePalette.chipBg,
                  border: `1px solid ${themePalette.chipBorder}`,
                }}
              >
                Last synced {lastSyncedText}
              </div>
            </div>

            <label className="absolute bottom-3 right-3 animate-chip cursor-pointer rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-black/60">
              <Upload className="mr-1 inline h-3.5 w-3.5" />
              Change image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div ref={calendarPanelRef} className="flex min-h-0 flex-col border-t border-white/10 px-3 py-2 md:h-full md:px-5 md:py-3">
            <div className="mb-1.5 flex items-center justify-between gap-2 md:mb-2">
              <div className="flex items-center gap-2">
                <div className="animate-chip rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-base font-semibold text-white md:px-3 md:py-1.5 md:text-lg">
                  {currentDate.toLocaleString('default', { month: 'long' })}
                </div>
                <div className="animate-chip rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-base font-semibold text-white/90 md:px-3 md:py-1.5 md:text-lg">
                  {currentDate.getFullYear()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white transition hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white transition hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mb-1.5 text-[11px] tracking-wide text-white/55 md:mb-2 md:text-xs">{monthYear}</p>

            <div className="min-h-0 flex-1">
              <CalendarGrid
                currentDate={currentDate}
                dateRange={dateRange}
                onDateClick={handleDateClick}
                holidays={holidays}
                themePalette={themePalette}
              />
            </div>
          </div>
        </section>

        <aside className="animate-shell lg:h-full lg:min-h-0">
          <NotesSection
            notes={notes}
            setNotes={setNotes}
            dateRange={dateRange}
            onClearSelection={handleClearSelection}
            onSelectSavedRange={handleSelectSavedRange}
            currentTime={currentTime}
            lastSyncedText={lastSyncedText}
          />
        </aside>
      </div>
    </div>
  );
}
