import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`
}

export function calculateShipping(subtotal: number, threshold = 2999, fee = 250): number {
  if (subtotal <= 0) return 0
  return subtotal >= threshold ? 0 : fee
}
