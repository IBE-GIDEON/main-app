import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes and handles conditional logic
 * 40-yr dev tip: This is essential for clean dynamic styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}