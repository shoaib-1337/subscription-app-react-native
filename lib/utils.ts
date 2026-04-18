/**
 * Formats a numeric value into a currency string.
 * @param value The numeric value to format.
 * @param currency The currency code (e.g., 'USD', 'EUR'). Defaults to 'USD'.
 * @returns A formatted currency string.
 */
export const formatCurrency = (
  value: number,
  currency: string = "USD"
): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback if Intl.NumberFormat fails or currency code is invalid
    console.error("Error formatting currency:", error);
    const symbol = currency === "USD" ? "$" : `${currency} `;
    return `${symbol}${value.toFixed(2)}`;
  }
};
