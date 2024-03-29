import kuromoji, { Tokenizer, IpadicFeatures } from "kuromoji";
import path from "node:path";

const dicPath = path.resolve(require.resolve("kuromoji"), "../../dict");

export const makeTokenize = (): Promise<
  Tokenizer<IpadicFeatures>["tokenize"]
> =>
  new Promise((resolve, reject) =>
    kuromoji
      .builder({ dicPath })
      .build((err, tokenizer) =>
        err ? reject(err) : resolve(tokenizer.tokenize.bind(tokenizer))
      )
  );

const features = new Map([
  ["surface_form", "表層形"],
  ["pos", "品詞"],
  ["pos_detail_1", "品詞細分類1"],
  ["pos_detail_2", "品詞細分類2"],
  ["pos_detail_3", "品詞細分類3"],
  ["conjugated_type", "活用型"],
  ["conjugated_form", "活用形"],
  ["basic_form", "基本形"],
  ["reading", "読み"],
  ["pronunciation", "発音"],
]);

export const toCSV = (tokens: any) =>
  [
    [...features.values()].join(","),
    ...tokens.map((token: any) =>
      [...features.keys()].map((feature) => token[feature]).join(",")
    ),
  ].join("\n");
