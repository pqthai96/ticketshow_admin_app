import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and optimizes Tailwind CSS classes
 * using clsx for conditional classes and tailwind-merge to resolve conflicts
 *
 * @param inputs - Class names, objects, or arrays to combine
 * @returns Optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}