import { respond } from "../bot";
import { nyanco } from "../utils/nyanco";
import { tellme } from "../utils/tellme";

// Description:
//   だらずさんは何でも知っているので教えてくれます
//
// Synopsis:
//   tell me <phrase> - <phrase> について教えてあげよう、妖怪ウィキウィキペディアは使ってないよ！

export default respond(/tell( ?me)? (.*)/i, async ({ matches, say }) => {
  const answer = await tellme(matches[2]!);
  return say(`${nyanco()} ＜ ${answer ?? "しらないにゃーん"}`);
});
