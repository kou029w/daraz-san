import { hear } from "../bot";

export default hear(/[\s\S]*(ぱい|パイ)[\s\S]*/, ({ matches, say }) =>
  say(`:goku: < ${matches[0].replace(/ぱい|パイ/g, "ぺぇ")}`),
);
