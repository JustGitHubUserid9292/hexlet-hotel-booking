import axios from "axios";

// Получаем токен доступа
async function getAccessToken() {
  const response = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: import.meta.env.VITE_AMADEUS_API_KEY, 
      client_secret: import.meta.env.VITE_AMADEUS_API_SECRET, 
    })
  );

  return response.data.access_token;
}

export default async function getHotels(cityCode) {
    const token = await getAccessToken();
  
    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении данных:", error.response?.data || error.message);
      throw error;
    }
  }
  