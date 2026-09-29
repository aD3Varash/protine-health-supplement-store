export const FREE_SHIPPING_THRESHOLD = 1999;
export const SHIPPING_FLAT = 99;

export function money(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
