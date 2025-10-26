import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names conditionally.
 * Combines clsx and tailwind-merge for optimal class name handling.
 *
 * @param inputs - An array of class names or conditional class name objects.
 * @returns A single merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
