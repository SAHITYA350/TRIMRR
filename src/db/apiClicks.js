import supabase from "./supabase";
import { UAParser } from "ua-parser-js";


export async function getClicksForUrls(urlIds) {
  if (!Array.isArray(urlIds) || urlIds.length === 0) {
    return []; // nothing to fetch
  }

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error.message);
    throw new Error("Unable to load clicks");
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  if (!url_id) return [];
  
  const { data, error } = await supabase
  .from("clicks")
  .select("*")
  .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load stats");
  }
  
  return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  if (!originalUrl) return;

  window.location.replace(originalUrl);

  try {
    const ua = parser.getResult();
    const device = ua.device?.type || "desktop";

    let city = null;
    let country = null;

    try {
      const res = await fetch("https://ipapi.co/json");
      const data = await res.json();
      city = data.city;
      country = data.country_name;
    } catch (err){
      console.warn("IP lookup failed : ", err);
    }

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });
  } catch (err) {
    console.error("Click store failed:", err);
  }
};


