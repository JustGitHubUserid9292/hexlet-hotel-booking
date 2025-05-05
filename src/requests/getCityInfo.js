import axios from "axios";
import getAccessToken from "./token";

export default async function getCityInfo(cityName) {
    const token = await getAccessToken();
    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${cityName}`,
      {
        headers: { Authorization: `Bearer ${token}`}
      }
      );
      
      const { data } = response.data
      return data
    } catch (error) {
      console.error('Ошибка при получении данных о городе', error.response?.data || error.message)
    }
}