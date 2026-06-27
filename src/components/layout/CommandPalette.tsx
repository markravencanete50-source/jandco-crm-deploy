'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useShell } from '@/context/ShellContext';
import { ALL_NAV_ITEMS, COMMAND_PALETTE_ACTIONS } from '@/config/nav';
import { NavIcon } from './NavIcon';

interface PaletteEntry {
  id: string;
  label: string;
  subtitle?: string;
  href: string;
  group: string;
  icon?: React.ReactNode;
  shortcut?: string;
}

function buildEntries(query: string): PaletteEntry[] {
  const q = query.toLowerCase().trim();

  const navEntries: PaletteEntry[] = ALL_NAV_ITEMS.filter(
    (item: {id: string; label: string; href: string; icon: string; badge?: number | string}) => !q || item.label.toLowerCase().includes(q)
  ).map((item) => ({
    id: `nav-${item.id}`,
    label: item.label,
    href: item.href,
    group: 'Navigate',
    icon: <NavIcon id={item.icon} size={16} />,
  }));

  const actionEntries: PaletteEntry[] = COMMAND_PALETTE_ACTIONS.filter(
    (a) => !q || a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
  ).map((a) => ({
    id: `action-${a.id}`,
    label: a.label,
    href: a.href,
    group: a.group,
    shortcut: a.shortcut,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 3v10M3 8h10" />
      </svg>
    ),
  }));

  return [...actionEntries, ...navEntries];
}

function groupBy<T>(arr: T[], key: (item: T) => string): Map<string, T[]> {
  return arr.reduce((map: Map<string, T[]>, item: T) => {
    const k = key(item);
    map.set(k, [...(map.get(k) ?? []), item]);
    return map;
  }, new Map<string, T[]>());
}

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useShell();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const entries = buildEntries(query);
  const groups = groupBy(entries, (e) => e.group);

  const flatEntries: PaletteEntry[] = Array.from(groups.values()).flat();

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const navigate = useCallback(
    (entry: PaletteEntry) => {
      router.push(entry.href);
      closeCommandPalette();
    },
    [router, closeCommandPalette]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i: number) => Math.min(i + 1, flatEntries.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i: number) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const entry = flatEntries[activeIdx];
        if (entry) navigate(entry);
      }
    },
    [flatEntries, activeIdx, navigate]
  );

  if (!commandPaletteOpen) return null;

  let globalIdx = 0;

  return (
    <div className="cmdpal__overlay" onClick={closeCommandPalette}>
      <div
        className="cmdpal__modal"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="cmdpal__input-wrap">
          <svg className="cmdpal__search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="8" cy="8" r="5" />
            <path d="M12 12l4 4" />
          </svg>
          <input
            ref={inputRef}
            className="cmdpal__input"
            placeholder="Search pages, contacts, actions..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button className="cmdpal__clear" onClick={() => setQuery('')} aria-label="Clear search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div className="cmdpal__results" role="listbox">
          {flatEntries.length === 0 && (
            <div className="cmdpal__empty">No results for &ldquo;{query}&rdquo;</div>
          )}
          {Array.from(groups.entries()).map(([groupName, groupEntries]) => (
            <div key={groupName} className="cmdpal__group">
              <p className="cmdpal__group-label">{groupName}</p>
              {groupEntries.map((entry) => {
                const idx = globalIdx++;
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={entry.id}
                    className={`cmdpal__item ${isActive ? 'cmdpal__item--active' : ''}`}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => navigate(entry)}
                    onMouseEnter={() => setActiveIdx(idx)}
                  >
                    <span className="cmdpal__item-icon">{entry.icon}</span>
                    <span className="cmdpal__item-label">{entry.label}</span>
                    {entry.shortcut && (
                      <span className="cmdpal__item-shortcut">{entry.shortcut}</span>
                    )}
                    <svg className="cmdpal__item-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M3 7h8M8 4l3 3-3 3" />
                    </svg>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="cmdpal__footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
