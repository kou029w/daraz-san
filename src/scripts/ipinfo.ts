import { hear } from "../bot";

export default hear(
  /(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/,
  async ({ matches, say }) => {
    const ip = matches[0];
    const response = await fetch(`https://ipinfo.io/${ip}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(2000),
    }).catch(() => undefined);
    return say(
      response?.ok
        ? `:nya-n: < ${await response.text()}`
        : `:nya-n: < がんばったけど ${ip} よくわからんかったにゃん`,
    );
  },
);
