/**
 * Converts a hex color string (with or without #, and 3 or 6 digits) to an rgba string.
 * @param hex The hex color string (e.g., "#FF0000" or "F00").
 * @param alpha The alpha value (from 0 to 1).
 * @returns The rgba sequence string like "rgba(255, 0, 0, 0.5)".
 */
export function hexToRgba(hex: string, alpha: number): string {
  let c: string = hex.replace('#', '');

  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }

  if (c.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
