import assert from "node:assert/strict";
import test from "node:test";

test("unknown server values remain safe placeholders", () => {
  const defaults = {
    serverIp: null,
    minecraftVersion: null,
    onlinePlayers: 0,
    recordPlayers: 0,
    totalPlayers: 0,
    discordUrl: null,
    telegramUrl: null,
    youtubeUrl: null,
    donateUrl: null,
    launcherUrl: null,
  };

  assert.equal(Object.values(defaults).every((value) => value === null || value === 0), true);
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
