import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    // toast.success("Copied to clipboard");
  } catch (error) {
    // toast.error("Error copying to clipboard");
  }
}
