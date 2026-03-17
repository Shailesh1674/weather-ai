import axios from 'axios';

const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

export const getCurrentWeather = async (lat, lon) => {
  try {
    const res = await axios.get(`${BASE_URL}/current.json`, {
      params: { key: WEATHERAPI_KEY, q: `${lat},${lon}`, aqi: 'no' },
      timeout: 10000,
    });
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.error?.message || error.message || 'Failed to fetch weather';
    console.error("[weather.js] getCurrentWeather error:", msg);
    throw new Error(msg);
  }
};

export const getForecast = async (lat, lon) => {
  try {
    const res = await axios.get(`${BASE_URL}/forecast.json`, {
      params: { key: WEATHERAPI_KEY, q: `${lat},${lon}`, days: 3, aqi: 'no', alerts: 'no' },
      timeout: 10000,
    });
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.error?.message || error.message || 'Failed to fetch forecast';
    console.error("[weather.js] getForecast error:", msg);
    throw new Error(msg);
  }
};

export const searchCity = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/search.json`, {
      params: { key: WEATHERAPI_KEY, q: query },
      timeout: 5000,
    });
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.error?.message || error.message || 'Failed to search city';
    console.error("[weather.js] searchCity error:", msg);
    throw new Error(msg);
  }
};
