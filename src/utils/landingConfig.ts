import responseData from "@/config/response.json";
import { ENABLE_JSON } from "@/constants";

// called the landing page api on server side >>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export async function getConfigData() {
  try {
    const data = responseData;
    if (ENABLE_JSON) return (data["data"] = responseData);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/landing-page-json`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching config data:", error);
    return null;
  }
}
