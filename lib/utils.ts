export function formatNaira(amountInKobo: number, showDecimals: boolean = true) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(amountInKobo / 100);
}