import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Globe } from 'lucide-react';
import { GeoCity, GeocodingResponse } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (city: GeoCity) => void;
  isLoadingWeather?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, isLoadingWeather }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Fetch suggestions with debounce
  useEffect(() => {
    const trimmed = query.trim();

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    debounceTimerRef.current = window.setTimeout(async () => {
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmed
        )}&count=5&language=en&format=json`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Geocoding service unavailable');
        }
        const data: GeocodingResponse = await res.json();
        setSuggestions(data.results || []);
        setHasSearched(true);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Error searching cities:', err);
        setSearchError('Unable to load city suggestions. Please check your connection.');
        setSuggestions([]);
        setHasSearched(true);
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoCity) => {
    const display = city.name + (city.country ? `, ${city.country}` : '');
    setQuery(display);
    setIsOpen(false);
    setSuggestions([]);
    onSelectCity(city);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If a suggestion is highlighted via arrow keys
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    // If suggestions are already loaded, choose the top match
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    // If user hit Get Weather with query text, immediately fetch geocoding
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      setIsSearching(true);
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          trimmed
        )}&count=5&language=en&format=json`
      )
        .then((res) => res.json())
        .then((data: GeocodingResponse) => {
          setIsSearching(false);
          setHasSearched(true);
          if (data.results && data.results.length > 0) {
            handleSelect(data.results[0]);
          } else {
            setSuggestions([]);
            setIsOpen(true);
          }
        })
        .catch(() => {
          setIsSearching(false);
          setSearchError('Search failed. Please try again.');
          setIsOpen(true);
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true);
      } else if (suggestions.length > 0) {
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full z-30">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400 transition-colors">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any city or region (e.g. Chennai, Paris, Seattle)..."
            autoComplete="off"
            className="w-full pl-10 pr-9 py-3 text-sm bg-slate-900/80 text-white placeholder-slate-400 rounded-xl border border-slate-700/80 focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/25 focus:outline-none transition-all shadow-inner backdrop-blur-md"
          />

          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={clearInput}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="get-weather-btn"
          type="submit"
          disabled={!query.trim() || isLoadingWeather}
          className="shrink-0 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all flex items-center gap-2 cursor-pointer"
        >
          {isLoadingWeather ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Loading...</span>
            </>
          ) : (
            <span>Get Weather</span>
          )}
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          id="city-suggestions-dropdown"
          className="absolute top-full left-0 right-0 sm:right-auto sm:w-[calc(100%-120px)] mt-2 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 divide-y divide-slate-800/60 transition-all"
        >
          {isSearching && suggestions.length === 0 && (
            <div className="px-4 py-3.5 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>Finding cities worldwide...</span>
            </div>
          )}

          {searchError && (
            <div className="px-4 py-3 text-xs text-rose-300 flex items-center gap-2 bg-rose-950/30">
              <span>{searchError}</span>
            </div>
          )}

          {!isSearching && hasSearched && suggestions.length === 0 && !searchError && (
            <div className="px-4 py-4 text-center">
              <p className="text-sm font-medium text-slate-300">
                No city found for &ldquo;<span className="text-sky-300 font-semibold">{query.trim()}</span>&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Please double-check spelling or try a major nearby district or country.
              </p>
            </div>
          )}

          {suggestions.map((city, idx) => {
            const isHighlighted = idx === selectedIndex;
            return (
              <button
                key={`${city.id}-${idx}`}
                id={`city-option-${city.id}`}
                type="button"
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-3 text-xs sm:text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isHighlighted ? 'bg-sky-500/15 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MapPin className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="font-medium text-white truncate">{city.name}</span>
                  {(city.admin1 || city.country) && (
                    <span className="text-xs text-slate-400 truncate">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
                {city.country_code && (
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                    {city.country_code}
                  </span>
                )}
              </button>
            );
          })}

          <div className="px-3.5 py-2 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-500" />
              Open-Meteo Geocoding
            </span>
            <span className="hidden sm:inline">Use ↑↓ keys to navigate, Enter to select</span>
          </div>
        </div>
      )}
    </div>
  );
};
