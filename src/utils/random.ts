/** 配列からランダムに 1 つ選ぶ */
export const random = <T>(array: readonly T[]): T =>
  array[Math.floor(Math.random() * array.length)]!;

/** 1/n の確率で true */
export const oneIn = (n: number): boolean => Math.random() * n < 1;
