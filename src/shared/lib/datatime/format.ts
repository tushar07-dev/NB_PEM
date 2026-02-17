import { format, isValid } from "date-fns";

export function toFormattedDate(
  input: unknown,
  dateformat = "dd-MM-yyyy"
): string | null {
  let date: Date;

  if (typeof input === "string" || input instanceof Date) {
    date = typeof input === "string" ? new Date(input) : input;
  } else {
    return null;
  }

  if (isValid(date)) {
    return format(date, dateformat); // DD-MM-YYYY format
  }

  return null;
}
