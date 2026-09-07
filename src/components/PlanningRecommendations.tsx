import React from 'react';
import {
  Compass,
  Umbrella,
  Thermometer,
  Sun,
  Wind,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Recommendation, Severity } from '../types/weather';

interface PlanningRecommendationsProps {
  recommendations: Recommendation[];
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'rain':
        return <Umbrella className="w-4 h-4" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4" />;
      case 'uv':
        return <Sun className="w-4 h-4" />;
      case 'wind':
        return <Wind className="w-4 h-4" />;
      case 'humidity':
        return <Droplets className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'green':
        return {
          dotBg: 'bg-emerald-400',
          dotShadow: 'shadow-[0_0_8px_rgba(52,211,153,0.7)]',
          label: 'Good',
          badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          borderClass: 'border-slate-800/80 hover:border-emerald-500/40',
        };
      case 'orange':
        return {
          dotBg: 'bg-amber-400',
          dotShadow: 'shadow-[0_0_8px_rgba(251,191,36,0.7)]',
          label: 'Caution',
          badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          borderClass: 'border-slate-800/80 hover:border-amber-500/40',
        };
      case 'blue':
        return {
          dotBg: 'bg-sky-400',
          dotShadow: 'shadow-[0_0_8px_rgba(56,189,248,0.7)]',
          label: 'Info',
          badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          borderClass: 'border-slate-800/80 hover:border-sky-500/40',
        };
      case 'red':
        return {
          dotBg: 'bg-rose-400',
          dotShadow: 'shadow-[0_0_8px_rgba(244,63,94,0.7)]',
          label: 'Warning',
          badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          borderClass: 'border-slate-800/80 hover:border-rose-500/40',
        };
    }
  };

  return (
    <div
      id="planning-recommendations"
      className="rounded-3xl bg-slate-900/60 border border-slate-700/60 p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-sky-500/20 border border-sky-500/30 text-sky-300">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Planning Recommendations
            </h3>
            <p className="text-xs text-slate-400">
              Smart guidance based on current weather & today&apos;s outlook
            </p>
          </div>
        </div>

        {/* Severity Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span>Good</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            <span>Info</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            <span>Caution</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
            <span>Warning</span>
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((item) => {
          const config = getSeverityBadge(item.severity);

          return (
            <div
              key={item.id}
              id={`recommendation-${item.id}`}
              className={`p-4 rounded-2xl bg-slate-800/40 border ${config.borderClass} transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {/* Severity color dot */}
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dotBg} ${config.dotShadow}`} />
                    <span className="text-sm font-bold text-white tracking-tight">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed pl-4.5">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400 pl-4.5">
                <span className="capitalize flex items-center gap-1.5">
                  {getCategoryIcon(item.category)}
                  <span>Category: {item.category}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
