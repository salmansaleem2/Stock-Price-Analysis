import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

async function getStockData(
  ticker: string,
  startDate: string,
  endDate: string
) {
  const filePath = path.join(process.cwd(), "src/app/data/StockPrices.csv");
  const file = fs.readFileSync(filePath, "utf8");
  const parsedData = Papa.parse(file, { header: true }).data;
  const res = parsedData.filter((item) => {
    const date = new Date(item.Date).setHours(0, 0, 0, 0);
    return (
      item.ticker === ticker &&
      date >= new Date(startDate).setHours(0, 0, 0, 0) &&
      date <= new Date(endDate).setHours(0, 0, 0, 0)
    );
  });

  return res;
}

export async function POST(request: Request) {
  const { ticker, startDate, endDate } = await request.json();

  if (!ticker || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const data = await getStockData(ticker, startDate, endDate);
  return NextResponse.json({ message: "Success", data });
}
