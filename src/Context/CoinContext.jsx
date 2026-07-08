import { createContext, useState, useEffect, useCallback } from "react";

export const coinContext = createContext();

const CoinContextProvider = (props) => {

    const [allCoin, setAllCoin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    });

    const fetchAllCoin = useCallback(async () => {
        setLoading(true);
        setError(null);

        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

        console.log("[CoinContext] Fetching:", url);

        try {
            const response = await fetch(url);

            console.log("[CoinContext] Response status:", response.status);

            if (!response.ok) {
                // CoinGecko returns 429 when rate-limited
                if (response.status === 429) {
                    throw new Error("Rate limited by CoinGecko. Please wait a moment and try again.");
                }
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("[CoinContext] Data received, type:", typeof data, "isArray:", Array.isArray(data), "length:", data?.length);

            if (Array.isArray(data) && data.length > 0) {
                setAllCoin(data);
                setError(null);
            } else if (Array.isArray(data) && data.length === 0) {
                console.warn("[CoinContext] API returned empty array");
                setAllCoin([]);
                setError("No coins returned from the API.");
            } else {
                // CoinGecko sometimes returns { status: { error_code: 429, ... } }
                console.error("[CoinContext] Unexpected response shape:", data);
                setAllCoin([]);
                setError(data?.status?.error_message || "Unexpected API response. You may be rate-limited.");
            }
        } catch (err) {
            console.error("[CoinContext] Fetch error:", err);
            setError(err.message || "Failed to fetch coin data.");
            // Don't clear allCoin on error if we already have data (stale-while-revalidate)
            // setAllCoin([]);
        } finally {
            setLoading(false);
        }
    }, [currency]);

    useEffect(() => {
        fetchAllCoin();
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