import assert from "node:assert/strict";
import { test } from "node:test";
import { parse, TYPE } from "@formatjs/icu-messageformat-parser";
import en from "../messages/en.json" with { type: "json" };
import zh from "../messages/zh.json" with { type: "json" };

/** Flattens nested messages to { "Home.hero.earn": "Earn." }. */
function flatten(messages, prefix = "") {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "string" ? [[prefix + key, value]] : flatten(value, `${prefix}${key}.`));
}

/** Argument and tag names a message uses, which every translation must keep. */
function names(message) {
  const found = new Set();
  const walk = (elements) => {
    for (const el of elements) {
      if (el.type === TYPE.argument || el.type === TYPE.number || el.type === TYPE.date || el.type === TYPE.time) found.add(`{${el.value}}`);
      if (el.type === TYPE.plural || el.type === TYPE.select) {
        found.add(`{${el.value}}`);
        for (const option of Object.values(el.options)) walk(option.value);
      }
      if (el.type === TYPE.tag) {
        found.add(`<${el.value}>`);
        walk(el.children);
      }
    }
  };
  walk(parse(message));
  return [...found].sort();
}

const english = new Map(flatten(en));
const chinese = new Map(flatten(zh));

test("every locale has the same message keys", () => {
  assert.deepEqual([...chinese.keys()].sort(), [...english.keys()].sort());
});

test("translations keep each message's placeholders and tags", () => {
  for (const [key, message] of english) {
    assert.deepEqual(names(chinese.get(key)), names(message), key);
  }
});

test("the same page in another locale keeps English at the root", async () => {
  const { localizedPath } = await import("../i18n/routing.ts");
  assert.equal(localizedPath("/", "en"), "/");
  assert.equal(localizedPath("/", "zh"), "/zh/");
  assert.equal(localizedPath("/models", "zh"), "/zh/models/");
  assert.equal(localizedPath("/models/", "en"), "/models/");
});
