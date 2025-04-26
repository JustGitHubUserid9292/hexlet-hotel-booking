import axios from "axios";

export default async function convertCurrency(amount, from, to) {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_KEY2}/pair/${from}/${to}/${amount}`)

        return response.data.conversion_result
    } catch (error) {
        console.error("Ошибка:", error.response?.data || error.message);
        return null;
    }
};
