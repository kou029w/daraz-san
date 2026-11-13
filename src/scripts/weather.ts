import { hear } from "../bot";
import { nyanco } from "../utils/nyanco";

const prefNumber = 34;
const pageURL = `https://www.tenki.jp/radar/7/${prefNumber}/`;
const fiveMinutes = 5 * 60 * 1000;

const tokyoTime = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)!.value;
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
};

/** 5 分前の時刻を 5 分単位に丸めた時刻 */
export const radarTime = (now: number) =>
  new Date(Math.round((now - fiveMinutes) / fiveMinutes) * fiveMinutes);

export const imgURL = (target: Date) => {
  const t = tokyoTime(target);
  return `https://static.tenki.jp/static-images/radar/${t.year}/${t.month}/${t.day}/${t.hour}/${t.minute}/${t.second}/pref-${prefNumber}-large.jpg`;
};

export default hear(/天気/, ({ say }) => {
  const target = radarTime(Date.now());
  const t = tokyoTime(target);
  return say(
    [
      `${nyanco()} ＜ ${t.hour}時${t.minute}分の雨雲の様子にゃーん`,
      imgURL(target),
      pageURL,
    ].join("\n"),
  );
});
