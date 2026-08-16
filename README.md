# 《四文字の、その先へ。／四个字母之外》双语网页版

这是基于日文精美版、中文 Premium 版和用户选定的第一套视觉方向制作的响应式双语网页。

当前包含：

- 精美版风格首页；
- 可打开的目录抽屉；
- 17 项完整日文内容与 17 项完整中文 Premium 内容；
- 在首页、阅读器与手机目录中切换语言，并保持当前章节位置；
- 完整目录、前后章导航、阅读进度和可切换的章节书签状态；
- Markdown 表格、列表、引文、链接和章节注释的完整呈现；
- 可公开查看和提交的读者留言区；
- 桌面与手机响应式布局。

日文底本为该 run 的 `manuscript/ja/`，网页项目的 `src/content/` 保存 17 份逐字节一致的 Markdown 文件，共 170,434 字节。中文底本为 `chinese/manuscript/zh/`，`src/content/zh/` 保存 17 份逐字节一致的中文 Premium Markdown 文件，共 143,071 字节。两种语言共享经中文与日文 Premium 版确认一致的 GPT Image 2 水彩图。

## 本地预览

```bash
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
```

## 验证

```bash
npm run build
npm run test:comments
npm run test:sites
```

视觉对照与交互测试结果见 `design-qa.md`。

## Vercel

仓库根目录的 `vercel.json` 明确指定 `dist/client` 为输出目录，并把非静态资源路径回退到 `index.html`。这与当前同时面向 Sites 的 Vite 构建结构保持一致，可避免 Vercel 在错误的 `dist/` 层级返回 404。

### 留言固定文件

生产环境把公开留言写入 GitHub 仓库 `comments` 分支的 `data/comments.json`，网页端不持有写入密钥。Vercel 需要配置：

- `COMMENTS_GITHUB_TOKEN`：只授予 `leiyang2003/mbti_book` 仓库 Contents 读写权限的 fine-grained token；
- 可选覆盖：`COMMENTS_GITHUB_OWNER`、`COMMENTS_GITHUB_REPO`、`COMMENTS_GITHUB_BRANCH`、`COMMENTS_GITHUB_PATH`。

默认值分别为 `leiyang2003`、`mbti_book`、`comments` 和 `data/comments.json`。不要把 token 写入仓库、前端代码或公开日志。未配置 token 时，公开读取仍可工作，写入会返回 `comments_write_not_configured`。

`comments` 分支只保存留言数据；`scripts/vercel-ignore-build.mjs` 会让 Vercel 跳过该分支的自动部署，避免每条留言触发一次 Preview 构建。
