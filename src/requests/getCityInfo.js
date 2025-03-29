import axios from "axios";
import getAccessToken from "./token";

const token = await getAccessToken();

export default async function getCityInfo(cityName) {
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
      console.log('Ошибка при получении данных о городе', error.response?.data || error.message)
    }
}