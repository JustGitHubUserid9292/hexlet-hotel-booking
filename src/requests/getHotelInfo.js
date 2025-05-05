import axios from "axios";
import getAccessToken from "./token";

export default async function getHotelInfo(id, checkIn = "", checkOut = "", adults = "", rooms = "") {
    const token = await getAccessToken();
    try {
        const response = await axios.get(
            `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${id}&lang=EN${checkIn}${checkOut}${adults}${rooms}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        
        const { data } = response.data;
        return data
    } catch (error) {
        console.error("Ошибка при получении данных:", error.response?.data || error.message);
        const errData = error.response?.data?.errors?.[0] || {};
        throw {
            status: errData.status,
            detail: errData.detail
        };
    }
}
