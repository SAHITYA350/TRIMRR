import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
  if (!user_id) {
    throw new Error("User ID is required to fetch URLs");
  }

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }

  return data;
}


export async function getUrl({ id, user_id }) {
  if (!id || !user_id) {
    throw new Error("Missing url id or user id");
  }

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}


export async function getLongUrl(id) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching short link:", error);
    return null;
  }

  return data;
}


export async function createUrl({title, longUrl, customUrl, user_id}, qrcode) {
  const short_url = Math.random().toString(36).substr(2, 6);
  const fileName = `qr-${short_url}`;

  const {error: storageError} = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const {data, error} = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}



export async function deleteUrl({ id, user_id }) {
  if (!id || !user_id) {
    throw new Error("Missing id or user id");
  }

  const { data, error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}