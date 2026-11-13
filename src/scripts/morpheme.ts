import { respond } from "../bot";
import { nyanco } from "../utils/nyanco";
import { segment } from "../utils/segment";

// Description:
//   すもももももももものうち
//
// Synopsis:
//   morpheme <phrase> - <phrase> を分かち書きするにゃーん

export default respond(/morpheme (.*)/i, ({ matches, say }) =>
  say(`${nyanco()} ＜ ${segment(matches[1]!).join(" / ")}`),
);
