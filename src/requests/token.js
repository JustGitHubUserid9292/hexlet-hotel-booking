import axios from "axios";

export default async function getAccessToken() {
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