import axios from "axios";

const API_KEY = "153b735199ce98f4dbb364ac03613edf";

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, 
    {
      params: {
        lat: latitude,
        lon: longitude,
        units: "metric",
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};