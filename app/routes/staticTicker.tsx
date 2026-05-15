import type { Route } from "./+types/staticTicker";
import { fetchStockDetailsClient } from "../lib/browser-scraper";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  try {
    const url = new URL(request.url);
    const ticker = url.searchParams.get("ticker")?.trim();

    if (!ticker) {
      return new Response(
        JSON.stringify({ error: "Missing ticker query parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const stockDetails = await fetchStockDetailsClient(ticker);
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

export default function StaticTickerRoute({ loaderData }: Route.ComponentProps) {
  const { name, ticker, lastPrice, timestamp, error } = loaderData;

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
      <h1 className="text-2xl font-bold mb-2">
        {name} ({ticker})
      </h1>
      <p className="text-lg">{lastPrice}</p>
      <p className="text-sm text-gray-500">{timestamp}</p>
    </div>
  );
}
