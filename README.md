# だらずさん ⚡

[Cloudflare Workers](https://workers.cloudflare.com/) で動く Slack ボット [だらずさん](https://github.com/daraz-tek/daraz-bot)

Workers Free プランの範囲で動きます。

1. デプロイ
2. Slack アプリの作成
3. シークレットの設定

## デプロイ

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kou029w/daraz-san)

または手元から:

```sh
bun install
bun run deploy
```

デプロイ先は `https://daraz-san.{アカウントのサブドメイン}.workers.dev` になります。

## Slack アプリの作成

[Slack Applications](https://api.slack.com/apps) → Create New App → From an app manifest

下記の Manifest の `{Workers の URL}` の部分を変更してコピペして、Slack アプリを作成します。

```yaml
display_information:
  name: だらずさん
features:
  bot_user:
    display_name: daraz-san
oauth_config:
  scopes:
    bot:
      - channels:history
      - chat:write
settings:
  event_subscriptions:
    request_url: https://{Workers の URL}/slack/events
    bot_events:
      - message.channels
```

## シークレットの設定

```sh
bunx wrangler secret put SLACK_BOT_TOKEN
bunx wrangler secret put SLACK_SIGNING_SECRET
```

- `SLACK_BOT_TOKEN` ... [Slack Applications](https://api.slack.com/apps) → だらずさん → OAuth & Permissions ページにある `xoxb-` から始まるボットトークン
- `SLACK_SIGNING_SECRET` ... [Slack Applications](https://api.slack.com/apps) → だらずさん → Basic Information ページにある Signing Secret

Cloudflare Dashboard → Workers & Pages → daraz-san → Settings → Variables and Secrets からも設定できます。

## 開発

```sh
bun install
cp .dev.vars.example .dev.vars # 値を書き換える
bun run dev       # ローカル実行
bun test          # テスト
bun run typecheck # 型チェック
```

スクリプトは `src/scripts/` に置くだけで読み込まれます (`tools/gen.ts` が `src/scripts.gen.ts` を生成します。`bun install`・`bun run dev`・`bun run deploy` 時に自動実行)。

```ts
import { hear, respond } from "../bot";

// メッセージに反応する
export default hear(/にゃーん/, ({ say }) => say("にゃーん"));

// ボットへのメンションで始まるメッセージにだけ反応する
export default respond(/echo (.*)/, ({ matches, say }) => say(matches[1]!));
```
