const BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("fit_token");

  const url = BASE + path;

  console.log("================================");
  console.log("API REQUEST");
  console.log("URL:", url);
  console.log("METHOD:", options.method || "GET");
  console.log("BODY:", options.body);
  console.log("TOKEN EXISTS:", !!token);
  console.log("================================");

  const r = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await r.json().catch(() => ({}));

  console.log("API RESPONSE");
  console.log("STATUS:", r.status);
  console.log("DATA:", data);

  if (!r.ok) {
    throw new Error(
      data.message || `Request failed with status ${r.status}`
    );
  }

  return data;
}