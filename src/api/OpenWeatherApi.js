import axios from "axios";
import { OPENWEATHER_API_KEY } from '@env';

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, 
    {
      params: {
        lat: latitude,
        lon: longitude,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
