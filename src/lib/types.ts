export type Product = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // INR
  compareAt: number | null; // INR
  category: string;
  collections: string[];
  flavor: string;
  servingText: string;
  servings: number;
  stock: number;
  featured: boolean;
  badge: string | null;
  images: string[];
  macros: Record<string, string>;
  ingredients: string;
  details: string;
  rating: number;
  ratingCount: number;
  createdAt: string;
  defaultSize: string;
  sizes: ProductSize[];
};

export type ProductSize = {
  label: string;
  price: number;
  compareAt?: number;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export const CATEGORIES: { slug: string; label: string; blurb: string }[] = [
  {
    slug: "protein",
    label: "Protein",
    blurb: "Straightforward protein formulas for building, recovering, and getting the most from every serving.",
  },
  {
    slug: "creatine",
    label: "Creatine",
    blurb: "The most researched strength supplement, dosed simply and tested batch by batch.",
  },
  {
    slug: "supplements",
    label: "Supplements",
    blurb: "Everyday essentials, workout support, and recovery formulas with clear labels and honest doses.",
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  protein: "Protein",
  creatine: "Creatine",
  supplements: "Supplements",
};
