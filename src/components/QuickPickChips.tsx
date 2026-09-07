import React from 'react';
import { GeoCity } from '../types/weather';
import { Compass } from 'lucide-react';

export const POPULAR_CITIES: GeoCity[] = [
  {
    id: 1269750,
    name: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    country: 'India',
    admin1: 'Tamil Nadu',
    country_code: 'IN',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
    admin1: 'England',
    country_code: 'GB',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    admin1: 'New York',
    country_code: 'US',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    country: 'Japan',
    admin1: 'Tokyo',
    country_code: 'JP',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    country: 'Australia',
    admin1: 'New South Wales',
    country_code: 'AU',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    country: 'United Arab Emirates',
    admin1: 'Dubai',
    country_code: 'AE',
  },
];

interface QuickPickChipsProps {
  selectedCity: GeoCity | null;
  onSelectCity: (city: GeoCity) => void;
}

export const QuickPickChips: React.FC<QuickPickChipsProps> = ({ selectedCity, onSelectCity }) => {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 pr-1">
        <Compass className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-medium">Quick Pick:</span>
      </div>
      <div className="flex items-center gap-2">
        {POPULAR_CITIES.map((city) => {
          const isSelected =
            selectedCity &&
            (selectedCity.id === city.id ||
              (Math.abs(selectedCity.latitude - city.latitude) < 0.05 &&
                Math.abs(selectedCity.longitude - city.longitude) < 0.05));

          return (
            <button
              key={city.name}
              id={`quick-pick-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCity(city)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 border cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400/50 shadow-md shadow-sky-500/10 ring-1 ring-sky-400/30'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/70'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
