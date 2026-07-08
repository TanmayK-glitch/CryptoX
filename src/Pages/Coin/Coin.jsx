import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { coinContext } from "../../Context/CoinContext";
import LineChart from "../../Components/LineChart/LineChart";

function Coin() {
  const { coinId } = useParams();
  const context = useContext(coinContext);
  const { currency } = context || { currency: { name: "usd", symbol: "$" } };

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoinData = async () => {
    setLoading(true);
    try {
      // Fetch both coin details and historical data concurrently
      const [coinRes, histRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`),
        fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`
        ),
      ]);

      const coinJson = await coinRes.json();
      const histJson = await histRes.json();

      setCoinData(coinJson);
      setHistoricalData(histJson);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinId, currency]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-500 font-medium">Loading coin details...</p>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <i className="ri-error-warning-line text-4xl text-neutral-300 mb-3"></i>
        <p className="text-neutral-500 font-medium">Coin data not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Info & Stats */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Header Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm">
            <img
              src={coinData.image?.large}
              alt={coinData.name}
              className="w-24 h-24 rounded-full mb-4 shadow-sm"
            />
            <h1 className="text-3xl font-bold text-black mb-1">{coinData.name}</h1>
            <p className="text-neutral-500 uppercase tracking-widest text-sm font-bold mb-5">
              {coinData.symbol}
            </p>
            <div className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-full">
              Rank #{coinData.market_cap_rank}
            </div>
          </div>

          {/* Key Stats Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-5">Market Stats</h2>
            <div className="space-y-4 divide-y divide-neutral-100">
              
              <div className="flex justify-between pt-4 first:pt-0 items-center">
                <span className="text-neutral-500 font-medium text-sm">Current Price</span>
                <span className="text-black font-bold">
                  {currency.symbol}
                  {coinData.market_data?.current_price[currency.name]?.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between pt-4 items-center">
                <span className="text-neutral-500 font-medium text-sm">Market Cap</span>
                <span className="text-black font-bold">
                  {currency.symbol}
                  {coinData.market_data?.market_cap[currency.name]?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between pt-4 items-center">
                <span className="text-neutral-500 font-medium text-sm">24h High</span>
                <span className="text-green-600 font-bold">
                  {currency.symbol}
                  {coinData.market_data?.high_24h[currency.name]?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between pt-4 items-center">
                <span className="text-neutral-500 font-medium text-sm">24h Low</span>
                <span className="text-red-600 font-bold">
                  {currency.symbol}
                  {coinData.market_data?.low_24h[currency.name]?.toLocaleString()}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-black mb-6">Price History (Last 10 Days)</h2>
            <div className="flex-1 w-full">
              <LineChart historicalData={historicalData} />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Coin;