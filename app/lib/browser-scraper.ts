export interface StockDetails {
  name: string;
  ticker: string;
  lastPrice: number;
  todayChange: number;
  todayChangeValue: number;
  timestamp: string;
}

export async function fetchStockDetailsClient(
  exchangeTicker: string
): Promise<StockDetails> {
  const ticker = exchangeTicker.replace(/^KLSE:/i, "").toUpperCase().trim();

  if (!ticker) {
    throw new Error("Please enter a stock ticker");
  }

  const url = `https://klse.i3investor.com/quoteservlet.jsp?sa=ss&q=${encodeURIComponent(
    ticker
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data: ${response.statusText}`);
  }

  const html = await response.text();
  const stockData = parseStockDataInBrowser(html, ticker);

  if (!stockData) {
    throw new Error(`Failed to parse stock details for ${ticker}`);
  }

  return stockData;
}

function parseStockDataInBrowser(
  html: string,
  fallbackTicker: string
): StockDetails | null {
  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    const priceText =
      document
        .querySelector("table#stockhdr > tbody > tr:last-child > td:first-child")
        ?.textContent?.trim() ?? "";

    if (!priceText) {
      throw new Error("Stock data not found. Ticker may be invalid.");
    }

    const stockNameText =
      document
        .querySelector(
          "#content > table:nth-child(2) > tbody > tr > td:nth-child(1) > div.margint10 > table:nth-child(2) > tbody > tr > td:nth-child(1) > span"
        )
        ?.textContent?.trim() ?? "";

    const companyName =
      document
        .querySelector(
          "#content > table:nth-child(2) > tbody > tr > td:nth-child(1) > div.margint10 > table:nth-child(2) > tbody > tr > td:nth-child(3) > span"
        )
        ?.textContent?.trim() ?? "";

    let parsedTicker = fallbackTicker;
    if (stockNameText) {
      const parts = stockNameText.split(":");
      if (parts.length > 1) {
        const tickerPart = parts[1]?.trim().split(/\s+/)[0];
        if (tickerPart) {
          parsedTicker = tickerPart;
        }
      }
    }

    const lastPrice = Number.parseFloat(priceText.replace(/,/g, ""));
    if (!Number.isFinite(lastPrice) || lastPrice <= 0) {
      throw new Error("Could not parse stock price");
    }

    const changeText =
      document.querySelector("#stockhdr > tbody > tr:nth-child(2) > td:nth-child(2) > span")
        ?.textContent?.trim() ?? "";

    const changeParts = changeText.split(/\s+/);
    const todayChangeValue = Number.parseFloat(
      (changeParts[0] ?? "0").replace(/,/g, "")
    );

    const percentMatch = (changeParts[1] ?? "").match(/([-+]?\d+\.?\d*)/);
    const todayChange = percentMatch ? Number.parseFloat(percentMatch[1]) : 0;

    return {
      name: companyName || fallbackTicker,
      ticker: `KLSE:${parsedTicker}`,
      lastPrice,
      todayChange: Number.isFinite(todayChange) ? todayChange : 0,
      todayChangeValue: Number.isFinite(todayChangeValue) ? todayChangeValue : 0,
      timestamp: new Intl.DateTimeFormat("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(new Date()),
    };
  } catch {
    return null;
  }
}
