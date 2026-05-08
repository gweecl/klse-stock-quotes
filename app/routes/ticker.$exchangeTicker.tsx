import type { Route } from "./+types/ticker.$exchangeTicker";
import { fetchStockDetailsClient, type StockDetails } from "../lib/browser-scraper";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  try {
    const { exchangeTicker } = params;

    if (!exchangeTicker) {
      return new Response(
        JSON.stringify({ error: "Missing exchangeTicker parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const stockDetails = await fetchStockDetailsClient(exchangeTicker);
    return new Response(JSON.stringify(stockDetails), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=60",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stock details";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default function TickerRoute({loaderData}: Route.ComponentProps) {
  const { name, ticker, lastPrice, timestamp, error } = loaderData;

  // Handle case where loaderData is not available or has an error
  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-red-500">{error || "Unknown error occurred"}</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{name} ({ticker})</h1>
      <p className="text-lg">{lastPrice}</p>
      <p className="text-sm text-gray-500">{timestamp}</p>
    </div>
  );
}
