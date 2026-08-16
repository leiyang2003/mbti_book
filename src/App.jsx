import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkSimple,
  BookOpenText,
  ChatCircleDots,
  House,
  List,
  PaperPlaneTilt,
  X,
} from "@phosphor-icons/react";
import { getBook } from "./bookContent";

const copy = {
  ja: {
    languageName: "日本語",
    otherLanguageName: "中文",
    brand: "四文字の、その先へ。",
    navLabel: "主要ナビゲーション",
    aboutNav: "本について",
    toc: "目次",
    workbookNav: "30日ワーク",
    messagesNav: "メッセージ",
    readFull: "全文を読む",
    openMenu: "目次を開く",
    heroLine1: "四文字の、",
    heroLine2: "その先へ。",
    subtitle: <>MBTIを「わかる」で終わらせず、<br />選べる自分になる</>,
    promise: <>「私はこういう人」から、<br />「私はこうもできる」へ。</>,
    viewToc: "目次を見る",
    chapterLabel: "第1章",
    chapterTitle: <>「当たっている」が<br />くれた安心</>,
    readChapter: "この章を読む",
    excerpt: ["性格診断の結果を読んで、思わず笑ったことはありませんか。", "「怖いくらい当たっている」", "「これ、誰か私を見て書いた？」"],
    aboutLabel: "本書の入口",
    aboutTitle: "四文字は、答えではなく入口になる。",
    aboutBody: "タイプを変えるのではなく、場面に応じて選べる行動を一つ増やす。そのための考え方と小さな練習を、静かな読書体験として届けます。",
    contentsSummary: "本書の使い方・序章・全12章・終章・巻末ワーク・参考文献",
    itemsStored: (count, bytes) => `全${count}項目・${bytes}バイトを収録`,
    workbookLabel: "巻末ワーク",
    workbookTitle: "30日で、選択肢を一つ増やす",
    workbookBody: "毎日すべてを変える必要はありません。一つの現実の問題を、30日間かけて小さく扱います。",
    openWorkbook: "巻末ワークを開く",
    home: "ホームへ戻る",
    fullToc: "全書目次",
    closeToc: "目次を閉じる",
    bookmark: "しおりを挟む",
    bookmarked: "しおりを保存済み",
    previous: "前へ",
    next: "次へ",
    finished: "読了",
    chapterNav: "章の移動",
    readingPosition: "読書位置",
    guestbookLabel: "読者の声",
    guestbookTitle: "ここに、言葉を残す。",
    guestbookIntro: "この本を読んで浮かんだことを、短く残してください。メッセージは公開され、すべての読者が見ることができます。",
    name: "お名前",
    namePlaceholder: "表示名（40文字まで）",
    message: "メッセージ",
    messagePlaceholder: "感じたこと、試してみたいこと（500文字まで）",
    submit: "メッセージを送る",
    submitting: "送信中…",
    refresh: "再読み込み",
    empty: "まだメッセージはありません。最初の言葉を残してみませんか。",
    loadError: "メッセージを読み込めませんでした。少し時間を置いて再度お試しください。",
    submitError: "メッセージを保存できませんでした。入力内容と保存設定をご確認ください。",
    submitSuccess: "メッセージを保存しました。",
    publicStorage: "メッセージは固定データファイルに保存され、公開されます。",
  },
  zh: {
    languageName: "中文",
    otherLanguageName: "日本語",
    brand: "四个字母之外",
    navLabel: "主要导航",
    aboutNav: "关于本书",
    toc: "目录",
    workbookNav: "30 天练习",
    messagesNav: "留言",
    readFull: "阅读全书",
    openMenu: "打开目录",
    heroLine1: "四个字母",
    heroLine2: "之外",
    subtitle: <>不要让 MBTI 停在“了解”，<br />成为能够选择的自己</>,
    promise: <>从“我就是这样的人”，<br />走向“我也可以这样做”。</>,
    viewToc: "查看目录",
    chapterLabel: "第 1 章",
    chapterTitle: <>“说得真准”<br />带来的安心</>,
    readChapter: "阅读本章",
    excerpt: ["读完性格测试的结果，你有没有忍不住笑出来过？", "“准得有点吓人。”", "“这是谁看着我写的吗？”"],
    aboutLabel: "本书的入口",
    aboutTitle: "四个字母不是答案，而是入口。",
    aboutBody: "不是改变性格，而是在具体情境中增加一个选择。本书用清晰的思考方式和小步练习，陪你扩展可以调用的能力。",
    contentsSummary: "使用方法、序章、全部 12 章、终章、书末练习与参考文献",
    itemsStored: (count, bytes) => `完整收录 ${count} 项内容，共 ${bytes} 字节`,
    workbookLabel: "书末练习",
    workbookTitle: "30 天，增加一个选择",
    workbookBody: "不需要每天改变所有事情。选一个真实问题，用 30 天把变化做小、做稳，并持续复盘。",
    openWorkbook: "打开书末练习",
    home: "返回首页",
    fullToc: "全书目录",
    closeToc: "关闭目录",
    bookmark: "添加书签",
    bookmarked: "已保存书签",
    previous: "上一篇",
    next: "下一篇",
    finished: "读完了",
    chapterNav: "章节导航",
    readingPosition: "阅读位置",
    guestbookLabel: "读者留言",
    guestbookTitle: "把此刻的想法留在这里。",
    guestbookIntro: "可以写下读完后的感受、疑问，或者你准备尝试的一小步。留言会公开显示，所有读者都能看到。",
    name: "昵称",
    namePlaceholder: "公开显示的昵称（最多 40 字）",
    message: "留言内容",
    messagePlaceholder: "你的感受、疑问或准备尝试的事情（最多 500 字）",
    submit: "发布留言",
    submitting: "正在发布…",
    refresh: "刷新留言",
    empty: "还没有留言。欢迎留下第一句话。",
    loadError: "暂时无法读取留言，请稍后重试。",
    submitError: "留言未能保存，请检查输入内容或留言存储设置。",
    submitSuccess: "留言已经公开保存。",
    publicStorage: "留言会写入固定数据文件，并向所有读者公开。",
  },
};

function parseHash() {
  const hash = window.location.hash;
  const readerMatch = hash.match(/^#(ja|zh)-read-(.+)$/);
  if (readerMatch) return { locale: readerMatch[1], view: "reader", slug: readerMatch[2], section: null };
  const pageMatch = hash.match(/^#(ja|zh)-(home|comments)$/);
  if (pageMatch) return { locale: pageMatch[1], view: "home", slug: null, section: pageMatch[2] };
  return { locale: null, view: "home", slug: null, section: null };
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function shortTitle(document) {
  const stripped = document.title.replace(/^第\s*\d+\s*章[　 ]*/, "");
  return stripped === document.label ? "" : stripped;
}

export function App() {
  const initial = parseHash();
  const savedLocale = window.localStorage.getItem("book-locale");
  const initialLocale = initial.locale || (savedLocale === "zh" ? "zh" : "ja");
  const initialBook = getBook(initialLocale);
  const initialIndex = Math.max(initialBook.documents.findIndex((document) => document.slug === initial.slug), 0);
  const [locale, setLocale] = useState(initialLocale);
  const [view, setView] = useState(initial.view === "reader" && initial.slug ? "reader" : "home");
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [tocOpen, setTocOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => new Set());
  const closeButtonRef = useRef(null);
  const book = getBook(locale);
  const t = copy[locale];

  const openDocument = (index) => {
    const safeIndex = Math.min(Math.max(index, 0), book.documents.length - 1);
    setCurrentIndex(safeIndex);
    setView("reader");
    setTocOpen(false);
    window.history.replaceState(null, "", `#${locale}-read-${book.documents[safeIndex].slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHome = () => {
    setView("home");
    setTocOpen(false);
    window.history.replaceState(null, "", `#${locale}-home`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openComments = () => {
    setView("home");
    setTocOpen(false);
    window.history.replaceState(null, "", `#${locale}-comments`);
    window.setTimeout(() => scrollToId("messages"), 60);
  };

  const changeLocale = (nextLocale) => {
    if (nextLocale === locale) return;
    const nextBook = getBook(nextLocale);
    setLocale(nextLocale);
    window.localStorage.setItem("book-locale", nextLocale);
    document.documentElement.lang = nextLocale === "zh" ? "zh-CN" : "ja";
    if (view === "reader") {
      window.history.replaceState(null, "", `#${nextLocale}-read-${nextBook.documents[currentIndex].slug}`);
    } else if (window.location.hash.endsWith("-comments")) {
      window.history.replaceState(null, "", `#${nextLocale}-comments`);
    } else {
      window.history.replaceState(null, "", `#${nextLocale}-home`);
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "ja";
    document.title = locale === "zh" ? "四个字母之外｜网页版" : "四文字の、その先へ。｜ウェブ版";
  }, [locale]);

  useEffect(() => {
    if (initial.section === "comments") window.setTimeout(() => scrollToId("messages"), 80);
  }, []);

  useEffect(() => {
    if (tocOpen) closeButtonRef.current?.focus();
  }, [tocOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setTocOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleBookmark = (slug) => {
    const key = `${locale}:${slug}`;
    setBookmarks((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="site-shell" data-locale={locale}>
      {view === "home" ? (
        <HomePage
          locale={locale}
          t={t}
          book={book}
          openDocument={openDocument}
          openComments={openComments}
          setTocOpen={setTocOpen}
          changeLocale={changeLocale}
        />
      ) : (
        <FullBookReader
          locale={locale}
          t={t}
          book={book}
          currentIndex={currentIndex}
          openDocument={openDocument}
          openHome={openHome}
          openComments={openComments}
          setTocOpen={setTocOpen}
          changeLocale={changeLocale}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
        />
      )}
      {tocOpen && (
        <TableOfContentsDrawer
          locale={locale}
          t={t}
          book={book}
          currentIndex={view === "reader" ? currentIndex : -1}
          openDocument={openDocument}
          openHome={openHome}
          openComments={openComments}
          changeLocale={changeLocale}
          closeButtonRef={closeButtonRef}
          close={() => setTocOpen(false)}
        />
      )}
    </div>
  );
}

function LanguageSwitcher({ locale, changeLocale, compact = false }) {
  return (
    <div className={compact ? "language-switcher is-compact" : "language-switcher"} aria-label={locale === "zh" ? "语言选择" : "言語選択"}>
      <button onClick={() => changeLocale("ja")} aria-pressed={locale === "ja"}>日本語</button>
      <span aria-hidden="true">/</span>
      <button onClick={() => changeLocale("zh")} aria-pressed={locale === "zh"}>中文</button>
    </div>
  );
}

function HomePage({ locale, t, book, openDocument, openComments, setTocOpen, changeLocale }) {
  return (
    <>
      <header className="site-header" aria-label={t.navLabel}>
        <button className="wordmark" onClick={() => scrollToId("top")}>{t.brand}</button>
        <nav className="desktop-nav" aria-label={t.navLabel}>
          <button onClick={() => scrollToId("about")}>{t.aboutNav}</button>
          <button onClick={() => setTocOpen(true)}>{t.toc}</button>
          <button onClick={() => scrollToId("work")}>{t.workbookNav}</button>
          <button onClick={openComments}>{t.messagesNav}</button>
          <span className="nav-divider" aria-hidden="true" />
          <LanguageSwitcher locale={locale} changeLocale={changeLocale} compact />
          <button className="purchase-link" onClick={() => openDocument(0)}>
            {t.readFull} <BookOpenText aria-hidden="true" />
          </button>
        </nav>
        <div className="mobile-header-actions">
          <LanguageSwitcher locale={locale} changeLocale={changeLocale} compact />
          <button className="menu-button" onClick={() => setTocOpen(true)} aria-label={t.openMenu}><List aria-hidden="true" /></button>
        </div>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">{t.heroLine1}<br />{t.heroLine2}</h1>
            <p className="subtitle">{t.subtitle}</p>
            <span className="gold-rule" aria-hidden="true" />
            <p className="promise">{t.promise}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => openDocument(0)}>{t.readFull} <ArrowRight aria-hidden="true" /></button>
              <button className="text-button" onClick={() => setTocOpen(true)}>{t.viewToc} <ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true"><img src="/assets/hero-opening-path.png" alt="" /></div>
        </section>

        <section className="chapter-preview" id="preview" aria-labelledby="preview-title">
          <div className="chapter-heading">
            <p className="chapter-number">{t.chapterLabel}</p>
            <h2 id="preview-title">{t.chapterTitle}</h2>
            <button className="chapter-link" onClick={() => openDocument(2)}>{t.readChapter} <ArrowRight aria-hidden="true" /></button>
          </div>
          <figure className="chapter-figure"><img src="/assets/chapter-01-mirror.png" alt={book.documents[2].alt} /></figure>
          <div className="chapter-excerpt">{t.excerpt.map((line) => <p key={line}>{line}</p>)}</div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <p className="section-label">{t.aboutLabel}</p>
          <h2 id="about-title">{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
          <p className="content-completeness">{t.contentsSummary}<br />{t.itemsStored(book.documents.length, book.totalBytes.toLocaleString(locale === "zh" ? "zh-CN" : "ja-JP"))}</p>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="work-copy">
            <p className="section-label">{t.workbookLabel}</p>
            <h2 id="work-title">{t.workbookTitle}</h2>
            <p>{t.workbookBody}</p>
            <button className="text-button" onClick={() => openDocument(15)}>{t.openWorkbook} <ArrowRight aria-hidden="true" /></button>
          </div>
          <img src="/assets/four-steps.png" alt={book.documents[15].alt} />
        </section>

        <Guestbook locale={locale} t={t} />
      </main>
    </>
  );
}

function FullBookReader({ locale, t, book, currentIndex, openDocument, openHome, openComments, setTocOpen, changeLocale, bookmarks, toggleBookmark }) {
  const document = book.documents[currentIndex];
  const bookmarked = bookmarks.has(`${locale}:${document.slug}`);
  const progress = ((currentIndex + 1) / book.documents.length) * 100;

  return (
    <>
      <header className="reader-site-header">
        <button className="reader-wordmark" onClick={openHome}>{t.brand}<small>{t.home}</small></button>
        <p className="reader-current-title">{document.title}</p>
        <div className="reader-header-actions">
          <LanguageSwitcher locale={locale} changeLocale={changeLocale} compact />
          <button className="reader-comments-button" onClick={openComments}><ChatCircleDots aria-hidden="true" /> {t.messagesNav}</button>
          <button className="reader-menu-button" onClick={() => setTocOpen(true)}><List aria-hidden="true" /> {t.toc}</button>
        </div>
      </header>

      <main className="book-reader-layout">
        <nav className="book-toc" aria-label={t.fullToc}>
          <p className="book-toc-title">{t.fullToc}</p>
          <ol>{book.documents.map((item, index) => (
            <li key={item.slug} className={index === currentIndex ? "is-current" : ""}>
              <button onClick={() => openDocument(index)} aria-current={index === currentIndex ? "page" : undefined}>
                <span>{item.label}</span>{shortTitle(item)}
              </button>
            </li>
          ))}</ol>
        </nav>

        <article className="book-article" aria-label={document.title}>
          <div className="article-meta">
            <span>{String(currentIndex + 1).padStart(2, "0")} / {book.documents.length}</span>
            <button className={bookmarked ? "bookmark-button is-active" : "bookmark-button"} onClick={() => toggleBookmark(document.slug)} aria-pressed={bookmarked}>
              <BookmarkSimple weight={bookmarked ? "fill" : "regular"} aria-hidden="true" />{bookmarked ? t.bookmarked : t.bookmark}
            </button>
          </div>
          {document.image && <figure className="article-hero-image"><img src={`/assets/${document.image}`} alt={document.alt} /></figure>}
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer">{children}</a> }}>
              {document.displaySource}
            </ReactMarkdown>
          </div>
          <nav className="chapter-pagination" aria-label={t.chapterNav}>
            {currentIndex > 0 ? <button onClick={() => openDocument(currentIndex - 1)}><ArrowLeft aria-hidden="true" /><span><small>{t.previous}</small>{book.documents[currentIndex - 1].label}</span></button> : <span />}
            {currentIndex < book.documents.length - 1 ? (
              <button className="next" onClick={() => openDocument(currentIndex + 1)}><span><small>{t.next}</small>{book.documents[currentIndex + 1].label}</span><ArrowRight aria-hidden="true" /></button>
            ) : (
              <button className="next" onClick={openHome}><span><small>{t.finished}</small>{t.home}</span><House aria-hidden="true" /></button>
            )}
          </nav>
        </article>

        <aside className="reader-progress" aria-label={`${t.readingPosition} ${currentIndex + 1} / ${book.documents.length}`}>
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <div className="progress-track" aria-hidden="true"><i style={{ height: `${progress}%` }} /></div>
          <span>{book.documents.length}</span>
        </aside>
      </main>
    </>
  );
}

function Guestbook({ locale, t }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", message: "", website: "" });

  const loadComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/comments", { headers: { accept: "application/json" } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "load_failed");
      setComments(Array.isArray(payload.comments) ? payload.comments : []);
    } catch {
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, []);

  const submitComment = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "save_failed");
      setComments(Array.isArray(payload.comments) ? payload.comments : comments);
      setForm({ name: "", message: "", website: "" });
      setSuccess(t.submitSuccess);
    } catch {
      setError(t.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="guestbook-section" id="messages" aria-labelledby="guestbook-title">
      <div className="guestbook-intro">
        <p className="section-label">{t.guestbookLabel}</p>
        <h2 id="guestbook-title">{t.guestbookTitle}</h2>
        <p>{t.guestbookIntro}</p>
        <p className="storage-note"><ChatCircleDots aria-hidden="true" /> {t.publicStorage}</p>
      </div>
      <form className="guestbook-form" onSubmit={submitComment}>
        <label>{t.name}<input name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={t.namePlaceholder} maxLength={40} required /></label>
        <label>{t.message}<textarea name="message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={t.messagePlaceholder} maxLength={500} rows={6} required /></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} tabIndex={-1} autoComplete="off" /></label>
        <div className="form-footer"><span>{form.message.length} / 500</span><button className="primary-button" disabled={submitting}>{submitting ? t.submitting : t.submit} <PaperPlaneTilt aria-hidden="true" /></button></div>
        {success && <p className="form-status is-success" role="status">{success}</p>}
        {error && <p className="form-status is-error" role="alert">{error}</p>}
      </form>
      <div className="comment-list" aria-live="polite">
        <div className="comment-list-header"><h3>{t.guestbookLabel}</h3><button onClick={loadComments} disabled={loading}>{t.refresh}</button></div>
        {loading ? <p className="comments-empty">…</p> : comments.length === 0 ? <p className="comments-empty">{t.empty}</p> : comments.map((comment) => (
          <article className="comment-item" key={comment.id}>
            <header><strong>{comment.name}</strong><time dateTime={comment.createdAt}>{new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "ja-JP", { year: "numeric", month: "short", day: "numeric" }).format(new Date(comment.createdAt))}</time></header>
            <p>{comment.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TableOfContentsDrawer({ locale, t, book, currentIndex, openDocument, openHome, openComments, changeLocale, closeButtonRef, close }) {
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <aside className="toc-drawer" role="dialog" aria-modal="true" aria-labelledby="toc-title">
        <div className="drawer-header"><p id="toc-title">{t.fullToc}</p><button ref={closeButtonRef} onClick={close} aria-label={t.closeToc}><X aria-hidden="true" /></button></div>
        <ol>{book.documents.map((document, index) => (
          <li key={document.slug} className={index === currentIndex ? "is-current" : ""}>
            <button onClick={() => openDocument(index)} aria-current={index === currentIndex ? "page" : undefined}><strong>{document.label}</strong>{shortTitle(document)}</button>
          </li>
        ))}</ol>
        <div className="drawer-footer-actions">
          <button className="drawer-home-link" onClick={openHome}><House aria-hidden="true" /> {t.home}</button>
          <button className="drawer-home-link" onClick={openComments}><ChatCircleDots aria-hidden="true" /> {t.messagesNav}</button>
          <LanguageSwitcher locale={locale} changeLocale={changeLocale} compact />
        </div>
      </aside>
    </div>
  );
}
