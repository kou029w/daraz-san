import { parse } from "tldts";
import { hear } from "../bot";

const ignores = ["daraz-tek.slack.com"];

/** DNS over HTTPS で A レコードを引く */
async function resolve(domain: string): Promise<string[]> {
  const url = new URL("https://cloudflare-dns.com/dns-query");
  url.search = new URLSearchParams({ name: domain, type: "A" }).toString();
  const response = await fetch(url, {
    headers: { accept: "application/dns-json" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const json = (await response.json()) as {
    Status: number;
    Answer?: { type: number; data: string }[];
  };
  return (json.Answer ?? []).filter(({ type }) => type === 1).map(({ data }) => data);
}

export default hear(
  /(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)+([a-z]+)/,
  async ({ matches, say }) => {
    const domain = matches[0];
    if (ignores.includes(domain)) return;
    if (!parse(domain).isIcann) return;
    const records = await resolve(domain).catch(() => []);
    return say(
      records.length > 0
        ? `:nya-n: < ${domain} は ${records.join("  *,*  ")} ですにゃん`
        : `:nya-n: < ${domain} はわかんなかったにゃん`,
    );
  },
);
