import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkSimple,
  BookOpenText,
  House,
  List,
  X,
} from "@phosphor-icons/react";
import { bookDocuments, totalBookBytes } from "./bookContent";

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function indexFromHash() {
  const slug = window.location.hash.replace(/^#read-/, "");
  return bookDocuments.findIndex((document) => document.slug === slug);
}

export function App() {
  const initialIndex = indexFromHash();
  const [view, setView] = useState(initialIndex >= 0 ? "reader" : "home");
  const [currentIndex, setCurrentIndex] = useState(Math.max(initialIndex, 0));
  const [tocOpen, setTocOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => new Set());
  const closeButtonRef = useRef(null);

  const openDocument = (index) => {
    const safeIndex = Math.min(Math.max(index, 0), bookDocuments.length - 1);
    setCurrentIndex(safeIndex);
    setView("reader");
    setTocOpen(false);
    window.history.replaceState(null, "", `#read-${bookDocuments[safeIndex].slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHome = () => {
    setView("home");
    setTocOpen(false);
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    setBookmarks((previous) => {
      const next = new Set(previous);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <div className="site-shell">
      {view === "home" ? (
        <HomePage openDocument={openDocument} setTocOpen={setTocOpen} />
      ) : (
        <FullBookReader
          currentIndex={currentIndex}
          openDocument={openDocument}
          openHome={openHome}
          setTocOpen={setTocOpen}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
        />
      )}
      {tocOpen && (
        <TableOfContentsDrawer
          currentIndex={view === "reader" ? currentIndex : -1}
          openDocument={openDocument}
          openHome={openHome}
          closeButtonRef={closeButtonRef}
          close={() => setTocOpen(false)}
        />
      )}
    </div>
  );
}

function HomePage({ openDocument, setTocOpen }) {
  return (
    <>
      <header className="site-header" aria-label="主要ナビゲーション">
        <button className="wordmark" onClick={() => scrollToId("top")}>四文字の、その先へ。</button>
        <nav className="desktop-nav" aria-label="ページ内ナビゲーション">
          <button onClick={() => scrollToId("about")}>本について</button>
          <button onClick={() => setTocOpen(true)}>目次</button>
          <button onClick={() => scrollToId("work")}>30日ワーク</button>
          <span className="nav-divider" aria-hidden="true" />
          <button className="purchase-link" onClick={() => openDocument(0)}>
            全文を読む <BookOpenText aria-hidden="true" />
          </button>
        </nav>
        <button className="menu-button" onClick={() => setTocOpen(true)} aria-label="目次を開く">
          <List aria-hidden="true" />
        </button>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">四文字の、<br />その先へ。</h1>
            <p className="subtitle">MBTIを「わかる」で終わらせず、<br />選べる自分になる</p>
            <span className="gold-rule" aria-hidden="true" />
            <p className="promise">「私はこういう人」から、<br />「私はこうもできる」へ。</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => openDocument(0)}>
                全文を読む <ArrowRight aria-hidden="true" />
              </button>
              <button className="text-button" onClick={() => setTocOpen(true)}>
                目次を見る <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true"><img src="/assets/hero-opening-path.png" alt="" /></div>
        </section>

        <section className="chapter-preview" id="preview" aria-labelledby="preview-title">
          <div className="chapter-heading">
            <p className="chapter-number">第1章</p>
            <h2 id="preview-title">「当たっている」が<br />くれた安心</h2>
            <button className="chapter-link" onClick={() => openDocument(2)}>
              この章を読む <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <figure className="chapter-figure">
            <img src="/assets/chapter-01-mirror.png" alt="鏡の前で自分を見つめる女性の水彩画" />
          </figure>
          <div className="chapter-excerpt">
            <p>性格診断の結果を読んで、<br />思わず笑ったことはありませんか。</p>
            <p>「怖いくらい当たっている」</p>
            <p>「これ、誰か私を見て書いた？」</p>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <p className="section-label">本書の入口</p>
          <h2 id="about-title">四文字は、答えではなく入口になる。</h2>
          <p>タイプを変えるのではなく、場面に応じて選べる行動を一つ増やす。そのための考え方と小さな練習を、静かな読書体験として届けます。</p>
          <p className="content-completeness">本書の使い方・序章・全12章・終章・巻末ワーク・参考文献<br />全{bookDocuments.length}項目・{totalBookBytes.toLocaleString("ja-JP")}バイトを収録</p>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="work-copy">
            <p className="section-label">巻末ワーク</p>
            <h2 id="work-title">30日で、選択肢を一つ増やす</h2>
            <p>毎日すべてを変える必要はありません。一つの現実の問題を、30日間かけて小さく扱います。</p>
            <button className="text-button" onClick={() => openDocument(15)}>
              巻末ワークを開く <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <img src="/assets/four-steps.png" alt="水面に並ぶ四つの飛び石の水彩画" />
        </section>
      </main>
    </>
  );
}

function FullBookReader({ currentIndex, openDocument, openHome, setTocOpen, bookmarks, toggleBookmark }) {
  const document = bookDocuments[currentIndex];
  const bookmarked = bookmarks.has(document.slug);
  const progress = ((currentIndex + 1) / bookDocuments.length) * 100;

  return (
    <>
      <header className="reader-site-header">
        <button className="reader-wordmark" onClick={openHome}>
          四文字の、その先へ。<small>ホームへ戻る</small>
        </button>
        <p className="reader-current-title">{document.title}</p>
        <button className="reader-menu-button" onClick={() => setTocOpen(true)}>
          <List aria-hidden="true" /> 目次
        </button>
      </header>

      <main className="book-reader-layout">
        <nav className="book-toc" aria-label="全書目次">
          <p className="book-toc-title">全書目次</p>
          <ol>
            {bookDocuments.map((item, index) => (
              <li key={item.slug} className={index === currentIndex ? "is-current" : ""}>
                <button onClick={() => openDocument(index)} aria-current={index === currentIndex ? "page" : undefined}>
                  <span>{item.label}</span>{item.title.replace(/^第\d+章　/, "")}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className="book-article" aria-label={document.title}>
          <div className="article-meta">
            <span>{String(currentIndex + 1).padStart(2, "0")} / {bookDocuments.length}</span>
            <button
              className={bookmarked ? "bookmark-button is-active" : "bookmark-button"}
              onClick={() => toggleBookmark(document.slug)}
              aria-pressed={bookmarked}
            >
              <BookmarkSimple weight={bookmarked ? "fill" : "regular"} aria-hidden="true" />
              {bookmarked ? "しおりを保存済み" : "しおりを挟む"}
            </button>
          </div>

          {document.image && (
            <figure className="article-hero-image">
              <img src={`/assets/${document.image}`} alt={document.alt} />
            </figure>
          )}

          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer">{children}</a>,
              }}
            >
              {document.displaySource}
            </ReactMarkdown>
          </div>

          <nav className="chapter-pagination" aria-label="章の移動">
            {currentIndex > 0 ? (
              <button onClick={() => openDocument(currentIndex - 1)}>
                <ArrowLeft aria-hidden="true" /><span><small>前へ</small>{bookDocuments[currentIndex - 1].label}</span>
              </button>
            ) : <span />}
            {currentIndex < bookDocuments.length - 1 ? (
              <button className="next" onClick={() => openDocument(currentIndex + 1)}>
                <span><small>次へ</small>{bookDocuments[currentIndex + 1].label}</span><ArrowRight aria-hidden="true" />
              </button>
            ) : (
              <button className="next" onClick={openHome}>
                <span><small>読了</small>ホームへ</span><House aria-hidden="true" />
              </button>
            )}
          </nav>
        </article>

        <aside className="reader-progress" aria-label={`読書位置 ${currentIndex + 1} / ${bookDocuments.length}`}>
          <span>{String(currentIndex + 1).padStart(2, "0")}</span>
          <div className="progress-track" aria-hidden="true"><i style={{ height: `${progress}%` }} /></div>
          <span>{bookDocuments.length}</span>
        </aside>
      </main>
    </>
  );
}

function TableOfContentsDrawer({ currentIndex, openDocument, openHome, closeButtonRef, close }) {
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      <aside className="toc-drawer" role="dialog" aria-modal="true" aria-labelledby="toc-title">
        <div className="drawer-header">
          <p id="toc-title">全書目次</p>
          <button ref={closeButtonRef} onClick={close} aria-label="目次を閉じる"><X aria-hidden="true" /></button>
        </div>
        <ol>
          {bookDocuments.map((document, index) => (
            <li key={document.slug} className={index === currentIndex ? "is-current" : ""}>
              <button onClick={() => openDocument(index)} aria-current={index === currentIndex ? "page" : undefined}>
                <strong>{document.label}</strong>{document.title.replace(/^第\d+章　/, "")}
              </button>
            </li>
          ))}
        </ol>
        <button className="drawer-home-link" onClick={openHome}><House aria-hidden="true" /> ホームへ戻る</button>
      </aside>
    </div>
  );
}
