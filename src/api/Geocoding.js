import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@env";

export const fetchGeocodeData = async (address) => {
  try {
    // Google Maps Geocoding API 호출
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
        region: "kr",
        language: "ko",
      },
    });

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    } else {
      console.error(`주소를 찾을 수 없습니다: ${address}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode data:", error.message);
    throw error;
  }
};
