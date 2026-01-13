
const apiUrl = "https://api.frankfurter.dev/v1";

interface CurrencyResult {
    amount: number;
    base: string;
    date: string;
    rates: { [a:string] : number };
}
type Currency = "EUR" | "USD" | "GBP" | "JPY" | "THB" ;

const convertCurrency = ( { from, to, amount } : {from: Currency, to: Currency, amount: number}): Promise<CurrencyResult> => {
    return fetch(`${apiUrl}/latest?base=${from}&symbols=${to}&amount=${amount}`).then(resp => resp.json());
}

const main = async () => {
    const a = await convertCurrency(
        {
            from: "USD",
            to: "THB",
            amount: 10
        }
    );
    console.log(a);
}

main();