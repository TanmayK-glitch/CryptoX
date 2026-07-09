// Vercel serverless proxy for CoinGecko /coins/{id}
// API key is read from process.env.COINGECKO_API_KEY (server-side only, NOT prefixed with VITE_)
// This keeps the key out of the client JS bundle.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing coin id" });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${id}`;

  const headers = { accept: "application/json" };
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    console.error("[api/coin/[id]] Proxy error:", err);
    res.status(502).json({ error: "Failed to fetch from CoinGecko" });
  }
}
