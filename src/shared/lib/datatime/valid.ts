import { differenceInSeconds, isValid, parseISO } from "date-fns";

export function isDateTimeAtLeastSecondsOld(
  dateStr: string,
  thresholdInSeconds: number
): boolean {
  // Clean and parse the input date (remove long milliseconds and add 'Z' for UTC)
  const trimmedDateStr = dateStr.split(".")[0] + "Z";
  const parsedDate = parseISO(trimmedDateStr);

  if (!isValid(parsedDate)) {
    throw new Error("Invalid date string");
  }

  const secondsOld = differenceInSeconds(new Date(), parsedDate);
  return secondsOld >= thresholdInSeconds;
}
