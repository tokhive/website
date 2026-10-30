/** Mobile honeycombs alternate wide rows with a single centered tile. */
export function hiveMenuRows<T>(tiles: T[], columns: number, mobile: boolean): (T | null)[][] {
  const rows: (T | null)[][] = [];
  for (let i = 0; i < tiles.length;) {
    const count = mobile && rows.length % 2 ? 1 : columns;
    const row: (T | null)[] = tiles.slice(i, i + count);
    // Center partial rows on whole grid slots. Centering the shorter flex
    // row itself can put a hexagon directly over the row above it.
    const leading = Math.floor((count - row.length) / 2);
    row.unshift(...Array<null>(leading).fill(null));
    while (row.length < count) row.push(null);
    rows.push(row);
    i += count;
  }
  return rows;
}
