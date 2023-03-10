import getExchangeValue from "./getExchangeValue";
import { CurrencyTable } from "./types/CurrencyTable";
const fromInput = document.getElementById("from-input") as HTMLInputElement;
const toInput = document.getElementById("to-input") as HTMLInputElement;
const valueRateSpan = document.querySelector(".valueRate") as HTMLElement;
const valuesExchangeRate = document.querySelector(
  ".valuesExchangeRate"
) as HTMLElement;
//It is possible to get every input element by a class, but the HTMLElements array isn't iterable.
const inputs: HTMLInputElement[] = [fromInput, toInput];
let exchangeTable: CurrencyTable | undefined;
let exchangeValue: number;

export async function getExchangedValue() {
  exchangeTable = await getExchangeValue(
    "http://api.nbp.pl/api/exchangerates/rates/a/gbp/?format=json"
  );
  if (!exchangeTable) return;
  exchangeValue = exchangeTable?.rates[0].mid as number;
  valueRateSpan.textContent = exchangeValue.toFixed(2) + " PLN";
}

export async function setInitialData() {
  await getExchangedValue();
  if (!exchangeTable) {
    const errorParagraph = document.querySelector(".error-info") as HTMLElement;
    errorParagraph.textContent =
      "Wystąpił błąd podczas pobierania danych dotyczących aktualnych kursów walut. Spróbuj ponownie później.";
    valuesExchangeRate.textContent = "";
    throw new Error("Fetch failed!");
  }
}

setInitialData();

export function getFocusedInputValue(inputElement: HTMLInputElement) {
  return inputs.find(input => input === inputElement)?.value;
}

export function findOppositeInput(inputElement: HTMLInputElement) {
  return inputs.find(input => input !== inputElement);
}

export function calculateToInput(
  focusedInputValue: string,
  exchangeValue: number
) {
  return +(Number(focusedInputValue) * Number(exchangeValue)).toFixed(2);
}

export function calculateFromInput(
  focusedInputValue: string,
  exchangeValue: number
) {
  return +(Number(focusedInputValue) / Number(exchangeValue)).toFixed(2);
}

export function recalculateValues(inputElement: HTMLInputElement) {
  const focusedInputValue = getFocusedInputValue(inputElement);
  const oppositeInput = findOppositeInput(inputElement);
  if (oppositeInput?.id === "to-input") {
    oppositeInput.valueAsNumber = calculateToInput(
      focusedInputValue as string,
      exchangeValue
    );
  } else if (oppositeInput?.id === "from-input") {
    oppositeInput.valueAsNumber = calculateFromInput(
      focusedInputValue as string,
      exchangeValue
    );
  }
}

inputs.forEach(inputElement => {
  inputElement.addEventListener("input", () => {
    recalculateValues(inputElement);
  });
});
