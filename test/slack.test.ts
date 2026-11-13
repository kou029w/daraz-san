import { expect, test } from "bun:test";
import { verifySlackRequest } from "../src/slack";

const secret = "8f742231b10e8888abcd99yyyzzz85a5";
const body = "token=xyzz0WbapA4vBCDEFasx0q6G&team_id=T1DC2JH3J";
const timestamp = "1531420618";

const sign = async (s: string, ts: string, b: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(s),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`v0:${ts}:${b}`));
  return `v0=${Buffer.from(mac).toString("hex")}`;
};

const headers = (signature: string, ts = timestamp) =>
  new Headers({ "x-slack-request-timestamp": ts, "x-slack-signature": signature });

const now = Number(timestamp) * 1000;

test("正しい署名を受け入れる", async () => {
  const signature = await sign(secret, timestamp, body);
  expect(await verifySlackRequest(secret, headers(signature), body, now)).toBe(true);
});

test("改ざんされた本文を拒否する", async () => {
  const signature = await sign(secret, timestamp, body);
  expect(await verifySlackRequest(secret, headers(signature), `${body}x`, now)).toBe(false);
});

test("古いリクエストを拒否する", async () => {
  const signature = await sign(secret, timestamp, body);
  expect(
    await verifySlackRequest(secret, headers(signature), body, now + 6 * 60 * 1000),
  ).toBe(false);
});

test("不正な形式の署名を拒否する", async () => {
  expect(await verifySlackRequest(secret, headers("v0=zz"), body, now)).toBe(false);
  expect(await verifySlackRequest(secret, new Headers(), body, now)).toBe(false);
});
