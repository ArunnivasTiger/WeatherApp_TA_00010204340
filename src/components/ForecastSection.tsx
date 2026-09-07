import React from 'react';
import { Calendar, Droplet, Wind, Sun } from 'lucide-react';
import { DailyForecast } from '../types/weather';
import { getWeatherCondition, formatDayLabel, formatDateShort } from '../utils/weatherCodes';

interface ForecastSectionProps {
  daily: DailyForecast;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ daily }) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Find min and max temp across the 7 days for relative temp bars
  const allMins = daily.temperature_2m_min || [];
  const allMaxs = daily.temperature_2m_max || [];
  const overallMin = Math.min(...allMins);
  const overallMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, overallMax - overallMin);

  return (
    <div
      id="seven-day-forecast"
      className="rounded-3xl bg-slate-900/60 border border-slate-700/60 p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              7-Day Forecast
            </h3>
            <p className="text-xs text-slate-400">Daily outlook and temperature range</p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          High / Low (°C)
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-800/60">
        {daily.time.map((dateStr, index) => {
          const dayName = formatDayLabel(dateStr, index);
          const dateShort = formatDateShort(dateStr);
          const weatherCode = daily.weather_code[index];
          const condition = getWeatherCondition(weatherCode, 1);
          const maxTemp = Math.round(daily.temperature_2m_max[index]);
          const minTemp = Math.round(daily.temperature_2m_min[index]);
          const precipSum = daily.precipitation_sum?.[index] ?? 0;
          const maxWind = daily.wind_speed_10m_max?.[index] ? Math.round(daily.wind_speed_10m_max[index]) : null;
          const uv = daily.uv_index_max?.[index];

          // Percentage positions for temp bar
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - overallMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((overallMax - maxTemp) / tempRange) * 100));

          return (
            <div
              key={dateStr}
              id={`forecast-day-${index}`}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-2 sm:px-3 rounded-xl transition-colors"
            >
              {/* Day & Date info */}
              <div className="flex items-center gap-3 sm:w-44 shrink-0">
                <span className="text-2xl select-none">{condition.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${index === 0 ? 'text-sky-300' : 'text-white'}`}>
                      {dayName}
                    </span>
                    {index === 0 && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{dateShort} · {condition.label}</p>
                </div>
              </div>

              {/* Rain & Wind indicators */}
              <div className="flex items-center gap-4 text-xs text-slate-400 sm:w-48 shrink-0">
                {precipSum > 0 ? (
                  <span className="flex items-center gap-1 text-blue-300 font-medium">
                    <Droplet className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    <span>{precipSum.toFixed(1)} mm</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400/60" />
                    <span>0 mm</span>
                  </span>
                )}

                {maxWind !== null && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Wind className="w-3 h-3 text-slate-400" />
                    <span>{maxWind} km/h</span>
                  </span>
                )}

                {uv !== undefined && uv > 5 && (
                  <span className="hidden md:inline-flex text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    UV {uv.toFixed(0)}
                  </span>
                )}
              </div>

              {/* Temp Range Bar and Numbers */}
              <div className="flex items-center gap-3 sm:w-56 justify-between sm:justify-end">
                <span className="text-xs font-semibold text-slate-400 w-8 text-right">
                  {minTemp}°
                </span>

                {/* Progress-like gradient temperature bar */}
                <div className="flex-1 max-w-[120px] bg-slate-800 rounded-full h-2 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      right: `${rightPercent}%`,
                      minWidth: '12px',
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8 text-left">
                  {maxTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
