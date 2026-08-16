const markdownModules = import.meta.glob("./content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const bookOrder = [
  { file: "frontmatter_本書の使い方.md", slug: "guide", label: "本書の使い方", image: "ill-00-card-and-door.png", alt: "カードと開いた扉を描いた水彩画" },
  { file: "00_序章_その四文字はいつから答えになったのか.md", slug: "prologue", label: "序章", image: "cov-01-opening-path.png", alt: "光へ続く小道を描いた水彩画" },
  { file: "01_「当たっている」がくれた安心.md", slug: "chapter-1", label: "第1章", image: "ill-01-recognition-mirror.png", alt: "鏡の前で自分を見つめる人物の水彩画" },
  { file: "02_ユング_MBTI_16Personalitiesは同じではない.md", slug: "chapter-2", label: "第2章" },
  { file: "03_ラベルが「私」に変わるまで.md", slug: "chapter-3", label: "第3章", image: "ill-03-label-frame.png", alt: "ラベルと額縁を描いた水彩画" },
  { file: "04_ユングが恐れたのは分類より片寄りだった.md", slug: "chapter-4", label: "第4章" },
  { file: "05_好み能力行動アイデンティティ.md", slug: "chapter-5", label: "第5章" },
  { file: "06_成長は逆の人になることではない.md", slug: "chapter-6", label: "第6章", image: "ill-06-more-paths.png", alt: "複数の道がひらけていく風景の水彩画" },
  { file: "07_EとI_つながる力離れて考える力.md", slug: "chapter-7", label: "第7章", image: "ill-07-connection-solitude.png", alt: "つながりと静かな独りの時間を表す水彩画" },
  { file: "08_SとN_事実を見る力可能性を見る力.md", slug: "chapter-8", label: "第8章", image: "ill-08-facts-possibilities.png", alt: "事実と可能性の両方を見る視点を表す水彩画" },
  { file: "09_TとF_筋を通す力人を置き去りにしない力.md", slug: "chapter-9", label: "第9章", image: "ill-09-logic-and-person.png", alt: "論理と人への配慮を表す水彩画" },
  { file: "10_JとP_決める力開いておく力.md", slug: "chapter-10", label: "第10章", image: "ill-10-plan-and-open.png", alt: "計画と余白を表す水彩画" },
  { file: "11_片寄りに気づく四つのステップ.md", slug: "chapter-11", label: "第11章", image: "ill-11-four-steps.png", alt: "水面に並ぶ四つの飛び石の水彩画" },
  { file: "12_仕事恋愛人生の選択で使う.md", slug: "chapter-12", label: "第12章", image: "ill-12-three-contexts.png", alt: "仕事、恋愛、人生の三つの場面を表す水彩画" },
  { file: "13_終章_自分らしさは選び直せること.md", slug: "epilogue", label: "終章", image: "ill-13-choose-again.png", alt: "もう一度道を選ぶ姿を描いた水彩画" },
  { file: "14_巻末ワーク_30日で選択肢を一つ増やす.md", slug: "workbook", label: "巻末ワーク", image: "ill-11-four-steps.png", alt: "水面に並ぶ四つの飛び石の水彩画" },
  { file: "15_参考文献と出典について.md", slug: "references", label: "参考文献" },
];

function extractTitle(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

export const bookDocuments = bookOrder.map((entry, index) => {
  const source = markdownModules[`./content/${entry.file}`];
  if (typeof source !== "string") throw new Error(`本文が見つかりません: ${entry.file}`);

  return {
    ...entry,
    index,
    title: extractTitle(source, entry.label),
    source,
    displaySource: source.replace(/^## 注（編集用）$/gm, "## 本章の注"),
    bytes: new TextEncoder().encode(source).length,
  };
});

export const totalBookBytes = bookDocuments.reduce((sum, document) => sum + document.bytes, 0);
