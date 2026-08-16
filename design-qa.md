# Design QA

## Evidence

- Source visual truth: `selected-design.png`（1487 × 1058）
- Final homepage: `implementation-full-home.jpg`（1487 × 938）
- Final desktop reader: `implementation-full-reader.jpg`（1487 × 938）
- Final mobile reader: `implementation-full-mobile.jpg`（390 × 844）
- Same-state homepage comparison: `design-qa-full-edition-comparison.png`。源图底部裁切至 1487 × 938 后与实现并排比较；像素密度均为 1×。
- Reader extension reference: 日文精美版的纸张色、蓝灰标题、暖金强调、明朝体正文与 GPT Image 2 统一水彩图。选定首页设计没有提供阅读器状态，因此阅读器按同一视觉系统延展，而非伪造“像素级对应”。

## Content completeness

- 唯一底本：`../../manuscript/ja/`。
- 已纳入本书使用说明、序章、第 1–12 章、终章、卷末练习、参考文献，共 17 项。
- `src/content/` 与底本逐文件 `cmp` 通过：17/17；总计 170,434 字节。
- 页面展示层只把内部标题 `注（編集用）` 显示为 `本章の注`；原始 Markdown 文件未改写。
- 第 2 章验证 1 个表格及章节注释；卷末练习验证 2 个表格、9 个列表；参考文献验证 28 个外部链接，且均以新标签页打开。

## Findings

No actionable P0, P1, or P2 differences remain.

- 首页继续匹配选定方向：通栏水彩、明朝体大标题、蓝灰与暖金层级、748 px 首屏边界和三栏章节预览均保持稳定。
- 桌面阅读器提供常驻全书目录、章节状态、正文、原版插图、前后章导航、书签与纵向阅读进度；信息密度克制，长文行长舒适。
- 手机阅读器在 390 px 下无水平溢出，目录按钮可见，抽屉完整列出 17 项；正文、插图和导航保持单列阅读节奏。
- Markdown 标题、段落、列表、引用、分隔线、表格、链接和章节注释均有明确样式；宽表允许横向滚动。
- 所有插图均使用日文精美版 GPT Image 2 同系列原始资产，没有使用网页截图裁切或 CSS 仿画。
- 图标全部来自 Phosphor；无手绘 SVG、emoji 或非语义字符替代。
- 语义标题、导航、dialog 命名、alt 文本、焦点样式、Escape 关闭、`aria-current`、`aria-pressed` 与 reduced-motion 支持已保留。

## Interactions tested

- 首页 `全文を読む` 进入完整阅读器；第 1 章与卷末练习入口进入对应内容。
- 桌面全书目录为 17 项；已实测使用说明、第 2 章、卷末练习及参考文献。
- 前后章导航存在；参考文献末页切换为回首页。
- 书签按钮提供章节级切换状态。
- 手机目录可打开、显示 17 项、正确标记当前章节并关闭。
- 桌面与 390 px 手机均无异常横向溢出。
- 浏览器 console warnings/errors：0。

## Build verification

- `npm run build`: passed。完整正文使主 bundle 约 552 kB；当前为本地前期设计原型，可在正式发布阶段按章节拆包。
- `npm run test:sites`: 4/4 passed。

## Comparison history

### Landing-page fidelity pass

- 修正过首屏插图范围、裁切、透明度、焦点、标题比例与章节预览列宽；最终首页保持与选定设计一致的视觉层级。

### Complete-edition pass

- 将原内联试读替换为全书阅读器，并补充完整目录、阅读进度、书签、前后章导航、表格与参考链接呈现。
- 桌面和移动端分别视觉检查；未发现标题截断、表格撑破、菜单缺项或控制台错误。
- Residual P3：生成概念图与响应式网页的水彩裁切存在轻微差异；实现优先使用精美版原始资产，未影响层级或可用性。

final result: passed
