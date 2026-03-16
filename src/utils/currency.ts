// utils/currency.ts


type CurrencyFormatOptions = {
  currency?: string; // override khi cần
  locale?: string; // override khi cần
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  amount: number,
  opts: CurrencyFormatOptions = {}
) {
  const locale = opts.locale || "zh-CN";
  const currency = opts.currency || "CNY";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: opts.minimumFractionDigits,
    maximumFractionDigits: opts.maximumFractionDigits,
    // Intl tự set số lẻ chuẩn theo currency (VND/JPY = 0 lẻ; USD/EUR = 2 lẻ)
  }).format(amount);
}

// export async function transitionToDollar(
//   amount: number,
//   currency: string = "USD"
// ) {
//   const exchangerate = await exchangerateApi.getExchangeRate();
//   return amount / exchangerate.data;
// }
