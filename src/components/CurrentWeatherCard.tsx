import React from 'react';
import {
  Wind,
  Droplets,
  Cloud,
  Gauge,
  Sunrise,
  Sunset,
  Navigation,
  Sun,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CurrentWeather, DailyForecast, GeoCity } from '../types/weather';
import { getWeatherCondition, getWindCompass, formatTimeOnly } from '../utils/weatherCodes';

interface CurrentWeatherCardProps {
  city: GeoCity;
  current: CurrentWeather;
  daily: DailyForecast;
  timezone: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  current,
  daily,
  timezone,
}) => {
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const windCompass = getWindCompass(current.wind_direction_10m);
  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const highTemp = daily.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : temp;
  const lowTemp = daily.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : temp;
  const uvMax = daily.uv_index_max?.[0] ?? 0;
  const sunriseTime = daily.sunrise?.[0] ? formatTimeOnly(daily.sunrise[0]) : '--:--';
  const sunsetTime = daily.sunset?.[0] ? formatTimeOnly(daily.sunset[0]) : '--:--';

  // Format local time from timezone or current.time
  const localTimeDisplay = (() => {
    try {
      if (timezone) {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(new Date());
      }
    } catch {
      // fallback
    }
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  })();

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/80 border border-slate-700/60 p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
    >
      {/* Subtle ambient light glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Top bar: City info & local time */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Current Conditions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight flex items-baseline gap-2">
            <span>{city.name}</span>
            {city.country && (
              <span className="text-base sm:text-lg font-normal text-slate-400">
                {city.admin1 ? `${city.admin1}, ${city.country}` : city.country}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>{localTimeDisplay}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">{timezone}</span>
        </div>
      </div>

      {/* Main Temperature & Weather Status */}
      <div className="relative py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Weather Emoji & Condition Badge */}
          <div className="relative flex items-center justify-center text-5xl sm:text-6xl p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/70 shadow-inner select-none shrink-0">
            <span>{condition.emoji}</span>
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter">
                {temp}
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-sky-400 ml-1">°C</span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-lg sm:text-xl font-medium text-slate-100">{condition.label}</span>
              <span className="text-xs text-slate-400">
                Feels like <strong className="text-slate-200 font-semibold">{feelsLike}°C</strong>
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-rose-400 font-bold">↑ {highTemp}°</span>
                <span className="text-slate-600">/</span>
                <span className="text-sky-400 font-bold">↓ {lowTemp}°</span>
              </span>
              {daily.precipitation_sum?.[0] !== undefined && daily.precipitation_sum[0] > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px]">
                  Precip: {daily.precipitation_sum[0].toFixed(1)} mm
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset mini capsule */}
        <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800/70 rounded-2xl p-3.5 self-stretch md:self-center justify-around sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Sunrise</p>
              <p className="text-xs sm:text-sm font-semibold text-white font-mono">{sunriseTime}</p>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-800 mx-1" />

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              <Sunset className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Sunset</p>
              <p className="text-xs sm:text-sm font-semibold text-white font-mono">{sunsetTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
        {/* Humidity */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-3.5 sm:p-4 hover:border-slate-600/70 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {current.relative_humidity_2m}
            <span className="text-sm font-normal text-slate-400 ml-0.5">%</span>
          </div>
          <div className="w-full bg-slate-700/40 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-sky-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, current.relative_humidity_2m))}%` }}
            />
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-3.5 sm:p-4 hover:border-slate-600/70 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Wind</span>
            <Wind className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {Math.round(current.wind_speed_10m)}
            <span className="text-sm font-normal text-slate-400 ml-1">km/h</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <Navigation
              className="w-3 h-3 text-teal-400 transition-transform"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            />
            <span className="font-medium text-slate-300">
              {windCompass} ({Math.round(current.wind_direction_10m)}°)
            </span>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-3.5 sm:p-4 hover:border-slate-600/70 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {current.cloud_cover}
            <span className="text-sm font-normal text-slate-400 ml-0.5">%</span>
          </div>
          <div className="w-full bg-slate-700/40 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, current.cloud_cover))}%` }}
            />
          </div>
        </div>

        {/* Pressure */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-3.5 sm:p-4 hover:border-slate-600/70 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pressure</span>
            <Gauge className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {Math.round(current.pressure_msl)}
            <span className="text-sm font-normal text-slate-400 ml-1">hPa</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>UV Max: {uvMax.toFixed(1)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
