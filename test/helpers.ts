import { dispatch, type Listener } from "../src/bot";
import type { Env } from "../src/env";

export const env: Env = {
  SLACK_BOT_TOKEN: "xoxb-test",
  SLACK_SIGNING_SECRET: "secret",
  NASA_API_KEY: "test",
};

export const BOT = "UBOT";

/** text を投げて say された内容を返す */
export async function run(listeners: Listener | Listener[], text: string) {
  const said: string[] = [];
  await dispatch([listeners].flat(), { channel: "C1", user: "U1", text, ts: "1" }, {
    botUserId: BOT,
    env,
    say: async (t) => void said.push(t),
  });
  return said;
}
