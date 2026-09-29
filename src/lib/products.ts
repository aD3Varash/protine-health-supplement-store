import demoData from "./demo-data.json";
import type { Product, Review } from "./types";

const products = demoData.products as unknown as Product[];
const reviews = demoData.reviews as unknown as (Review & { productId: number })[];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getReviewsForProduct(productId: number): Promise<Review[]> {
  return reviews
    .filter((review) => review.productId === productId)
    .map(({ productId: _productId, ...review }) => review)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  return products
    .filter((product) => product.featured)
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, limit);
}

export async function getRelated(product: Product, all: Product[]): Promise<Product[]> {
  const sameCategory = all.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category === product.category,
  );
  const otherCategories = all.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category !== product.category,
  );
  return [...sameCategory, ...otherCategories]
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, 4);
}

export type HomeReview = Review & { productSlug: string; productName: string };

const HOME_REVIEW_SLUGS = [
  "whey-isolate-dark-cocoa",
  "magnesium-gummies",
  "creatine-monohydrate",
  "ignite-pre-workout",
  "omega-3-1000",
];

export async function getHomeReviews(): Promise<HomeReview[]> {
  return HOME_REVIEW_SLUGS.flatMap((slug) => {
    const product = products.find((candidate) => candidate.slug === slug);
    if (!product) return [];
    const review = reviews
      .filter((candidate) => candidate.productId === product.id && candidate.rating === 5)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
    if (!review) return [];
    const { productId: _productId, ...cleanReview } = review;
    return [{ ...cleanReview, productSlug: product.slug, productName: product.name }];
  });
}
