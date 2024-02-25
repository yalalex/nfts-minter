export function getRandomValue(
  min: number,
  max: number,
  fixed: number
): number {
  const range = max - min;
  const random = Math.random() * range + min;
  return Number(random.toFixed(fixed));
}
