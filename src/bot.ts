import type { Env } from "./env";

export interface Message {
  channel: string;
  user?: string;
  text: string;
  ts: string;
  thread_ts?: string;
}

export interface Context {
  message: Message;
  matches: RegExpExecArray;
  say: (text: string) => Promise<void>;
  env: Env;
}

export interface Listener {
  pattern: RegExp;
  /** true のときボットへのメンションで始まるメッセージにだけ反応する */
  mention: boolean;
  handler: (context: Context) => unknown;
}

/** メッセージに反応する */
export const hear = (
  pattern: RegExp,
  handler: Listener["handler"],
): Listener => ({ pattern, mention: false, handler });

/** ボットへのメンションで始まるメッセージに反応する */
export const respond = (
  pattern: RegExp,
  handler: Listener["handler"],
): Listener => ({ pattern, mention: true, handler });

export async function dispatch(
  listeners: readonly Listener[],
  message: Message,
  options: {
    botUserId?: string;
    say: Context["say"];
    env: Env;
  },
): Promise<void> {
  const mentioned =
    options.botUserId != null &&
    message.text.startsWith(`<@${options.botUserId}>`);
  const results = await Promise.allSettled(
    listeners.map(async ({ pattern, mention, handler }) => {
      if (mention && !mentioned) return;
      const matches = new RegExp(pattern).exec(message.text);
      if (!matches) return;
      await handler({ message, matches, say: options.say, env: options.env });
    }),
  );
  for (const result of results) {
    if (result.status === "rejected") console.error(result.reason);
  }
}
