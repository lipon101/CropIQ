import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `৳${price.toFixed(2)}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateBN(date: string | Date): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  const d = new Date(date)
  const day = String(d.getDate()).replace(/\d/g, (m) => bnDigits[+m])
  const month = d.toLocaleDateString("bn-BD", { month: "long" })
  const year = String(d.getFullYear()).replace(/\d/g, (m) => bnDigits[+m])
  return `${day} ${month}, ${year}`
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "..." : str
}
