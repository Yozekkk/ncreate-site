import assert from "node:assert/strict";
import test from "node:test";
import { safeAuthRedirect } from "../src/auth-redirect.ts";

test("login redirects stay on this site", () => {
  assert.equal(safeAuthRedirect("/forum/topic/example"), "/forum/topic/example");
  for (const value of ["//evil.example", "/\\evil.example", "https://evil.example", "/\n/evil.example"]) {
    assert.equal(safeAuthRedirect(value), "/forum");
  }
});
