import { useEffect, useState } from "react";
import "./LocalWeather.css";

const WEATHER_API_KEY = "5c72224b5fe84d82aad162849262807";

const LOCATIONS = [
  {
    id: "fort-erie",
    name: "Fort Erie",
    query: "Fort Erie, Ontario, Canada",
  },
  {
    id: "niagara-falls",
    name: "Niagara Falls",
    query: "Niagara Falls, Ontario, Canada",
  },
];

function getIconUrl(iconUrl) {
  if (!iconUrl) {
    return "";
  }

  if (iconUrl.startsWith("//")) {
    return `https:${iconUrl}`;
  }

  return iconUrl;
}

function getWeatherTheme(conditionCode, isDay) {
  if (!isDay) {
    return "weather-night";
  }

  if (conditionCode === 1000) {
    return "weather-sunny";
  }

  if (conditionCode === 1003) {
    return "weather-partly-cloudy";
  }

  if ([1006, 1009, 1030, 1135, 1147].includes(conditionCode)) {
    return "weather-cloudy";
  }

  if (
    [
      1063,
      1072,
      1150,
      1153,
      1168,
      1171,
      1180,
      1183,
      1186,
      1189,
      1192,
      1195,
      1198,
      1201,
      1240,
      1243,
      1246,
    ].includes(conditionCode)
  ) {
    return "weather-rain";
  }

  if (
    [
      1066,
      1069,
      1114,
      1117,
      1204,
      1207,
      1210,
      1213,
      1216,
      1219,
      1222,
      1225,
      1237,
      1249,
      1252,
      1255,
      1258,
      1261,
      1264,
    ].includes(conditionCode)
  ) {
    return "weather-snow";
  }

  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return "weather-storm";
  }

  return "weather-default";
}

function formatDay(date, index) {
  if (index === 0) {
    return "Today";
  }

  if (index === 1) {
    return "Tomorrow";
  }

  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function formatTime(localTime) {
  if (!localTime) {
    return "";
  }

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(localTime.replace(" ", "T")));
}

export default function LocalWeather() {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          key: WEATHER_API_KEY,
          q: selectedLocation.query,
          days: "3",
          aqi: "no",
          alerts: "no",
        });

        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message || "Unable to load the weather."
          );
        }

        setWeather(data);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        console.error("Weather request failed:", fetchError);
        setError(
          fetchError.message ||
            "The local forecast could not be loaded right now."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [selectedLocation]);

  const currentWeather = weather?.current;
  const forecastDays = weather?.forecast?.forecastday || [];

  const themeClass = currentWeather
    ? getWeatherTheme(
        currentWeather.condition.code,
        currentWeather.is_day === 1
      )
    : "weather-default";

  return (
    <section className="local-weather-section">
      <div className="local-weather-container">
        <div className="local-weather-heading">
          <div>
            <p className="local-weather-eyebrow">LOCAL WEATHER</p>

            <h2>Weather across Niagara</h2>

            <p className="local-weather-intro">
              Current conditions and a three-day forecast for Fort Erie and
              Niagara Falls.
            </p>
          </div>

          <div className="weather-location-buttons">
            {LOCATIONS.map((location) => (
              <button
                type="button"
                key={location.id}
                className={
                  selectedLocation.id === location.id
                    ? "weather-location-button active"
                    : "weather-location-button"
                }
                onClick={() => setSelectedLocation(location)}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="weather-loading">
            <div className="weather-spinner" />
            <p>Loading local weather...</p>
          </div>
        )}

        {!loading && error && (
          <div className="weather-error">
            <span aria-hidden="true">🌦️</span>

            <div>
              <h3>Weather temporarily unavailable</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && currentWeather && (
          <div className={`weather-card ${themeClass}`}>
            <div className="weather-current-panel">
              <div className="weather-current-header">
                <div>
                  <p className="weather-label">Right now</p>

                  <h3>{selectedLocation.name}</h3>

                  <p className="weather-province">Ontario</p>
                </div>

                <p className="weather-updated">
                  Updated {formatTime(weather.location.localtime)}
                </p>
              </div>

              <div className="weather-current-content">
                <img
                  src={getIconUrl(currentWeather.condition.icon)}
                  alt={currentWeather.condition.text}
                  className="weather-main-icon"
                />

                <div>
                  <div className="weather-temperature">
                    {Math.round(currentWeather.temp_c)}
                    <span>°</span>
                  </div>

                  <p className="weather-condition">
                    {currentWeather.condition.text}
                  </p>

                  <p className="weather-feels-like">
                    Feels like {Math.round(currentWeather.feelslike_c)}°
                  </p>
                </div>
              </div>

              <div className="weather-details">
                <div className="weather-detail">
                  <span aria-hidden="true">💧</span>
                  <div>
                    <p>Humidity</p>
                    <strong>{currentWeather.humidity}%</strong>
                  </div>
                </div>

                <div className="weather-detail">
                  <span aria-hidden="true">💨</span>
                  <div>
                    <p>Wind</p>
                    <strong>
                      {Math.round(currentWeather.wind_kph)} km/h
                    </strong>
                  </div>
                </div>

                <div className="weather-detail">
                  <span aria-hidden="true">☀️</span>
                  <div>
                    <p>UV index</p>
                    <strong>{Math.round(currentWeather.uv)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="weather-forecast-panel">
              <p className="weather-label">Three-day forecast</p>

              <div className="weather-forecast-grid">
                {forecastDays.map((forecast, index) => (
                  <article
                    className="weather-forecast-day"
                    key={forecast.date}
                  >
                    <h4>{formatDay(forecast.date, index)}</h4>

                    <img
                      src={getIconUrl(forecast.day.condition.icon)}
                      alt={forecast.day.condition.text}
                      className="weather-forecast-icon"
                    />

                    <p className="weather-forecast-condition">
                      {forecast.day.condition.text}
                    </p>

                    <div className="weather-high-low">
                      <strong>
                        {Math.round(forecast.day.maxtemp_c)}°
                      </strong>

                      <span>
                        {Math.round(forecast.day.mintemp_c)}°
                      </span>
                    </div>

                    <p className="weather-rain">
                      💧 {forecast.day.daily_chance_of_rain}% rain
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <a
              className="weather-credit"
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noreferrer"
            >
              Weather data by WeatherAPI.com
            </a>
          </div>
        )}
      </div>
    </section>
  );
}