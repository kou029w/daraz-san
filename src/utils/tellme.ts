const userAgent = "daraz-san (https://github.com/kou029w/daraz-san)";

/** Wikipedia の概要を返す。見つからなければ undefined */
export async function tellme(title: string): Promise<string | undefined> {
  const url = new URL("https://ja.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "extracts",
    titles: title,
    redirects: "1",
    exchars: "120",
    explaintext: "1",
  }).toString();
  const response = await fetch(url, { headers: { "user-agent": userAgent } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const json = (await response.json()) as {
    query?: { pages?: { extract?: string }[] };
  };
  const extracts = (json.query?.pages ?? [])
    .map(({ extract }) => extract?.trim())
    .filter((extract) => extract && extract !== "…");
  return extracts.length > 0 ? extracts.join("\n") : undefined;
}
