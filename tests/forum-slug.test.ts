import assert from "node:assert/strict";
import test from "node:test";
import { slugify } from "../src/forum-slug.ts";
test("forum slugs obey the actual RPC contract for Russian and Unicode titles", () => {
  for (const title of ["Русская тема", "NCreate — новый сервер", "Привет 👋", "東京", "---", "éèá test"]) {
    assert.match(slugify(title), /^[a-z0-9]+(?:-[a-z0-9]+)*-[0-9a-f]{8}$/);
  }
  assert.notEqual(slugify("Одна тема"), slugify("Одна тема"));
});
