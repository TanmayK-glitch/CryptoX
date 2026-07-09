import { useContext, useEffect, useState } from "react";
import { coinContext } from "../../Context/CoinContext";
import { Link } from "react-router-dom";

function Home() {
  const context = useContext(coinContext);
  const { allCoin, currency, loading, error, fetchAllCoin } = context || {
    allCoin: [],
    currency: { symbol: "$" },
    loading: false,
    error: null,
    fetchAllCoin: () => {},
  };
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");

  const inputHandler = (e) => {
    setInput(e.target.value);
    if (e.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  };

  if (!context) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-3"></div>
        <p className="text-neutral-400 text-sm">Loading...</p>
      </div>
    );
  }

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  useEffect(() => {
    document.title = "CryptoX — Crypto Marketplace";
    return () => { document.title = "CryptoX"; };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-black tracking-tight mb-4">
          Crypto Marketplace
        </h1>
        <p className="text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
          Real-time cryptocurrency prices and market trends. Track Bitcoin,
          Ethereum, and all major altcoins.
        </p>
      </div>

      {/* Search Bar */}
      <form
        id="search"
        onSubmit={searchHandler}
        className="max-w-xl mx-auto mb-12"
      >
        <div className="flex items-center border border-neutral-200 rounded-lg hover:border-neutral-300 focus-within:border-black transition-colors">
          <div className="flex items-center flex-1 px-4">
            <i className="ri-search-line text-neutral-400 text-lg mr-3"></i>
            <input
              type="text"
              onChange={inputHandler}
              value={input}
              list="coinList"
              placeholder="Search coins..."
              className="flex-1 bg-transparent text-black placeholder-neutral-400 outline-none py-3 text-sm"
            />
            <datalist id="coinList">
              {allCoin.map((item, index) => (
                <option key={index} value={item.name} />
              ))}
            </datalist>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 m-1 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-md transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Coin List Section */}
      <div className="md:border md:border-neutral-200 md:rounded-lg md:overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-neutral-50 border-b border-neutral-200 text-xs font-medium text-neutral-500 uppercase tracking-wide">
          <div>#</div>
          <div>Coin</div>
          <div className="text-right">Price</div>
          <div className="text-right">24H</div>
          <div className="text-right">Market Cap</div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-3"></div>
            <p className="text-neutral-400 text-sm">Loading coins...</p>
          </div>
        ) : displayCoin && displayCoin.length > 0 ? (
          <div className="flex flex-col gap-4 md:gap-0 md:divide-y md:divide-neutral-100">
            {displayCoin.slice(0, 10).map((item, index) => (
              <Link
                to={`/coin/${item.id}`}
                key={index}
                className="block bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md md:border-none md:rounded-none md:p-0 md:shadow-none md:hover:shadow-none md:hover:bg-neutral-100 transition-all cursor-pointer"
              >
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 items-center">
                  <div className="text-neutral-400 text-sm font-medium">
                    {item.market_cap_rank || "—"}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-7 h-7 rounded-full"
                    />
                    <div>
                      <p className="text-black font-medium text-sm">{item.name}</p>
                      <p className="text-neutral-400 text-xs uppercase">
                        {item.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-black text-sm font-medium">
                    {currency.symbol}
                    {item.current_price?.toLocaleString() || "—"}
                  </div>
                  <div
                    className={`text-right text-sm font-medium ${item.price_change_percentage_24h > 0
                        ? "text-green-700"
                        : "text-red-700"
                      }`}
                  >
                    {item.price_change_percentage_24h > 0 ? "+" : ""}
                    {item.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                  </div>
                  <div className="text-right text-neutral-600 text-sm">
                    {currency.symbol}
                    {item.market_cap?.toLocaleString() || "—"}
                  </div>
                </div>

                {/* Mobile Row */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400 text-xs font-medium w-5">
                        #{item.market_cap_rank}
                      </span>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-black font-medium text-sm">{item.name}</p>
                        <p className="text-neutral-400 text-xs uppercase">
                          {item.symbol}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <div className="text-left">
                       <p className="text-neutral-400 text-[11px] uppercase tracking-wider mb-0.5">Price</p>
                       <p className="text-black font-semibold text-sm">
                        {currency.symbol}
                        {item.current_price?.toLocaleString()}
                       </p>
                    </div>
                    <div className="text-right">
                       <p className="text-neutral-400 text-[11px] uppercase tracking-wider mb-0.5">24h Change</p>
                      <p
                        className={`text-sm font-semibold ${item.price_change_percentage_24h > 0
                            ? "text-green-600"
                            : "text-red-600"
                          }`}
                      >
                        {item.price_change_percentage_24h > 0 ? "+" : ""}
                        {item.price_change_percentage_24h?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <i className={`${error ? 'ri-error-warning-line text-red-300' : 'ri-coin-line text-neutral-300'} text-3xl mb-3`}></i>
            <p className="text-neutral-500 text-sm font-medium mb-1">
              {error ? 'Failed to load coins' : 'No coins available'}
            </p>
            {error && (
              <>
                <p className="text-neutral-400 text-xs max-w-sm mb-4">{error}</p>
                <button
                  onClick={fetchAllCoin}
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
