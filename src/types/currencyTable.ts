export type CurrencyTable = {
  code: string;
  table: string;
  currency: string;
  rates: Rates[];
};

export type Rates = {
  no: string;
  effectiveDate: string;
  mid: number;
};
