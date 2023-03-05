import getExchangeValue from "../src/getExchangeValue";
import { CurrencyTable } from "../src/types/CurrencyTable";
import { getFocusedInputValue } from "../src/recalculateCurrencies";
describe("Exchange rate app", () => {
  let exchangeTable: CurrencyTable | undefined;
  let fromInput: HTMLInputElement;
  let toInput: HTMLInputElement;
  let valueRateSpan: HTMLElement;
  let valuesExchangeRate: HTMLElement;
  let inputs: HTMLInputElement[];
  beforeAll(async () => {
    exchangeTable = {
      table: "A",
      currency: "funt szterling",
      code: "GBP",
      rates: [
        { no: "044/A/NBP/2023", effectiveDate: "2023-03-03", mid: 5.3147 },
      ],
    };
    fromInput = document.createElement("input");
    fromInput.id = "from-input";
    fromInput.type = "number";
    toInput = document.createElement("input");
    toInput.id = "to-input";
    toInput.type = "number";
    inputs = [fromInput, toInput];
    inputs.forEach(inputElement => {
      inputElement.addEventListener("input", () => {
        const focusedInputValue = inputs.find(
          input => input === inputElement
        )?.value;
        const oppositeInput = inputs.find(input => input !== inputElement);
        if (oppositeInput?.id === "to-input") {
          oppositeInput.valueAsNumber =
            Math.round(
              Number(focusedInputValue) *
                Number(exchangeTable?.rates[0].mid) *
                100
            ) / 100;
        }
        if (oppositeInput?.id === "from-input") {
          oppositeInput.valueAsNumber = Math.round(
            ((Number(focusedInputValue) / Number(exchangeTable?.rates[0].mid)) *
              100) /
              100
          );
        }
      });
    });
    valueRateSpan = document.createElement("span");
    valueRateSpan.className = "valueRate";
    valuesExchangeRate = document.createElement("span");
    valuesExchangeRate.className = "valuesExchangeRate";
  });

  test("getExchangeValue should return a currency table object", async () => {
    expect.assertions(1);
    const data = await getExchangeValue(
      "http://api.nbp.pl/api/exchangerates/rates/a/gbp/?format=json"
    );
    expect(data).toBeTruthy();
  });

  test("currency table should have rates array with at least one element", () => {
    expect.assertions(1);
    expect(exchangeTable?.rates.length).toBeGreaterThan(0);
  });

  test("fromInput and toInput should be input elements", () => {
    expect.assertions(2);
    expect(fromInput.tagName).toBe("INPUT");
    expect(toInput.tagName).toBe("INPUT");
  });

  test("valueRateSpan and valuesExchangeRate should be span elements", () => {
    expect.assertions(2);
    expect(valueRateSpan.tagName).toBe("SPAN");
    expect(valuesExchangeRate.tagName).toBe("SPAN");
  });

  test("if exchangeTable is undefined, error info should be displayed and an error should be thrown", () => {
    const errorParagraph = document.createElement("p");
    errorParagraph.className = "error-info";
    document.body.appendChild(errorParagraph);
    if (!exchangeTable) {
      const errorInfo =
        "Wystąpił błąd podczas pobierania danych dotyczących aktualnych kursów walut. Spróbuj ponownie później.";
      expect(errorParagraph.textContent).toBe(errorInfo);
      expect(valuesExchangeRate.textContent).toBe("");
      expect(() => {
        throw new Error("Fetch failed!");
      }).toThrow();
    }
  });

  test("if fromInput value changes, toInput value should update with the correct exchange rate", () => {
    fromInput.valueAsNumber = 23;
    fromInput.dispatchEvent(new Event("input"));
    expect(toInput.valueAsNumber).toBe(
      Math.round((23 * Number(exchangeTable!.rates[0].mid) * 100) / 100)
    );
  });

  test("if toInput value changes, fromInput value should update with the correct exchange rate", () => {
    toInput.value = "34";
    toInput.dispatchEvent(new Event("input"));
    expect(fromInput.valueAsNumber).toBe(
      Math.round(
        Number(fromInput.valueAsNumber) /
          Number(exchangeTable?.rates[0].mid) /
          100
      )
    );
  });

  test("get focused input value", () => {
    const inputElement = document.createElement("input");
    inputElement.value = "10";
    expect(getFocusedInputValue(inputElement).toBe(10));
  });
});
