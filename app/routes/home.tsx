import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { fetchStockDetailsClient, type StockDetails } from "../lib/browser-scraper";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KLSE Stock Quotes - Check Malaysian Stock Prices" },
    {
      name: "description",
      content:
        "Real-time KLSE stock quotes and prices. Search for Malaysian listed stocks on Kuala Lumpur Stock Exchange.",
    },
    { name: "keywords", content: "KLSE, stock quotes, Malaysian stocks, pricing" },
    {
      property: "og:title",
      content: "KLSE Stock Quotes - Check Malaysian Stock Prices",
    },
    {
      property: "og:description",
      content:
        "Real-time KLSE stock quotes and prices. Search for Malaysian listed stocks on Kuala Lumpur Stock Exchange.",
    },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "KLSE Stock Quotes" },
  ];
}

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [requestedTicker, setRequestedTicker] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockDetails | null>(null);

  useEffect(() => {
    if (!requestedTicker) {
      return;
    }

    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchStockDetailsClient(requestedTicker);
        if (active) {
          setStockData(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [requestedTicker]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tickerValue = ticker.toUpperCase().trim();
    if (!tickerValue) {
      setError("Please enter a stock ticker");
      return;
    }

    setStockData(null);
    setRequestedTicker(tickerValue);
  };

  const handleReset = () => {
    setTicker("");
    setRequestedTicker(null);
    setStockData(null);
    setError(null);
    setLoading(false);
  };

  const getChangeDisplay = (data: StockDetails) => {
    const value = data.todayChangeValue;
    const percentage = data.todayChange;

    // Prefer value direction for display to avoid mixed signs such as "+-0.01".
    const sign = value > 0 ? "+" : value < 0 ? "-" : "";
    const colorClass = value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-700";

    return {
      colorClass,
      text: `${sign}${Math.abs(value).toFixed(2)} (${sign}${Math.abs(percentage).toFixed(2)}%)`,
    };
  };

  const changeDisplay = stockData ? getChangeDisplay(stockData) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            KLSE Stock Quotes
          </h1>
          <p className="text-xl text-gray-600">
            Real-time quotes for Kuala Lumpur Stock Exchange listed companies
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Ticker
              </label>
              <input
                id="ticker"
                type="text"
                placeholder="e.g., MAYBANK"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder-gray-400"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the stock ticker symbol (e.g., MAYBANK, CIMB, TENAGA)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Searching..." : "Get Stock Details"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Stock Details Card */}
        {stockData && changeDisplay && (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-600 text-sm">Company Name</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stockData.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Ticker</p>
                  <p className="text-xl font-semibold text-indigo-600">
                    {stockData.ticker}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Last Price</p>
                  <p
                    className={`text-xl font-semibold ${
                      stockData.todayChangeValue > 0
                        ? "text-green-600"
                        : stockData.todayChangeValue < 0
                          ? "text-red-600"
                          : "text-gray-700"
                    }`}
                  >
                    RM {stockData.lastPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Today's Change</p>
                <p className={`text-lg font-semibold ${changeDisplay.colorClass}`}>
                  {changeDisplay.text}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm">Last Updated</p>
                <p className="text-sm text-gray-700">{stockData.timestamp}</p>
              </div>
            </div>

            {/* API Endpoint Info */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 mb-2">API Endpoint:</p>
              <code className="bg-gray-100 text-gray-800 text-xs p-2 rounded block break-all">
                /ticker/{stockData.ticker}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  setTicker("");
                  setRequestedTicker(null);
                  setStockData(null);
                  setError(null);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                New Search
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!stockData && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              How to use
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-3">1.</span>
                <span>Enter the KLSE stock ticker in the search box above</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-3">2.</span>
                <span>Click "Get Stock Details" to fetch the latest data</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-3">3.</span>
                <span>
                  You can also access the JSON API directly at{" "}
                  <code className="bg-gray-100 text-gray-800 px-1 rounded">
                    /ticker/TICKER
                  </code>
                </span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">
                Popular Stocks
              </h3>
              <div className="flex flex-wrap gap-2">
                {["MAYBANK", "CIMB", "TENAGA", "PETRONAS", "YTL"].map(
                  (stock) => (
                    <button
                      key={stock}
                      onClick={() => setTicker(stock)}
                      className="bg-gray-100 hover:bg-indigo-100 text-gray-800 hover:text-indigo-700 px-3 py-1 rounded text-sm transition duration-200"
                    >
                      {stock}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
