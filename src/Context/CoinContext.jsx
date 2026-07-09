import { createContext, useState, useEffect, useCallback } from "react";
import { throttledFetch } from "../utils/throttledFetch";
import { log, warn, error as logError } from "../utils/logger";

export const coinContext = createContext();

const apiCache = new Map();
const CACHE_TTL = 60 * 1000;

const CoinContextProvider = (props) => {

    const [allCoin, setAllCoin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });

    const fetchAllCoin = useCallback(async (force = false) => {
        setLoading(true);
        setError(null);

        // Route through Vercel serverless proxy — API key injected server-side.
        // .env var: COINGECKO_API_KEY (no VITE_ prefix, server-only, never bundled into client JS)
        const url = `/api/coins?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

        const cached = apiCache.get(url);
        if (!force && cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            log("[CoinContext] Using cached data for:", url);
            setAllCoin(cached.data);
            setLoading(false);
            return;
        }

        log("[CoinContext] Fetching:", url);

        try {
            const response = await throttledFetch(url);

            log("[CoinContext] Response status:", response.status);

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            log("[CoinContext] Data received, type:", typeof data, "isArray:", Array.isArray(data), "length:", data?.length);

            if (Array.isArray(data) && data.length > 0) {
                apiCache.set(url, { data, timestamp: Date.now() });
                setAllCoin(data);
                setError(null);
            } else if (Array.isArray(data) && data.length === 0) {
                warn("[CoinContext] API returned empty array");
                setAllCoin([]);
                setError("No coins returned from the API.");
            } else {
                // CoinGecko sometimes returns { status: { error_code: 429, ... } }
                logError("[CoinContext] Unexpected response shape:", data);
                setAllCoin([]);
                setError(data?.status?.error_message || "Unexpected API response. You may be rate-limited.");
            }
        } catch (err) {
            logError("[CoinContext] Fetch error:", err);
            setError(err.message || "Failed to fetch coin data.");
            // Don't clear allCoin on error if we already have data (stale-while-revalidate)
            // setAllCoin([]);
        } finally {
            setLoading(false);
        }
    }, [currency]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllCoin();
        }, 400);
        return () => clearTimeout(timer);
    }, [fetchAllCoin]);

    const contextValue = {
        allCoin, currency, setCurrency, loading, error, fetchAllCoin
    };

    return (
        <coinContext.Provider value={contextValue}>
            {props.children}
        </coinContext.Provider>
    );
}

export default CoinContextProvider;