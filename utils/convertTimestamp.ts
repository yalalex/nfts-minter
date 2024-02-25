export function convertTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const formattedTime = date.toLocaleTimeString();
  return formattedTime;
}
