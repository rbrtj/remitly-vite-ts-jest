import { CurrencyTable } from "./types/CurrencyTable";

export default async function getExchangeValue(
  url: string
): Promise<CurrencyTable | undefined> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    return undefined;
  }
}
