/**
 * Utility for merging class names (clsx + tailwind-merge).
 * Handles conditional classes and deduplicates Tailwind conflicts.
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
