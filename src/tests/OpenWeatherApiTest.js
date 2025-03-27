import axios from "axios";

const API_KEY = "153b735199ce98f4dbb364ac03613edf"; // OpenWeather API 키

// 날씨 데이터를 가져오는 함수
const fetchWeatherData = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    console.error("Latitude and Longitude are required");
    return null; // 위도와 경도가 없으면 API 호출 중단
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: latitude,
          lon: longitude,
          units: "metric", // 섭씨 단위
          appid: API_KEY, // OpenWeather API 키
        },
      }
    );
    console.log("Image URL:", `http://openweathermap.org/img/wn/${response.data.weather?.[0]?.icon}@2x.png`);
    console.log("Weather Data:", response.data); // 응답 데이터 출력
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching weather data:", error.response.data); // API 오류 응답 출력
    } else if (error.request) {
      console.error("No response received:", error.request); // 요청은 전송되었으나 응답을 받지 못함
    } else {
      console.error("Error setting up request:", error.message); // 기타 설정 오류
    }
    return null;
  }
};

// 테스트 실행
(async () => {
  const latitude = 37.5665; // 서울의 위도
  const longitude = 126.9780; // 서울의 경도

  console.log("Testing OpenWeather API...");
  const weatherData = await fetchWeatherData(latitude, longitude);
  console.log(weatherData.weather[0].icon)
  if (weatherData) {
    console.log("Success! Weather data received:");
    console.log(weatherData);
  } else {
    console.log("Failed to fetch weather data.");
  }
})();
