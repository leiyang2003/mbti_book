const jaModules = import.meta.glob("./content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const zhModules = import.meta.glob("./content/zh/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const entries = [
  {
    slug: "guide",
    image: "ill-00-card-and-door.png",
    ja: { file: "frontmatter_本書の使い方.md", label: "本書の使い方", alt: "カードと開いた扉を描いた水彩画" },
    zh: { file: "frontmatter_本书使用方法.md", label: "本书使用方法", alt: "卡片与敞开的门，水彩插图" },
  },
  {
    slug: "prologue",
    image: "cov-01-opening-path.png",
    ja: { file: "00_序章_その四文字はいつから答えになったのか.md", label: "序章", alt: "光へ続く小道を描いた水彩画" },
    zh: { file: "00_序章_四个字母从何时起成了答案.md", label: "序章", alt: "通往光亮的小路，水彩插图" },
  },
  {
    slug: "chapter-1",
    image: "ill-01-recognition-mirror.png",
    ja: { file: "01_「当たっている」がくれた安心.md", label: "第1章", alt: "鏡の前で自分を見つめる人物の水彩画" },
    zh: { file: "01_“说得真准”带来的安心.md", label: "第 1 章", alt: "在镜子前凝视自己的女性，水彩插图" },
  },
  {
    slug: "chapter-2",
    ja: { file: "02_ユング_MBTI_16Personalitiesは同じではない.md", label: "第2章" },
    zh: { file: "02_荣格_MBTI_16Personalities并不相同.md", label: "第 2 章" },
  },
  {
    slug: "chapter-3",
    image: "ill-03-label-frame.png",
    ja: { file: "03_ラベルが「私」に変わるまで.md", label: "第3章", alt: "ラベルと額縁を描いた水彩画" },
    zh: { file: "03_标签如何变成了“我”.md", label: "第 3 章", alt: "标签与画框，水彩插图" },
  },
  {
    slug: "chapter-4",
    ja: { file: "04_ユングが恐れたのは分類より片寄りだった.md", label: "第4章" },
    zh: { file: "04_荣格担心的不是分类而是偏向.md", label: "第 4 章" },
  },
  {
    slug: "chapter-5",
    ja: { file: "05_好み能力行動アイデンティティ.md", label: "第5章" },
    zh: { file: "05_偏好能力行为与身份认同.md", label: "第 5 章" },
  },
  {
    slug: "chapter-6",
    image: "ill-06-more-paths.png",
    ja: { file: "06_成長は逆の人になることではない.md", label: "第6章", alt: "複数の道がひらけていく風景の水彩画" },
    zh: { file: "06_成长不是变成与自己相反的人.md", label: "第 6 章", alt: "多条道路渐次展开，水彩插图" },
  },
  {
    slug: "chapter-7",
    image: "ill-07-connection-solitude.png",
    ja: { file: "07_EとI_つながる力離れて考える力.md", label: "第7章", alt: "つながりと静かな独りの時間を表す水彩画" },
    zh: { file: "07_E与I_建立联系的力量独立思考的力量.md", label: "第 7 章", alt: "连接与安静独处，水彩插图" },
  },
  {
    slug: "chapter-8",
    image: "ill-08-facts-possibilities.png",
    ja: { file: "08_SとN_事実を見る力可能性を見る力.md", label: "第8章", alt: "事実と可能性の両方を見る視点を表す水彩画" },
    zh: { file: "08_S与N_看见事实的力量看见可能性的力量.md", label: "第 8 章", alt: "看见事实与可能性的双重视角，水彩插图" },
  },
  {
    slug: "chapter-9",
    image: "ill-09-logic-and-person.png",
    ja: { file: "09_TとF_筋を通す力人を置き去りにしない力.md", label: "第9章", alt: "論理と人への配慮を表す水彩画" },
    zh: { file: "09_T与F_讲求逻辑的力量不把人落下的力量.md", label: "第 9 章", alt: "逻辑与对人的关照，水彩插图" },
  },
  {
    slug: "chapter-10",
    image: "ill-10-plan-and-open.png",
    ja: { file: "10_JとP_決める力開いておく力.md", label: "第10章", alt: "計画と余白を表す水彩画" },
    zh: { file: "10_J与P_做出决定的力量保持开放的力量.md", label: "第 10 章", alt: "计划与开放余地，水彩插图" },
  },
  {
    slug: "chapter-11",
    image: "ill-11-four-steps.png",
    ja: { file: "11_片寄りに気づく四つのステップ.md", label: "第11章", alt: "水面に並ぶ四つの飛び石の水彩画" },
    zh: { file: "11_觉察偏向的四个步骤.md", label: "第 11 章", alt: "水面上的四块踏脚石，水彩插图" },
  },
  {
    slug: "chapter-12",
    image: "ill-12-three-contexts.png",
    ja: { file: "12_仕事恋愛人生の選択で使う.md", label: "第12章", alt: "仕事、恋愛、人生の三つの場面を表す水彩画" },
    zh: { file: "12_在工作恋爱与人生选择中运用.md", label: "第 12 章", alt: "工作、恋爱与人生三种场景，水彩插图" },
  },
  {
    slug: "epilogue",
    image: "ill-13-choose-again.png",
    ja: { file: "13_終章_自分らしさは選び直せること.md", label: "終章", alt: "もう一度道を選ぶ姿を描いた水彩画" },
    zh: { file: "13_终章_做自己意味着可以重新选择.md", label: "终章", alt: "再次选择道路的人，水彩插图" },
  },
  {
    slug: "workbook",
    image: "ill-11-four-steps.png",
    ja: { file: "14_巻末ワーク_30日で選択肢を一つ増やす.md", label: "巻末ワーク", alt: "水面に並ぶ四つの飛び石の水彩画" },
    zh: { file: "14_书末练习_30天增加一个选择.md", label: "书末练习", alt: "水面上的四块踏脚石，水彩插图" },
  },
  {
    slug: "references",
    ja: { file: "15_参考文献と出典について.md", label: "参考文献" },
    zh: { file: "15_参考文献与出处说明.md", label: "参考文献" },
  },
];

function extractTitle(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function buildBook(locale) {
  const modules = locale === "zh" ? zhModules : jaModules;
  const prefix = locale === "zh" ? "./content/zh/" : "./content/";
  const documents = entries.map((entry, index) => {
    const localized = entry[locale];
    const source = modules[`${prefix}${localized.file}`];
    if (typeof source !== "string") throw new Error(`Missing ${locale} manuscript: ${localized.file}`);

    return {
      slug: entry.slug,
      image: entry.image,
      ...localized,
      index,
      title: extractTitle(source, localized.label),
      source,
      displaySource: source
        .replace(/^## 注（編集用）$/gm, "## 本章の注")
        .replace(/^## 注（编辑用）$/gm, "## 本章注释"),
      bytes: new TextEncoder().encode(source).length,
    };
  });

  return {
    locale,
    documents,
    totalBytes: documents.reduce((sum, document) => sum + document.bytes, 0),
  };
}

export const books = {
  ja: buildBook("ja"),
  zh: buildBook("zh"),
};

export function getBook(locale) {
  return books[locale] || books.ja;
}
