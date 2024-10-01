import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsisMiddle(
  text: string,
  startLength: number,
  endLength: number,
): string {
  if (text.length <= startLength + endLength) {
    return text;
  }
  const start = text.slice(0, startLength);
  const end = text.slice(-endLength);
  return `${start}...${end}`;
}
