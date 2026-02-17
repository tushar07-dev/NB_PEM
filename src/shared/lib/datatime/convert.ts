export function convertDateToEpoch(date: string) {
  const epoch = Math.floor(new Date(date).getTime() / 1000); // In seconds
  return epoch;
}
