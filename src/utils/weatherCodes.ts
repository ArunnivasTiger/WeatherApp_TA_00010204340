import { WeatherCondition } from '../types/weather';

/**
 * WMO Weather interpretation codes (WW) from Open-Meteo
 */
export const WMO_WEATHER_MAP: Record<number, WeatherCondition> = {
  0: { label: 'Clear sky', emoji: '☀️', description: 'Clear skies with unhindered sunshine' },
  1: { label: 'Mainly clear', emoji: '🌤️', description: 'Predominantly sunny with slight cloudiness' },
  2: { label: 'Partly cloudy', emoji: '⛅', description: 'Scattered clouds with periods of sun' },
  3: { label: 'Overcast', emoji: '☁️', description: 'Completely covered with dense cloud layers' },
  45: { label: 'Fog', emoji: '🌫️', description: 'Dense fog reducing visibility' },
  48: { label: 'Depositing rime fog', emoji: '🌫️', description: 'Freezing fog forming frost coatings' },
  51: { label: 'Light drizzle', emoji: '🌦️', description: 'Very fine, light precipitation' },
  53: { label: 'Moderate drizzle', emoji: '🌦️', description: 'Continuous fine rain droplets' },
  55: { label: 'Dense drizzle', emoji: '🌧️', description: 'Heavy drizzle with reduced visibility' },
  56: { label: 'Light freezing drizzle', emoji: '🌨️', description: 'Freezing droplets glazing cold surfaces' },
  57: { label: 'Dense freezing drizzle', emoji: '🌨️', description: 'Heavy freezing drizzle causing icy ground' },
  61: { label: 'Slight rain', emoji: '🌧️', description: 'Intermittent or steady light rainfall' },
  63: { label: 'Moderate rain', emoji: '🌧️', description: 'Steady moderate rainfall' },
  65: { label: 'Heavy rain', emoji: '🌧️', description: 'Intense rain showers' },
  66: { label: 'Light freezing rain', emoji: '🌧️❄️', description: 'Freezing rain creating icy conditions' },
  67: { label: 'Heavy freezing rain', emoji: '🌧️❄️', description: 'Severe freezing rain hazard' },
  71: { label: 'Slight snow', emoji: '🌨️', description: 'Light snowfall' },
  73: { label: 'Moderate snow', emoji: '🌨️', description: 'Steady snowfall accumulating on ground' },
  75: { label: 'Heavy snow', emoji: '❄️', description: 'Substantial snow accumulation and low visibility' },
  77: { label: 'Snow grains', emoji: '🌨️', description: 'Small, opaque grains of ice' },
  80: { label: 'Slight rain showers', emoji: '🌦️', description: 'Scattered brief rain showers' },
  81: { label: 'Moderate rain showers', emoji: '🌧️', description: 'Passing showers of moderate intensity' },
  82: { label: 'Violent rain showers', emoji: '⛈️', description: 'Sudden, torrential cloudbursts' },
  85: { label: 'Slight snow showers', emoji: '🌨️', description: 'Passing flurries of light snow' },
  86: { label: 'Heavy snow showers', emoji: '❄️', description: 'Intense, blinding snow flurries' },
  95: { label: 'Thunderstorm', emoji: '⛈️', description: 'Thunderstorm activity with lightning' },
  96: { label: 'Thunderstorm with slight hail', emoji: '⛈️', description: 'Storm with small ice pellets or hail' },
  99: { label: 'Thunderstorm with heavy hail', emoji: '⛈️', description: 'Severe storm producing damaging hail' },
};

export function getWeatherCondition(code: number, isDay: number = 1): WeatherCondition {
  const match = WMO_WEATHER_MAP[code];
  if (!match) {
    return { label: 'Unknown weather', emoji: isDay ? '🌤️' : '🌙', description: 'Conditions undetermined' };
  }

  // If night time and code is 0 (Clear), we can use moon
  if (code === 0 && isDay === 0) {
    return { label: 'Clear night', emoji: '🌙', description: 'Clear night sky' };
  }
  if (code === 1 && isDay === 0) {
    return { label: 'Mainly clear night', emoji: '🌌', description: 'Mostly clear evening sky' };
  }

  return match;
}

export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
}

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTimeOnly(isoStr: string): string {
  try {
    const parts = isoStr.split('T');
    if (parts.length > 1) {
      return parts[1].substring(0, 5);
    }
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return isoStr;
  }
}
