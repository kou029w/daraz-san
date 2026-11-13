import { hear } from "../bot";

const youtubeId = (url: string) =>
  /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([\w-]{11})/.exec(
    url,
  )?.[1];

export default hear(/apod|galaxy|spa+ce|宇宙|コスモ|銀河/i, async ({ say, env }) => {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${env.NASA_API_KEY}`,
  );
  if (!response.ok) return say("APODの画像が取れなかったにゃーん");
  const apod = (await response.json()) as {
    media_type: string;
    title: string;
    url: string;
  };
  const id = apod.media_type === "video" ? youtubeId(apod.url) : undefined;
  const url = id ? `https://www.youtube.com/watch?v=${id}` : apod.url;
  return say(`宇宙って良いにゃーん\n${apod.title}\n${url}`);
});
