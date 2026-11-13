import { hear } from "../bot";
import { nyanco } from "../utils/nyanco";
import { oneIn } from "../utils/random";

const nomura = [
  ":nomura-exodia-1::nomura-exodia-2::nomura-exodia-3:",
  ":nomura-exodia-4::nomura-exodia-5::nomura-exodia-6: :exclamation::question:",
  ":nomura-exodia-7::nomura-exodia-8::nomura-exodia-9:",
].join("\n");

const spark = [
  ":spark-exodia-00::spark-exodia-01::spark-exodia-02::spark-exodia-03::spark-exodia-04::spark-exodia-05:",
  ":spark-exodia-06::spark-exodia-07::spark-exodia-08::spark-exodia-09::spark-exodia-10::spark-exodia-11:",
  ":spark-exodia-12::spark-exodia-13::spark-exodia-14::spark-exodia-15::spark-exodia-16::spark-exodia-17:",
  ":spark-exodia-18::spark-exodia-19::spark-exodia-20::spark-exodia-21::spark-exodia-22::spark-exodia-23:",
].join("\n");

export default [
  hear(/ぬ.*る.*ぽ/, ({ say }) => say(`${nyanco()} < にゃーん`)),
  hear(/だらず((さん)?.*)/, ({ matches, say }) =>
    say(`${nyanco()} < ${matches[2] ? "にゃーん" : "さんを付けろよデコスケ野郎っ！"}`),
  ),
  hear(/こたつ/, ({ say }) => say(`${nyanco()} < しまえ`)),
  hear(/(しお|塩)/, ({ say }) => say(`${nyanco()} < しお`)),
  hear(/(らーめん|ラーメン|拉麺|らうめん)/, ({ say }) => say(`${nyanco()} < :ramen:`)),
  hear(/しりとり/, ({ say }) => say(`${nyanco()} < うどん。`)),
  hear(/(糞|くそ|クソ)(すれ|スレ)/, ({ say }) =>
    say(`${nyanco()} < クソスレで悪かったな！！`),
  ),
  hear(/(カレー|かれー|華麗)/, ({ say }) =>
    say("https://pbs.twimg.com/media/C-RVt9pUAAARRVe.jpg"),
  ),
  hear(/(すし|鮨|寿司|スシ|まぐろ|マグロ|sushi)/i, ({ say }) =>
    say(`${nyanco()} < あいよ っ :sushi:`),
  ),
  hear(/ちゃ|茶/, ({ say }) => say(`お茶どぞー < ${nyanco()}っ :tea:`)),
  hear(/風邪|かぜ|カゼ|体調|つらい|くるしい|痛い|ひぎぃ|うぐぅ/, ({ say }) =>
    say(`おくすりどぞー < ${nyanco()}っ :pill:`),
  ),
  hear(/(ちらし|チラシ|広告)/, ({ say }) => say(`${nyanco()} < スタンプラリーやめれ`)),
  hear(/進捗どうですか/, ({ message, say }) => {
    const from = `<@${message.user}>`;
    return say(
      [
        `${nyanco()} < そう言うと ${from} は永い眠りについた。`,
        "メールとチケットが山のように積もった部屋の片隅で・・・。",
        `主を失ったモニタのあかりだけが、動かなくなった ${from} を優しく照らし続けた。`,
      ].join(""),
    );
  }),
  hear(/(のむら|さちよ|野村|沙知代|さっちー|サッチー|のむさん|ノムサン)/, ({ say }) =>
    say(nomura),
  ),
  hear(/(肉|にく|ニク)/, ({ say }) => (oneIn(3) ? say(spark) : undefined)),
  hear(/(野球|やきゅう|やきう)/, ({ say }) => (oneIn(10) ? say(nomura) : undefined)),
  hear(/.*(ね|ネ).+(ハム|はむ)(たろう|たろー|タロウ|タロー|太郎)/, ({ matches, say }) =>
    /(死|亡|殺)/.test(matches[0]) || oneIn(10)
      ? say(":hamster: < まったくなのだ！万死に値するのだ！！")
      : say(":hamster: < まったくなのだ！！！"),
  ),
  hear(/^(?=.*[eE]macs)(?=.*[vV]i)/, ({ say }) =>
    say(`${nyanco()} < Emacs vs. Vi ファイ！`),
  ),
];
