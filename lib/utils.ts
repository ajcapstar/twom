export function formatNaira(amountInKobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0, // Hides the .00 if you don't want it
  }).format(amountInKobo / 100);
}