import { hear } from "../bot";
import { oneIn, random } from "../utils/random";
import { segment } from "../utils/segment";
import { tellme } from "../utils/tellme";

// ときどきうんちくを語ります

/** 漢字かカタカナを含む 2 文字以上の語 (名詞っぽいもの) */
const isNounLike = (word: string) =>
  [...word].length >= 2 && /[\p{Script=Han}\p{Script=Katakana}]/u.test(word);

export default hear(/[^\x01-\x7e]{4,}/, async ({ matches, say }) => {
  if (!oneIn(15)) return;
  const words = segment(matches[0]).filter(isNounLike);
  if (words.length === 0) return;
  const answer = await tellme(random(words));
  if (answer) return say(`:nya-n: < 【う・ん・ち・く】${answer}`);
});
