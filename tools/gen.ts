// src/scripts/*.ts を読み込む src/scripts.gen.ts を生成する
import { Glob } from "bun";

const out = "src/scripts.gen.ts";
const files = [...new Glob("*.ts").scanSync("src/scripts")].sort();
const code = [
  "// tools/gen.ts による自動生成ファイル。編集しないこと",
  'import type { Listener } from "./bot";',
  ...files.map((file, i) => `import s${i} from "./scripts/${file.replace(/\.ts$/, "")}";`),
  "",
  `const scripts: (Listener | Listener[])[] = [${files.map((_, i) => `s${i}`).join(", ")}];`,
  "",
  "export default scripts.flat();",
  "",
].join("\n");

const current = await Bun.file(out).text().catch(() => "");
if (current !== code) await Bun.write(out, code);
