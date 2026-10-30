import assert from "node:assert/strict";
import { test } from "node:test";
import fixture from "../mock/models.json" with { type: "json" };
import { hiveMenuRows } from "../lib/hive-menu-layout.ts";

// The clipped hexagons meet only if their projections overlap on every edge
// normal. Bounding rectangles alone would report the intended stagger as overlap.
function intersects(a, b) {
  for (const polygon of [a, b]) {
    for (let i = 0; i < polygon.length; i++) {
      const next = polygon[(i + 1) % polygon.length];
      const axis = [next[1] - polygon[i][1], polygon[i][0] - next[0]];
      const project = (points) => points.map(([x, y]) => x * axis[0] + y * axis[1]);
      const ap = project(a), bp = project(b);
      if (Math.max(...ap) <= Math.min(...bp) || Math.max(...bp) <= Math.min(...ap)) return false;
    }
  }
  return true;
}

function assertNoOverlap(tiles, columns, mobile) {
  const rows = hiveMenuRows(tiles, columns, mobile);
  // Dimensions and negative row margins from globals.css; flex rows center
  // their margin boxes, so a left margin moves their content by half its size.
  const width = mobile ? 168 : 236;
  const height = width * 272 / 236;
  const gap = mobile ? 6 : 8;
  const pull = mobile ? width * 46 / 168 : width * 60 / 236;
  const shape = [[0.5, 0], [1, 0.25], [1, 0.75], [0.5, 1], [0, 0.75], [0, 0.25]];
  const placed = rows.flatMap((row, r) => {
    const rowWidth = row.length * width + (row.length - 1) * gap;
    const offset = !mobile && r % 2 ? (width + gap) / 2 : 0;
    return row.flatMap((model, c) => model === null ? [] : [{
      id: model.id,
      polygon: shape.map(([x, y]) => [
        -rowWidth / 2 + offset + c * (width + gap) + x * width,
        r * (height - pull) + y * height,
      ]),
    }]);
  });
  assert.deepEqual(rows.flat().filter((tile) => tile !== null), tiles);
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      assert.ok(!intersects(placed[i].polygon, placed[j].polygon),
        `${tiles.length} models, ${columns} columns, mobile=${mobile}: ${placed[i].id} overlaps ${placed[j].id}`);
    }
  }
}

test("the nine API models do not overlap in the desktop honeycomb", () => {
  assertNoOverlap(fixture.models, 4, false);
});

test("incomplete rows stay aligned after filtering and at every layout size", () => {
  for (let count = 1; count <= 20; count++) {
    const models = Array.from({ length: count }, (_, id) => ({ id: String(id) }));
    for (const [columns, mobile] of [[4, false], [2, false], [2, true]]) {
      assertNoOverlap(models, columns, mobile);
    }
  }
});
