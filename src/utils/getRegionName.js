import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from '@env';

export const getRegionName = async (latitude, longitude) => {
    try {
      const apiKey = GOOGLE_MAPS_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      const response = await axios.get(url);
  
      if (response.data.results.length > 0) {
        const regionNameParts = response.data.results[0].formatted_address.split(" ");
        return regionNameParts.slice(1, 4).join(" ");
      } else {
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching region name:", error);
      return "Failed to load";
    }
  };