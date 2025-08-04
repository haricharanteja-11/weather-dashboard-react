import styles from './Weather.module.css';
import search_icon from '../assets/search-iconn.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import React, { useEffect, useState } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": clear_icon,
    "03d": clear_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        setErrorMsg("City not found");
        setWeatherData(null);
        setLoading(false);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setErrorMsg("Failed to fetch weather.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("Delhi"); // Load Delhi by default
  }, []);

  const handleSearch = () => {
    if (cityInput.trim() !== "") {
      search(cityInput.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchbar}>
        <input
          type="text"
          placeholder='Search City'
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <img
          src={search_icon}
          alt="search"
          className={styles.ima}
          onClick={handleSearch}
        />
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      {weatherData && !loading && (
        <>
          <img src={weatherData.icon} alt="weather-icon" className={styles.weathericon} />
          <p className={styles.temperature}>{weatherData.temperature}°C</p>
          <p className={styles.city}>{weatherData.location}</p>

          <div className={styles.weatherdata}>
            <div className={styles.col}>
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className={styles.col}>
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
