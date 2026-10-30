export const HIVE_API_BASE_URL = process.env.NEXT_PUBLIC_HIVE_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:3001" : "https://console.tokhive.ai");
