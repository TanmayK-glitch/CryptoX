// Vercel serverless proxy for CoinGecko /coins/markets
// API key is read from process.env.COINGECKO_API_KEY (server-side only, NOT prefixed with VITE_)
// This keeps the key out of the client JS bundle.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { vs_currency, order, per_page, page, sparkline, price_change_percentage } = req.query;

  const params = new URLSearchParams();
  if (vs_currency) params.set("vs_currency", vs_currency);
  if (order) params.set("order", order);
  if (per_page) params.set("per_page", per_page);
  if (page) params.set("page", page);
  if (sparkline) params.set("sparkline", sparkline);
  if (price_change_percentage) params.set("price_change_percentage", price_change_percentage);

  const url = `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`;

  const headers = { accept: "application/json" };
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    // Forward CoinGecko status code to the client
    res.status(response.status).json(data);
  } catch (err) {
    console.error("[api/coins] Proxy error:", err);
    res.status(502).json({ error: "Failed to fetch from CoinGecko" });
  }
}
