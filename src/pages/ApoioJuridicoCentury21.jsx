import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Menu,
  X,
} from "lucide-react";

const ENV = import.meta.env || {};
const LOGO = "/assets/logosite.png";
const DEFAULT_SUPABASE_URL = "https://keulsgyzfruvscapcuxk.supabase.co";
const DEFAULT_SUPABASE_KEY =
  "sb_publishable_Rg-J0l6M1cGxvNdIupJwrg_Y7GWhrFK";
const POSTS_PER_PAGE = 6;

const SUPABASE_URL =
  ENV.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  ENV.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

function getSlugFromPath() {
  const match = window.location.pathname.match(
    /\/apoio-juridico\/([^/]+)/
  );

  return match ? decodeURIComponent(match[1]) : "";
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function stripHtml(html = "") {
  if (typeof DOMParser === "undefined") return html;

  const parsedDocument = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  return (parsedDocument.body.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizePost(post) {
  if (post.seo_description) return post.seo_description;

  const cleanBody = stripHtml(post.body);
  return cleanBody.length > 155
    ? `${cleanBody.slice(0, 155).trim()}...`
    : cleanBody;
}

function sanitizeArticleHtml(html = "") {
  if (typeof DOMParser === "undefined") return html;

  const documentHtml = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  documentHtml.body
    .querySelectorAll("script, style, iframe, object, embed")
    .forEach((element) => element.remove());

  documentHtml.body.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (
        name.startsWith("on") ||
        name === "style" ||
        ((name === "href" || name === "src") &&
          value.startsWith("javascript:"))
      ) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === "A") {
      const href = element.getAttribute("href") || "";
      if (href.startsWith("http")) {
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
      }
    }
  });

  return documentHtml.body.innerHTML;
}

function BrandLogo() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <img
        src={LOGO}
        alt="CENTURY 21"
        className="h-11 w-auto object-contain sm:h-12"
      />
      <span className="pl-[0.34em] text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#beaf87]">
        Nações
      </span>
    </div>
  );
}

export default function ApoioJuridicoCentury21() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlug, setCurrentSlug] = useState(getSlugFromPath);

  useEffect(() => {
    loadPublishedPosts();
  }, []);

  useEffect(() => {
    function handleRouteChange() {
      setCurrentSlug(getSlugFromPath());
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  async function loadPublishedPosts() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id,title,slug,category,seo_description,body,status,cover_image_url,created_at,updated_at"
      )
      .eq("status", "publicado")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar posts publicados:", error);
      setPosts([]);
      setErrorMessage(
        "Não foi possível carregar os artigos neste momento. Tente novamente mais tarde."
      );
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  }

  function navigateTo(url) {
    window.history.pushState({}, "", url);
    setCurrentSlug(getSlugFromPath());
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const categories = useMemo(() => {
    const availableCategories = posts
      .map((post) => post.category)
      .filter(Boolean);

    return ["Todos", ...new Set(availableCategories)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Todos") return posts;

    return posts.filter(
      (post) => post.category === selectedCategory
    );
  }, [posts, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const selectedPost = posts.find(
    (post) => post.slug === currentSlug
  );

  const relatedPosts = selectedPost
    ? posts
        .filter(
          (post) =>
            post.id !== selectedPost.id &&
            post.category === selectedPost.category
        )
        .slice(0, 3)
    : [];

  function chooseCategory(category) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <PublicNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigate={navigateTo}
      />

      {currentSlug ? (
        <ArticlePage
          post={selectedPost}
          relatedPosts={relatedPosts}
          loading={loading}
          errorMessage={errorMessage}
          onNavigate={navigateTo}
        />
      ) : (
        <ListingPage
          posts={paginatedPosts}
          categories={categories}
          selectedCategory={selectedCategory}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          errorMessage={errorMessage}
          onChooseCategory={chooseCategory}
          onPageChange={setCurrentPage}
          onNavigate={navigateTo}
        />
      )}

      <PublicFooter />
    </main>
  );
}

function PublicNavbar({
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigate,
}) {
const navItems = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Apoio Jurídico", href: "/apoio-juridico" },
  { label: "Crédito Habitação", href: "/credito-habitacao" },
  { label: "Contacte-nos", href: "/contacte-nos" },
];

  function handleLink(event, item) {
    if (item.href.startsWith("/apoio-juridico")) {
      event.preventDefault();
      onNavigate(item.href);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#beaf87]/25 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="/" aria-label="Ir para a página inicial">
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) => handleLink(event, item)}
              className={`relative text-sm font-semibold uppercase tracking-[0.16em] transition hover:text-[#beaf87] ${
                item.active ? "text-[#beaf87]" : "text-[#171717]/70"
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute -bottom-3 left-0 h-px w-full bg-[#beaf87]" />
              )}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/35 text-[#beaf87] lg:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#beaf87]/20 bg-white px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  handleLink(event, item);
                  setMobileMenuOpen(false);
                }}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                  item.active
                    ? "border-[#beaf87]/45 bg-[#beaf87]/10 text-[#2a2418]"
                    : "border-[#beaf87]/25 bg-[#fbfaf7] text-[#171717]/78"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function ListingPage({
  posts,
  categories,
  selectedCategory,
  currentPage,
  totalPages,
  loading,
  errorMessage,
  onChooseCategory,
  onPageChange,
  onNavigate,
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#beaf87]/20 bg-[#fbfaf7]">
        <HeroBackground />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-[#beaf87] sm:text-sm">
            Informação e acompanhamento
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-[#2a2418] sm:text-5xl lg:text-6xl">
            Apoio Jurídico
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#171717]/68 sm:text-lg">
            Artigos e orientações para tomar decisões imobiliárias com maior clareza, confiança e segurança.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#beaf87]">
              Filtrar por categoria
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onChooseCategory(category)}
                  className={`rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] transition ${
                    category === selectedCategory
                      ? "border-[#beaf87] bg-[#beaf87] text-black"
                      : "border-[#beaf87]/28 bg-white text-[#171717]/66 hover:border-[#beaf87]/60 hover:text-[#2a2418]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center text-sm text-[#171717]/54">
              A carregar artigos...
            </div>
          ) : posts.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#beaf87]/35 bg-[#fbfaf7] px-6 text-center">
              <FileText className="mb-5 h-10 w-10 text-[#beaf87]" />
              <h2 className="font-serif text-3xl text-[#2a2418]">
                Ainda não existem artigos publicados.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#171717]/60">
                Os conteúdos de apoio jurídico e imobiliário serão disponibilizados nesta área em breve.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function ArticlePage({
  post,
  relatedPosts,
  loading,
  errorMessage,
  onNavigate,
}) {
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#171717]/54">
        A carregar artigo...
      </div>
    );
  }

  if (errorMessage || !post) {
    return (
      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#beaf87]/25 bg-[#fbfaf7] p-8 text-center sm:p-12">
          <h1 className="font-serif text-4xl text-[#2a2418]">
            Artigo não encontrado
          </h1>
          <p className="mt-5 text-base leading-8 text-[#171717]/62">
            O conteúdo que procura não está disponível ou deixou de estar publicado.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("/apoio-juridico")}
            className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-[#beaf87] px-7 text-sm font-extrabold uppercase tracking-[0.14em] text-black"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Ver artigos
          </button>
        </div>
      </section>
    );
  }

  const safeHtml = sanitizeArticleHtml(post.body);

  return (
    <>
      <article>
        <div className="border-b border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#171717]/45">
              <button
                type="button"
                onClick={() => onNavigate("/apoio-juridico")}
                className="transition hover:text-[#beaf87]"
              >
                Apoio Jurídico
              </button>
              <span>/</span>
              <span className="text-[#beaf87]">{post.category}</span>
            </nav>
          </div>
        </div>

        <header className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
              {post.category}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.14] text-[#2a2418] sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 flex items-center gap-2 text-sm text-[#171717]/52">
              <CalendarDays className="h-4 w-4 text-[#beaf87]" />
              {formatDate(post.created_at)}
            </p>
          </div>
        </header>

        <div className="px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            {post.cover_image_url ? (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="max-h-[560px] w-full rounded-[2rem] object-cover shadow-[0_24px_70px_rgba(40,32,20,0.12)]"
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-[2rem] bg-[#fbfaf7] sm:h-[420px]">
                <FileText className="h-14 w-14 text-[#beaf87]/70" />
              </div>
            )}
          </div>
        </div>

        <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div
            className="article-rich-text mx-auto max-w-3xl text-base leading-8 text-[#171717]/76 sm:text-lg sm:leading-9"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </section>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
                  Continue a leitura
                </p>
                <h2 className="font-serif text-3xl text-[#2a2418] sm:text-4xl">
                  Posts relacionados
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .article-rich-text h2 {
          margin-top: 2.6rem;
          margin-bottom: 1rem;
          color: #2a2418;
          font-family: Georgia, serif;
          font-size: 2rem;
          line-height: 1.22;
        }
        .article-rich-text h3 {
          margin-top: 2rem;
          margin-bottom: 0.8rem;
          color: #2a2418;
          font-size: 1.35rem;
          font-weight: 600;
        }
        .article-rich-text p { margin-bottom: 1.45rem; }
        .article-rich-text ul,
        .article-rich-text ol {
          margin: 1.3rem 0 1.6rem;
          padding-left: 1.6rem;
        }
        .article-rich-text ul { list-style: disc; }
        .article-rich-text ol { list-style: decimal; }
        .article-rich-text li { margin-bottom: 0.55rem; }
        .article-rich-text a {
          color: #947e4d;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .article-rich-text img {
          width: 100%;
          max-height: 520px;
          object-fit: cover;
          margin: 2.1rem 0;
          border-radius: 1.5rem;
        }
        .article-rich-text blockquote {
          border-left: 2px solid #beaf87;
          background: #fbfaf7;
          margin: 2rem 0;
          padding: 1.25rem 1.5rem;
          color: #2a2418;
        }
      `}</style>
    </>
  );
}

function PostCard({ post, onNavigate }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#beaf87]/24 bg-white shadow-[0_18px_54px_rgba(40,32,20,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_68px_rgba(40,32,20,0.12)]">
      <button
        type="button"
        onClick={() => onNavigate(`/apoio-juridico/${post.slug}`)}
        className="block overflow-hidden text-left"
      >
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-[#fbfaf7]">
            <FileText className="h-10 w-10 text-[#beaf87]/70" />
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#beaf87]">
            {post.category}
          </span>
          <span className="text-xs text-[#171717]/44">
            {formatDate(post.created_at)}
          </span>
        </div>

        <h2 className="mt-4 font-serif text-[1.65rem] leading-tight text-[#2a2418]">
          {post.title}
        </h2>
        <p className="mt-4 flex-1 text-sm leading-7 text-[#171717]/62">
          {summarizePost(post)}
        </p>

        <button
          type="button"
          onClick={() => onNavigate(`/apoio-juridico/${post.slug}`)}
          className="mt-6 flex items-center text-xs font-extrabold uppercase tracking-[0.17em] text-[#947e4d]"
        >
          Ler artigo
          <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Paginação">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/30 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
              page === currentPage
                ? "border-[#beaf87] bg-[#beaf87] text-black"
                : "border-[#beaf87]/30 text-[#171717]/66 hover:border-[#beaf87]"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/30 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}

function PublicFooter() {
  return (
          <footer className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-6 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 text-center lg:grid-cols-[1fr_1.2fr_0.8fr] lg:text-left">
            <div>
              <div className="mb-6 flex flex-col items-center gap-1 lg:items-start">
                <img
                  src={LOGO}
                  alt="CENTURY 21"
                  className="h-14 w-auto object-contain"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.38em] text-[#beaf87]">
                  Nações
                </span>
              </div>
    
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-3xl text-[#2a2418]">
                    Paulo Matos
                  </h3>
                  <p className="mt-1 text-[#171717]/68">
                    Consultor Imobiliário
                  </p>
                </div>
    
                <div>
                  <h3 className="font-serif text-3xl text-[#2a2418]">
                    Maria Carreiro
                  </h3>
                  <p className="mt-1 text-[#171717]/68">
                    Consultora Imobiliária
                  </p>
                </div>
              </div>
    
              <p className="mt-6 text-lg font-bold text-[#171717]">
                CENTURY 21.
              </p>
              <p className="text-[#beaf87]">Nações</p>
            </div>
    
            <div className="space-y-4 text-sm leading-7 text-[#171717]/68">
              <p className="flex flex-col items-center gap-3 lg:flex-row lg:items-start">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#beaf87]" />
                <span>
                  CENTURY 21 Nações IX
                  <br />
                  Rua Casquilha 2, 1500-151 Lisboa
                </span>
              </p>
    
        
            </div>
    
            <div className="flex flex-col items-center gap-4 text-sm text-[#171717]/68 lg:items-end">
              <a
                href="/contacte-nos"
                className="transition hover:text-[#beaf87]"
              >
                Contacte-nos
              </a>
    
              <a
                href="/politica-de-privacidade-e-cookies"
                className="transition hover:text-[#beaf87]"
              >
                Política de Privacidade e Cookies
              </a>
            </div>
          </div>
    
          <div className="mx-auto mt-10 max-w-7xl border-t border-[#beaf87]/20 pt-6 text-center text-xs leading-6 text-[#171717]/46">
            <p>Cada agência é jurídica e financeiramente independente.</p>
            <p>DNZ - Mediação Imobiliária, LDA AMI 10786</p>
          </div>
        </footer>
  );
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-28 top-0 h-[28rem] w-[28rem] rounded-full bg-[#beaf87]/16 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#beaf87]/12 blur-[145px]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(190,175,135,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(190,175,135,0.22) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute bottom-[-28px] right-8 hidden select-none text-[13rem] font-black leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_rgba(190,175,135,0.18)] lg:block">
        21
      </div>
    </div>
  );
}
