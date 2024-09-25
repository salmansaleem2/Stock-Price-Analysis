"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockRow {
  Date: string;
  Close: number;
  Ticker: string;
}

interface StockData {
  ticker: string;
  data: StockRow[];
}

const StockForm = () => {
  const [tickers] = useState<string[]>(["AAPL", "MSFT", "AMZN"]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (stockData.length > 0) {
      createChartData();
    }
  }, [stockData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTickers.length === 0 || !startDate || !endDate) {
      setErrorMessage(
        "Please select at least one ticker and fill in all fields."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    const fetchedData: StockData[] = [];

    try {
      for (const ticker of selectedTickers) {
        const response = await fetch("/api/stocks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticker, startDate, endDate }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stock data.");
        }

        const data = await response.json();
        fetchedData.push({ ticker, data: data.data });
      }

      setStockData(fetchedData);
    } catch (error) {
      setErrorMessage("Error fetching stock data.");
    } finally {
      setLoading(false);
    }
  };

  const createChartData = () => {
    const datasets = stockData.map((stock) => ({
      label: stock.ticker,
      data: stock.data.map((row) => row.close),
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    }));

    return {
      labels: stockData[0].data.map((row) => row.Date),
      datasets,
    };
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center  p-4 sm:p-8">
      <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-8 w-full max-w-sm sm:max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-4 sm:mb-6">
          Stock Price Analysis
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-blue-500">
              Select Tickers:
            </label>
            <select
              value={selectedTickers}
              onChange={(e) => {
                const options = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setSelectedTickers(options);
              }}
              className="border rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select a ticker...
              </option>
              {tickers.map((ticker) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-blue-500">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-500">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md p-2 sm:p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-600 text-white p-2 sm:p-3 rounded-md w-full hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Analyze"}
          </button>
        </form>

        {errorMessage && (
          <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
        )}

        {stockData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-blue-600">
              Stock Data Table
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border px-2 sm:px-4 py-2">Date</th>
                    {selectedTickers.map((ticker) => (
                      <th key={ticker} className="border px-2 sm:px-4 py-2">
                        {ticker} Close
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stockData?.[0]?.data?.map((row, index) => (
                    <tr
                      key={row.Date}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="border px-2 sm:px-4 py-2 text-center">
                        {row.Date ? row.Date : "N/A"}
                      </td>
                      <td className="border px-2 sm:px-4 py-2 text-center">
                        {row.close ? row.close : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mt-8 text-blue-600">
              Stock Price Chart
            </h2>
            <div className="mt-4">
              <Line
                data={createChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: "Stock Price Comparison",
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockForm;
