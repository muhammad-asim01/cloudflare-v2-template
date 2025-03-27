import axios from "axios";

export async function getUserCountryCode() {
    const apikey = process.env.NEXT_PUBLIC_GEO_LOCATION_API_KEY;
    try {
      const data = await axios.get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${apikey}`);
      return data.data.country_code2;
    } catch (err) {
      console.log(err);
      return null;
    }
  }