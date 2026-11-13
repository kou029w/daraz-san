import { respond } from "../bot";

export default respond(/(ニャンちゅう) +(.*)/, ({ matches, say }) => {
  const oon = [...matches[2]!].map((c) => `${c}゛`).join("");
  return say(`お゛ぉ゛ん！${oon}た゛に゛ゃあ゛ん！ > :nyanchu:`);
});
