import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isAfter, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMessageDate = (date: string) =>
  isAfter(date, subDays(new Date(), 7))
    ? formatDistanceToNow(date, { addSuffix: true })
    : format(date, "MMM d, yyyy");
