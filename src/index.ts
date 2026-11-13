import { dispatch, type Message } from "./bot";
import type { Env } from "./env";
import listeners from "./scripts.gen";
import { postMessage, verifySlackRequest } from "./slack";

interface MessageEvent extends Message {
  type: "message";
  subtype?: string;
  bot_id?: string;
}

type Payload =
  | { type: "url_verification"; challenge: string }
  | {
      type: "event_callback";
      event: MessageEvent | { type: string };
      authorizations?: { user_id: string }[];
    };

async function handleEvent(
  payload: Extract<Payload, { type: "event_callback" }>,
  env: Env,
) {
  const event = payload.event;
  if (event.type !== "message") return;
  const message = event as MessageEvent;
  const botUserId = payload.authorizations?.[0]?.user_id;
  if (message.subtype || message.bot_id || typeof message.text !== "string")
    return;
  if (message.user === botUserId) return;
  await dispatch(listeners, message, {
    botUserId,
    env,
    say: (text) =>
      postMessage(env.SLACK_BOT_TOKEN, {
        channel: message.channel,
        text,
        thread_ts: message.thread_ts,
      }),
  });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (request.method === "GET" && pathname === "/") return new Response("OK");
    if (request.method !== "POST" || pathname !== "/slack/events")
      return new Response("Not Found", { status: 404 });

    const body = await request.text();
    if (!(await verifySlackRequest(env.SLACK_SIGNING_SECRET, request.headers, body)))
      return new Response("Unauthorized", { status: 401 });

    const payload = JSON.parse(body) as Payload;
    if (payload.type === "url_verification")
      return Response.json({ challenge: payload.challenge });
    // 3 秒以内に応答しなかったときの再送は無視 (処理は waitUntil で継続している)
    if (request.headers.has("x-slack-retry-num")) return new Response(null);
    if (payload.type === "event_callback")
      ctx.waitUntil(handleEvent(payload, env));
    return new Response(null);
  },
} satisfies ExportedHandler<Env>;
