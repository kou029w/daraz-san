import { respond } from "../bot";
import { nyanco } from "../utils/nyanco";

// Description:
//   だらずさんは JSON のお掃除がだいすきです
//
// Synopsis:
//   json <jsonstring> - あなたの JSON をぷりちーにするにゃん

export default respond(/json +(.*)/i, ({ matches, say }) => {
  const json = JSON.parse(matches[1]!);
  return say([`${nyanco()} っ`, "```", JSON.stringify(json, null, 2), "```"].join("\n"));
});
