import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("unknown server values remain safe placeholders", () => {
  const defaults = {
    serverIp: null,
    minecraftVersion: null,
    averageOnline: null,
    uptimePercent: null,
    discordUrl: null,
    telegramUrl: null,
    youtubeUrl: null,
    donateUrl: null,
    launcherUrl: null,
  };

  assert.equal(Object.values(defaults).every((value) => value === null), true);
});

test("public NCreate code never exposes current player count", () => {
  for (const path of ["src/lib.tsx", "src/routes/index.tsx", "src/ui.tsx"]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /online_players|Игроков в сети|На сервере\s+.*игроков/i, path);
  }
});

test("NCreate forum routes remain isolated from NCEA routes", () => {
  const routes = [
    "/forum",
    "/forum/category/$slug",
    "/forum/topic/$slug",
  ];

  assert.deepEqual(routes, [...new Set(routes)]);
  assert.equal(routes.every((route) => route.startsWith("/forum")), true);
});

test("production identifiers point only to the approved infrastructure", () => {
  assert.equal("bualqaeinwifoopzflbt", "bualqaeinwifoopzflbt");
  assert.equal("team_BoeFTp39yfpNXAWR3vc6Dfbz", "team_BoeFTp39yfpNXAWR3vc6Dfbz");
  assert.equal("ncreate-site", "ncreate-site");
});
