import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { coinContext } from "../../Context/CoinContext";
import LineChart from "../../Components/LineChart/LineChart";

function Coin() {
  const { coinId } = useParams();
  const context = useContext(coinContext);
  const { currency } = context || { currency: { name: "usd", symbol: "$" } };

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoinData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coinRes, histRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`),
        fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`
        ),
      ]);

      if (!coinRes.ok || !histRes.ok) {
        throw new Error(
          `API returned ${coinRes.status} / ${histRes.status}. You may be rate-limited — try again shortly.`
        );
      }

      const coinJson = await coinRes.json();
      const histJson = await histRes.json();

      setCoinData(coinJson);
      setHistoricalData(histJson);
    } catch (err) {
      console.error("Error fetching coin details:", err);
      setError(err.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinId, currency]);

  // Dynamic page title
  useEffect(() => {
    if (coinData?.name) {
      document.title = `${coinData.name} — CryptoX`;
    } else {
      document.title = "Coin Details — CryptoX";
    }
    return () => {
      document.title = "CryptoX";
    };
  }, [coinData]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-500 font-medium">Loading coin details...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <i className="ri-error-warning-line text-5xl text-red-400 mb-4"></i>
        <h2 className="text-xl font-bold text-black mb-2">Failed to load data</h2>
        <p className="text-neutral-500 text-sm max-w-md mb-6">{error}</p>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 border border-neutral-200 hover:border-neutral-400 text-black text-sm font-medium rounded-lg transition-colors"
          >
            ← Back Home
          </Link>
          <button
            onClick={fetchCoinData}
            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- Missing Data State ---
  if (!coinData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <i className="ri-error-warning-line text-4xl text-neutral-300 mb-3"></i>
        <p className="text-neutral-500 font-medium">Coin data not found.</p>
      </div>
    );
  }

  // Helper for safe stat display
  const formatStat = (value) => {
    if (value == null) return "—";
    return value.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Top Bar: Back + Refresh */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <i className="ri-arrow-left-line text-base"></i>
          Back
        </Link>
        <button
          onClick={fetchCoinData}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-400 rounded-lg transition-colors cursor-pointer"
        >
          <i className="ri-refresh-line text-base"></i>
          Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Left Column: Info & Stats */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">

          {/* Header Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm">
            {coinData.image?.large ? (
              <img
                src={coinData.image.large}
                alt={coinData.name}
                className="w-24 h-24 rounded-full mb-4 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full mb-4 bg-neutral-100 flex items-center justify-center">
                <i className="ri-coin-line text-3xl text-neutral-400"></i>
              </div>
            )}
            <h1 className="text-3xl font-bold text-black mb-1">
              {coinData.name || "Unknown"}
            </h1>
            <p className="text-neutral-500 uppercase tracking-widest text-sm font-bold mb-5">
              {coinData.symbol || "—"}
            </p>
            {coinData.market_cap_rank && (
              <div className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-full">
                Rank #{coinData.market_cap_rank}
              </div>
            )}
          </div>

          {/* Key Stats Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-5">Market Stats</h2>
            <div className="space-y-4 divide-y divide-neutral-100">

              <div className="flex justify-between pt-4 first:pt-0 items-center">
                <span className="text-neutral-500 font-medium text-sm">Current Price</span>
                <span className="text-black font-bold">
                  {currency.symbol}
                  {formatStat(coinData.market_data?.current_price?.[currency.name])}
                </span>
              </div>

              <div className="flex justify-between pt-4 items-center">
                <span className="text-neutral-500 font-medium text-sm">Market Cap</span>
                <span className="text-black font-bold">
                  {currency.symbol}
                  {formatStat(coinData.market_data?.market_cap?.[currency.name])}
                </span>
              </div>

              <div className="flex justify-between pt-4 items-center">
                <span className="text-neutral-500 font-medium text-sm">24h High</span>
                <span className="text-green-600 font-bold">
                  {currency.symbol}
                  {formatStat(coinData.market_data?.high_24h?.[currency.name])}
                </span>
              </div>

              <div className="flex justify-between pt-4 items-center">
                <span className="text-neutral-500 font-medium text-sm">24h Low</span>
                <span className="text-red-600 font-bold">
                  {currency.symbol}
                  {formatStat(coinData.market_data?.low_24h?.[currency.name])}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="w-full lg:w-2/3 min-w-0">
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-black mb-6">Price History (Last 10 Days)</h2>
            <div className="flex-1 w-full overflow-x-auto">
              <div className="min-w-[300px]">
                <LineChart historicalData={historicalData?.prices ? historicalData : null} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Coin;