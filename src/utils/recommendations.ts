import { CurrentWeather, DailyForecast, Recommendation } from '../types/weather';

export function generatePlanningRecommendations(
  current: CurrentWeather,
  daily: DailyForecast
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const todayPrecipSum = daily.precipitation_sum?.[0] ?? 0;
  const todayUvMax = daily.uv_index_max?.[0] ?? 0;
  const todayWindMax = daily.wind_speed_10m_max?.[0] ?? current.wind_speed_10m;
  const temp = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const weatherCode = current.weather_code;

  // 1. RAIN & UMBRELLA RECOMMENDATION
  const isCurrentlyRaining = current.precipitation > 0 || [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const rainExpectedLater = todayPrecipSum > 0.5 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(daily.weather_code?.[0] ?? 0);

  if (isCurrentlyRaining) {
    recommendations.push({
      id: 'rain-active',
      category: 'rain',
      title: 'Rain Gear Essential',
      description: `Precipitation active (${current.precipitation > 0 ? current.precipitation + ' mm' : 'rain/showers'}). Take a sturdy umbrella and water-resistant footwear.`,
      severity: 'red',
    });
  } else if (rainExpectedLater) {
    recommendations.push({
      id: 'rain-expected',
      category: 'rain',
      title: 'Pack an Umbrella',
      description: `Rain showers forecasted today (~${todayPrecipSum.toFixed(1)} mm total). Keep an umbrella handy if venturing out.`,
      severity: 'orange',
    });
  } else {
    recommendations.push({
      id: 'rain-none',
      category: 'rain',
      title: 'No Rain Expected',
      description: 'Zero precipitation expected today. Great for walking, commutes, and outdoor errands without rain gear.',
      severity: 'green',
    });
  }

  // 2. TEMPERATURE COMFORT RECOMMENDATION
  if (feelsLike >= 36 || temp >= 35) {
    recommendations.push({
      id: 'temp-extreme-hot',
      category: 'temperature',
      title: 'High Heat Alert',
      description: `Intense heat feels like ${Math.round(feelsLike)}°C. Stay hydrated, avoid strenuous midday exertion, and seek shaded or air-conditioned areas.`,
      severity: 'red',
    });
  } else if (feelsLike >= 30 || temp >= 30) {
    recommendations.push({
      id: 'temp-warm',
      category: 'temperature',
      title: 'Warm & Balmy',
      description: `Current temp is ${Math.round(temp)}°C (feels like ${Math.round(feelsLike)}°C). Wear breathable, lightweight cottons and carry water.`,
      severity: 'orange',
    });
  } else if (temp >= 19 && temp < 30) {
    recommendations.push({
      id: 'temp-pleasant',
      category: 'temperature',
      title: 'Pleasant & Comfortable',
      description: `Comfortable temperature around ${Math.round(temp)}°C. Excellent thermal comfort for daily outdoor activities and exercise.`,
      severity: 'green',
    });
  } else if (temp >= 10 && temp < 19) {
    recommendations.push({
      id: 'temp-cool',
      category: 'temperature',
      title: 'Cool Conditions',
      description: `Crisp temperature at ${Math.round(temp)}°C. A light jacket, fleece, or layered sweater is recommended.`,
      severity: 'blue',
    });
  } else {
    recommendations.push({
      id: 'temp-cold',
      category: 'temperature',
      title: 'Chilly Weather',
      description: `Low temperatures around ${Math.round(temp)}°C (feels like ${Math.round(feelsLike)}°C). Dress warmly in thermal layers, a winter coat, and gloves.`,
      severity: 'orange',
    });
  }

  // 3. UV INDEX RECOMMENDATION
  if (todayUvMax >= 8) {
    recommendations.push({
      id: 'uv-very-high',
      category: 'uv',
      title: `Very High UV (${todayUvMax.toFixed(1)})`,
      description: 'Extra protection required. Apply broad-spectrum SPF 50+ sunscreen, wear UV-rated sunglasses, and seek shade during 11 AM - 3 PM.',
      severity: 'red',
    });
  } else if (todayUvMax >= 6) {
    recommendations.push({
      id: 'uv-high',
      category: 'uv',
      title: `High UV (${todayUvMax.toFixed(1)})`,
      description: 'Protection needed. Wear SPF 30+ sunscreen, a wide-brim hat, and sunglasses when outdoors during peak hours.',
      severity: 'orange',
    });
  } else if (todayUvMax >= 3) {
    recommendations.push({
      id: 'uv-moderate',
      category: 'uv',
      title: `Moderate UV (${todayUvMax.toFixed(1)})`,
      description: 'Moderate sun intensity. Standard sunscreen is recommended if staying outdoors for more than 45 minutes.',
      severity: 'blue',
    });
  } else {
    recommendations.push({
      id: 'uv-low',
      category: 'uv',
      title: `Low UV (${todayUvMax.toFixed(1)})`,
      description: 'Low solar radiation risk. You can safely enjoy sunlight without heavy UV precautions.',
      severity: 'green',
    });
  }

  // 4. WIND CONDITIONS RECOMMENDATION
  const currentWind = current.wind_speed_10m;
  if (currentWind >= 40 || todayWindMax >= 45) {
    recommendations.push({
      id: 'wind-gale',
      category: 'wind',
      title: `High Winds (${Math.round(currentWind)} km/h)`,
      description: `Strong gusts up to ${Math.round(todayWindMax)} km/h. Secure lightweight outdoor furniture and take care while biking or driving.`,
      severity: 'red',
    });
  } else if (currentWind >= 24 || todayWindMax >= 28) {
    recommendations.push({
      id: 'wind-breezy',
      category: 'wind',
      title: `Breezy (${Math.round(currentWind)} km/h)`,
      description: 'Noticeable wind gusts. A windbreaker jacket is useful, and loose paper or hats may catch the breeze.',
      severity: 'orange',
    });
  } else {
    recommendations.push({
      id: 'wind-calm',
      category: 'wind',
      title: `Gentle Breeze (${Math.round(currentWind)} km/h)`,
      description: 'Favorable, light air movement. Ideal for outdoor sports, cycling, and patio dining.',
      severity: 'green',
    });
  }

  // 5. HUMIDITY & AIR RECOMMENDATION
  if (humidity >= 85) {
    recommendations.push({
      id: 'humidity-very-high',
      category: 'humidity',
      title: `Very High Humidity (${humidity}%)`,
      description: 'Muggy and heavy atmosphere. Sweat evaporates slowly; ensure good indoor air circulation and stay well hydrated.',
      severity: 'orange',
    });
  } else if (humidity <= 28) {
    recommendations.push({
      id: 'humidity-dry',
      category: 'humidity',
      title: `Dry Air (${humidity}%)`,
      description: 'Low ambient moisture may cause dry skin or throat irritation. Keep a water bottle near and consider moisturizing.',
      severity: 'blue',
    });
  } else {
    recommendations.push({
      id: 'humidity-balanced',
      category: 'humidity',
      title: `Optimal Humidity (${humidity}%)`,
      description: 'Atmospheric moisture is in the ideal comfort zone (30%–70%) for respiration and everyday stamina.',
      severity: 'green',
    });
  }

  return recommendations;
}
