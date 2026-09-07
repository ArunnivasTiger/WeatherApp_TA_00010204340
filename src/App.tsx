import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { QuickPickChips, POPULAR_CITIES } from './components/QuickPickChips';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { ForecastSection } from './components/ForecastSection';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { GeoCity, ForecastResponse, Recommendation } from './types/weather';
import { generatePlanningRecommendations } from './utils/recommendations';
import { MapPin, Navigation } from 'lucide-react';

export default function App() {
  // Default to Chennai as requested
  const [selectedCity, setSelectedCity] = useState<GeoCity>(POPULAR_CITIES[0]);
  const [weatherData, setWeatherData] = useState<ForecastResponse | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const fetchWeather = useCallback(async (city: GeoCity, isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo API returned status ${response.status}: ${response.statusText}`);
      }

      const data: ForecastResponse = await response.json();
      setWeatherData(data);

      if (data.current && data.daily) {
        const recs = generatePlanningRecommendations(data.current, data.daily);
        setRecommendations(recs);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch weather forecast:', err);
      const errMsg = err instanceof Error ? err.message : 'Unable to connect to Open-Meteo weather service.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch initial weather for default city
  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  const handleCitySelect = (city: GeoCity) => {
    setSelectedCity(city);
  };

  const handleRefresh = () => {
    fetchWeather(selectedCity, true);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          // Reverse geocode or fetch closest city name
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`
          );
          let cityName = 'Current Location';
          let country = '';
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results[0]) {
              cityName = geoData.results[0].name;
              country = geoData.results[0].country || '';
            }
          }

          const localCity: GeoCity = {
            id: Date.now(),
            name: cityName,
            latitude: lat,
            longitude: lon,
            country: country,
          };
          setSelectedCity(localCity);
        } catch {
          setSelectedCity({
            id: Date.now(),
            name: 'Current Location',
            latitude: lat,
            longitude: lon,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        console.warn('Geolocation failed or denied:', geoError);
        setIsLocating(false);
        setError('Location access was denied or timed out. You can still search any city manually.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#070f26] to-[#040914] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col min-h-screen">
        {/* Header */}
        <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

        {/* Search & Location Controls */}
        <section className="mt-4 mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1">
              <SearchBar
                onSelectCity={handleCitySelect}
                isLoadingWeather={isLoading}
              />
            </div>

            <button
              id="locate-me-btn"
              type="button"
              onClick={handleCurrentLocation}
              disabled={isLocating || isLoading}
              title="Detect weather at your current GPS location"
              className="shrink-0 flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 text-xs font-medium transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>
          </div>

          {/* Popular Cities Quick Pick */}
          <QuickPickChips
            selectedCity={selectedCity}
            onSelectCity={handleCitySelect}
          />
        </section>

        {/* Main Content Area */}
        <main className="flex-1 mt-2 space-y-6">
          {error ? (
            <ErrorMessage
              message={error}
              onRetry={() => fetchWeather(selectedCity)}
              isRetrying={isLoading}
            />
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : weatherData && weatherData.current && weatherData.daily ? (
            <div className="space-y-6">
              {/* Current Weather Card */}
              <CurrentWeatherCard
                city={selectedCity}
                current={weatherData.current}
                daily={weatherData.daily}
                timezone={weatherData.timezone}
              />

              {/* Planning Recommendations */}
              <PlanningRecommendations recommendations={recommendations} />

              {/* 7-Day Forecast */}
              <ForecastSection daily={weatherData.daily} />
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No weather data available. Select a city above.
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Open-Meteo Public API · Free & No API Key Required</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>WMO Weather Standard</span>
            <span>·</span>
            <span>Real-time Geocoding</span>
            <span>·</span>
            <span>Global Coverage</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
