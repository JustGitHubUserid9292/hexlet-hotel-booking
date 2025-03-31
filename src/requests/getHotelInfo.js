import axios from "axios";
import getAccessToken from "./token";

const token = await getAccessToken();

export default async function getHotelInfo(id) {
    try {
        const response = await axios.get(
            `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        const { data } = response.data;
        return data
    } catch (error) {
        console.error("Ошибка при получении данных:", error.response?.data || error.message);
        return [];
    }
}
