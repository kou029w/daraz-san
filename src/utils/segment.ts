const segmenter = new Intl.Segmenter("ja", { granularity: "word" });

/** 単語に分割する */
export const segment = (text: string): string[] =>
  [...segmenter.segment(text)]
    .filter(({ isWordLike }) => isWordLike)
    .map(({ segment }) => segment);
