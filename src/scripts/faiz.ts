export default (app: any) => {
  app.message(/555/, ({ say }: any) =>
    say(
      [
        "Standing by... > :nya-n:",
        "ｷｭｨｰﾝ…ｷｭｨｰﾝ…ｷｭｨｰﾝ… > :nya-n:",
        "Complete > :nya-n:",
        "変身！ > :nya-n:",
        ":555: ﾉｼ",
      ].join("\n")
    )
  );
  app.message(/551/, ({ say }: any) =>
    say(
      [
        "551の豚まんがあるときー？ > :nya-n:",
        "```",
        "　♪　∧, ＿∧　　♪",
        "　　 ( ´・ω・) ))",
        "　((( 　つ　ヽ、　　　♪",
        "　　　〉 とノ　)))",
        "  （__ノ ^ (＿)",
        "```",
        "ないときー？ > :nya-n:",
        "```",
        "　　／⌒ヽ",
        "　く / ･〝　⌒ヽ",
        "　 |　3　(∪￣]",
        "　く､･〟 (∩￣]",
        "￣￣￣￣￣￣￣￣",
        "```",
      ].join("\n")
    )
  );
};
