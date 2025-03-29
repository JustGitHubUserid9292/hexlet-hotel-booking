import axios from "axios";
import getAccessToken from "./token";

const token = await getAccessToken();

export default async function getHotels(cityCode) {
    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const { data } = response.data
      return data
    } catch (error) {
      console.error("Ошибка при получении данных:", error.response?.data || error.message);
      throw error;
    }
  }
  