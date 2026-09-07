import React from 'react';
import { CloudSun, RefreshCw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing = false }) => {
  return (
    <header className="w-full pt-6 pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-sky-500/20 to-blue-600/30 border border-sky-400/30 shadow-lg shadow-sky-500/10">
            <CloudSun className="w-7 h-7 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Weather Intelligence
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Live API
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Real-time weather & 7-day forecast · powered by Open-Meteo
            </p>
          </div>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            id="header-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh current weather data"
            className="self-end sm:self-center flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 hover:border-slate-600 text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
