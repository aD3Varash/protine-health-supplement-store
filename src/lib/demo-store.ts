import type { CartItem } from "./cart";

export type DemoProfile = { name: string; email: string };

export type DemoOrderItem = Pick<CartItem, "id" | "key" | "name" | "size" | "image" | "price" | "qty">;

export type DemoOrder = {
  id: string;
  email: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  items: DemoOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentLast4: string;
  createdAt: string;
};

const PROFILE_KEY = "protine:profile:v1";
const ORDERS_KEY = "protine:orders:v2";
const LOCAL_REVIEWS_KEY = "protine:reviews:v1";

function read<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The demo still works for the current page when browser storage is unavailable.
  }
}

export function getDemoProfile() {
  return read<DemoProfile | null>(PROFILE_KEY, null);
}

export function saveDemoProfile(profile: DemoProfile) {
  write(PROFILE_KEY, profile);
}

export function removeDemoProfile() {
  window.localStorage.removeItem(PROFILE_KEY);
}

export function getDemoOrder(id: string) {
  return read<DemoOrder[]>(ORDERS_KEY, []).find((order) => order.id === id) ?? null;
}

export function saveDemoOrder(order: DemoOrder) {
  write(ORDERS_KEY, [order, ...read<DemoOrder[]>(ORDERS_KEY, [])]);
}

export function getLocalReviews(productId: number) {
  return read<Array<{ productId: number; review: { id: number; author: string; rating: number; title: string; body: string; verified: boolean; createdAt: string } }>>(LOCAL_REVIEWS_KEY, [])
    .filter((entry) => entry.productId === productId)
    .map((entry) => entry.review);
}

export function saveLocalReview(productId: number, review: { id: number; author: string; rating: number; title: string; body: string; verified: boolean; createdAt: string }) {
  const existing = read<Array<{ productId: number; review: typeof review }>>(LOCAL_REVIEWS_KEY, []);
  write(LOCAL_REVIEWS_KEY, [{ productId, review }, ...existing]);
}
