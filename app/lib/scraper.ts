/**
 * KLSE Stock Quotes Scraper
 * Fetches stock data from KLSE i3investor API using Cheerio for HTML parsing
 */

import { load } from "cheerio";

export interface StockDetails {
  name: string;
  ticker: string;
  lastPrice: number;
  todayChange: number; // percentage change (e.g., 2.5 for +2.5%)
  todayChangeValue: number; // point change (e.g., 0.50)
  timestamp: string;
}

export async function fetchStockDetails(
  ticker: string
): Promise<StockDetails> {
  try {
    const url = `https://klse.i3investor.com/quoteservlet.jsp?sa=ss&q=${ticker}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const html = await response.text();

    // Parse the HTML response using Cheerio
    const stockData = parseStockDataWithCheerio(html, ticker);
    if (!stockData) {
      throw new Error("Could not parse stock data from response");
    }

    return stockData;
  } catch (error) {
    throw new Error(
      `Failed to fetch stock details for ${ticker}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

function parseStockDataWithCheerio(
  html: string,
  ticker: string
): StockDetails | null {
  try {
    const $ = load(html);

    // Check if this is a valid stock page (not a search results page)
    const stockPriceElement = $("table#stockhdr > tbody > tr:last-child > td:first-child").text().trim();
    if (!stockPriceElement) {
      throw new Error("Stock data not found - invalid page or ticker");
    }

    // Extract stock name and ticker
    const stockNameElement = $("#content > table:nth-child(2) > tbody > tr > td:nth-child(1) > div.margint10 > table:nth-child(2) > tbody > tr > td:nth-child(1) > span")
      .text()
      .trim();
    const companyName = $("#content > table:nth-child(2) > tbody > tr > td:nth-child(1) > div.margint10 > table:nth-child(2) > tbody > tr > td:nth-child(3) > span")
      .text()
      .trim();

    // Parse name and ticker from stockNameElement (format: "KLSE:TICKER Name")
    let name = companyName || ticker;
    let parsedTicker = ticker;
    
    if (stockNameElement) {
      const parts = stockNameElement.split(":");
      if (parts.length > 1) {
        const tickerPart = parts[1].trim().split(/\s+/);
        parsedTicker = tickerPart[0] || ticker;
      }
    }

    // Extract stock price
    const stockPrice = parseFloat(stockPriceElement.replace(/,/g, ""));
    if (isNaN(stockPrice) || stockPrice <= 0) {
      throw new Error("Could not parse stock price");
    }

    // Extract daily change (amount and percentage)
    const changeElement = $("#stockhdr > tbody > tr:nth-child(2) > td:nth-child(2) > span").text().trim();
    const changeParts = changeElement.split(/\s+/);
    
    let todayChangeValue = 0;
    let todayChange = 0;
    
    if (changeParts.length >= 2) {
      todayChangeValue = parseFloat(changeParts[0].replace(/,/g, ""));
      // Extract percentage from format like "(+2.34%)" or "(-1.50%)"
      const percentStr = changeParts[1] || "";
      const percentMatch = percentStr.match(/([-+]?\d+\.?\d*)/);
      if (percentMatch) {
        todayChange = parseFloat(percentMatch[1]);
      }
    }

    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

    return {
      name,
      ticker: `KLSE:${parsedTicker}`,
      lastPrice: stockPrice,
      todayChange,
      todayChangeValue,
      timestamp,
    };
  } catch (error) {
    console.error("Error parsing stock data with Cheerio:", error);
    return null;
  }
}
