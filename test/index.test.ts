import { afterEach, expect, mock, test } from "bun:test";
import worker from "../src/index";
import { env } from "./helpers";

const sign = async (ts: string, body: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SLACK_SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`v0:${ts}:${body}`));
  return `v0=${Buffer.from(mac).toString("hex")}`;
};

const request = async (payload: unknown) => {
  const body = JSON.stringify(payload);
  const ts = String(Math.floor(Date.now() / 1000));
  return new Request("https://example.com/slack/events", {
    method: "POST",
    headers: { "x-slack-request-timestamp": ts, "x-slack-signature": await sign(ts, body) },
    body,
  }) as WorkerRequest;
};

type WorkerRequest = Parameters<typeof worker.fetch>[0];

const ctx = () => {
  const promises: Promise<unknown>[] = [];
  return {
    promises,
    waitUntil: (p: Promise<unknown>) => void promises.push(p),
    passThroughOnException: () => {},
  } as unknown as ExecutionContext & { promises: Promise<unknown>[] };
};

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("GET / は OK", async () => {
  const res = await worker.fetch(new Request("https://example.com/") as WorkerRequest, env, ctx());
  expect(await res.text()).toBe("OK");
});

test("url_verification に challenge を返す", async () => {
  const res = await worker.fetch(
    await request({ type: "url_verification", challenge: "abc" }),
    env,
    ctx(),
  );
  expect(await res.json()).toEqual({ challenge: "abc" });
});

test("署名がなければ 401", async () => {
  const res = await worker.fetch(
    new Request("https://example.com/slack/events", {
      method: "POST",
      body: "{}",
    }) as WorkerRequest,
    env,
    ctx(),
  );
  expect(res.status).toBe(401);
});

test("メッセージに反応して chat.postMessage する", async () => {
  const fetchMock = mock(async (_url: string | URL | Request, _init?: RequestInit) =>
    Response.json({ ok: true }),
  );
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  const c = ctx();
  const res = await worker.fetch(
    await request({
      type: "event_callback",
      authorizations: [{ user_id: "UBOT" }],
      event: { type: "message", channel: "C1", user: "U1", text: "しりとり", ts: "1" },
    }),
    env,
    c,
  );
  expect(res.status).toBe(200);
  await Promise.all(c.promises);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0]!;
  expect(String(url)).toBe("https://slack.com/api/chat.postMessage");
  expect(JSON.parse(String(init?.body))).toMatchObject({ channel: "C1" });
  expect(JSON.parse(String(init?.body)).text).toEndWith("< うどん。");
});

test("ボット自身やボットのメッセージには反応しない", async () => {
  const fetchMock = mock(async () => Response.json({ ok: true }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  const c = ctx();
  for (const event of [
    { type: "message", channel: "C1", user: "UBOT", text: "しりとり", ts: "1" },
    { type: "message", channel: "C1", bot_id: "B1", text: "しりとり", ts: "1" },
    { type: "message", subtype: "message_changed", channel: "C1", ts: "1" },
  ]) {
    await worker.fetch(
      await request({ type: "event_callback", authorizations: [{ user_id: "UBOT" }], event }),
      env,
      c,
    );
  }
  await Promise.all(c.promises);
  expect(fetchMock).not.toHaveBeenCalled();
});
