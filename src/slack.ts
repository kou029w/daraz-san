const encoder = new TextEncoder();

const hexToBytes = (hex: string): Uint8Array<ArrayBuffer> | undefined => {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) return;
  return new Uint8Array(hex.match(/../g)!.map((b) => parseInt(b, 16)));
};

/** Slack リクエストの署名を検証する https://api.slack.com/authentication/verifying-requests-from-slack */
export async function verifySlackRequest(
  signingSecret: string,
  headers: Headers,
  body: string,
  now = Date.now(),
): Promise<boolean> {
  const timestamp = headers.get("x-slack-request-timestamp");
  const signature = headers.get("x-slack-signature");
  if (!timestamp || !signature?.startsWith("v0=")) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > 60 * 5) return false;
  const expected = hexToBytes(signature.slice(3));
  if (!expected) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    expected,
    encoder.encode(`v0:${timestamp}:${body}`),
  );
}

export async function postMessage(
  token: string,
  message: { channel: string; text: string; thread_ts?: string },
): Promise<void> {
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(message),
  });
  const result = (await response.json()) as { ok: boolean; error?: string };
  if (!result.ok) throw new Error(`chat.postMessage: ${result.error}`);
}
