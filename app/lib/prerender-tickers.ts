import fs from "node:fs/promises";
import path from "node:path";

type KlseCompany = {
  stockTicker?: string;
};

export async function getKlseTickerPrerenderRoutes(): Promise<string[]> {
  const companiesPath = path.resolve("data", "klse-listed-companies.json");
  const content = await fs.readFile(companiesPath, "utf-8");
  const companies = JSON.parse(content) as KlseCompany[];

  const tickers = companies
    .map((company) => company.stockTicker?.trim())
    .filter((ticker): ticker is string => Boolean(ticker));

  return [...new Set(tickers)].map((ticker) => `/ticker/KLSE:${ticker}`);
}
