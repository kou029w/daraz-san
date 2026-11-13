import { expect, test } from "bun:test";
import faiz from "../src/scripts/faiz";
import goku from "../src/scripts/goku";
import json from "../src/scripts/json";
import morpheme from "../src/scripts/morpheme";
import nurupo from "../src/scripts/nurupo";
import nyanchu from "../src/scripts/nyanchu";
import random from "../src/scripts/random";
import { imgURL, radarTime } from "../src/scripts/weather";
import { BOT, run } from "./helpers";

test("goku", async () => {
  expect(await run(goku, "おっぱい")).toEqual([":goku: < おっぺぇ"]);
});

test("faiz", async () => {
  expect(await run(faiz, "555")).toHaveLength(1);
  expect(await run(faiz, "123")).toEqual([]);
});

test("nurupo: だらず", async () => {
  expect((await run(nurupo, "だらず"))[0]).toEndWith("さんを付けろよデコスケ野郎っ！");
  expect((await run(nurupo, "だらずさん"))[0]).toEndWith("にゃーん");
});

test("メンションが必要なコマンドはメンションなしでは反応しない", async () => {
  expect(await run(nyanchu, "ニャンちゅう あいう")).toEqual([]);
  expect(await run(nyanchu, `<@UOTHER> ニャンちゅう あいう`)).toEqual([]);
});

test("nyanchu", async () => {
  expect(await run(nyanchu, `<@${BOT}> ニャンちゅう あいう`)).toEqual([
    "お゛ぉ゛ん！あ゛い゛う゛た゛に゛ゃあ゛ん！ > :nyanchu:",
  ]);
});

test("json", async () => {
  const [said] = await run(json, `<@${BOT}> json {"a":1}`);
  expect(said).toContain('{\n  "a": 1\n}');
});

test("random", async () => {
  const [said] = await run(random, `<@${BOT}> choice foo,bar`);
  expect(said).toMatch(/^:nya-n: < (foo|bar|人に決められる.*)$/);
});

test("morpheme", async () => {
  const [said] = await run(morpheme, `<@${BOT}> morpheme 今日は良い天気です`);
  expect(said).toContain(" / ");
});

test("weather: 5 分前を 5 分単位に丸めた時刻の画像 URL", () => {
  const now = Date.parse("2026-01-02T03:09:00Z");
  const target = radarTime(now);
  expect(target.toISOString()).toBe("2026-01-02T03:05:00.000Z");
  expect(imgURL(target)).toBe(
    "https://static.tenki.jp/static-images/radar/2026/01/02/12/05/00/pref-34-large.jpg",
  );
});
