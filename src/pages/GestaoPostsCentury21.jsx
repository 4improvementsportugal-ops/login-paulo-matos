import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  BarChart3,
  Bold,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  FilePenLine,
  FileText,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Save,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const env = import.meta.env || {};

const LOGO = "/assets/logosite.png";
const STORAGE_BUCKET = "post-covers";
const DEFAULT_SUPABASE_URL =
  "https://keulsgyzfruvscapcuxk.supabase.co";

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

const SUPABASE_URL = normalizeSupabaseUrl(
  env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
);

const SUPABASE_PUBLISHABLE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Rg-J0l6M1cGxvNdIupJwrg_Y7GWhrFK";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const DEFAULT_CATEGORIES = [
  "Compra e Venda",
  "Documentação",
  "Crédito Habitação",
  "Arrendamento",
  "Fiscalidade Imobiliária",
  "Dicas Jurídicas",
];

const EMPTY_FORM = {
  id: null,
  title: "",
  slug: "",
  category: "",
  keyword: "",
  seoDescription: "",
  body: "",
  status: "rascunho",
  coverName: "",
  coverImageUrl: "",
};

const ADMIN_MENU = [
  {
    id: "imoveis",
    label: "Gestão de Imóveis",
    icon: Building2,
    path: "/admin/imoveis",
  },
  {
    id: "posts",
    label: "Gestão de Posts",
    icon: FileText,
    path: "/admin/posts",
  },
  {
    id: "usuarios",
    label: "Gestão de Usuários",
    icon: Users,
    path: "/admin/painel?secao=usuarios",
  },
];

function removeAccents(value = "") {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeSpaces(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeText(value = "") {
  return removeAccents(value).toLowerCase().trim();
}

function slugify(value = "") {
  return removeAccents(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseHtml(html = "") {
  if (typeof DOMParser === "undefined") {
    return null;
  }

  return new DOMParser().parseFromString(html, "text/html");
}

function removeHtml(html = "") {
  const parsedDocument = parseHtml(html);

  if (!parsedDocument) {
    return normalizeSpaces(html);
  }

  return normalizeSpaces(parsedDocument.body.textContent || "");
}

function countWords(text = "") {
  const normalizedText = normalizeSpaces(text);

  if (!normalizedText) {
    return 0;
  }

  return normalizedText.split(" ").filter(Boolean).length;
}

function includesKeyword(value, keyword) {
  if (!keyword.trim()) {
    return false;
  }

  return normalizeText(value).includes(normalizeText(keyword));
}

function getSentences(text = "") {
  return text
    .replace(/[!?;]/g, ".")
    .split(".")
    .map((sentence) => normalizeSpaces(sentence))
    .filter(Boolean);
}

function calculateReadingEase(cleanBody, sentences) {
  const words = cleanBody.split(" ").filter(Boolean);

  if (!words.length || !sentences.length) {
    return 0;
  }

  const averageSentenceLength = words.length / sentences.length;
  const averageWordLength =
    words.reduce((total, word) => total + word.length, 0) /
    words.length;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          Math.max(0, averageSentenceLength - 12) * 2.2 -
          Math.max(0, averageWordLength - 4.5) * 12
      )
    )
  );
}

function calculateSeo(form) {
  const parsedDocument = parseHtml(form.body);
  const cleanBody = removeHtml(form.body);
  const sentences = getSentences(cleanBody);

  const wordCount = countWords(cleanBody);
  const keyword = form.keyword.trim();
  const keywordWordCount = countWords(keyword);
  const titleLength = form.title.trim().length;
  const descriptionLength = form.seoDescription.trim().length;

  const paragraphs = parsedDocument
    ? Array.from(parsedDocument.body.querySelectorAll("p"))
        .map((paragraph) =>
          normalizeSpaces(paragraph.textContent || "")
        )
        .filter(Boolean)
    : [];

  const introduction = paragraphs.slice(0, 2).join(" ");

  const links = parsedDocument
    ? Array.from(parsedDocument.body.querySelectorAll("a"))
    : [];

  const internalLinkCount = links.filter((link) => {
    const href = link.getAttribute("href") || "";

    return href.startsWith("/") || href.startsWith("#");
  }).length;

  const externalLinkCount = links.filter((link) => {
    const href = link.getAttribute("href") || "";

    return (
      href.startsWith("http://") ||
      href.startsWith("https://")
    );
  }).length;

  const mediaCount = parsedDocument
    ? parsedDocument.body.querySelectorAll("img, video, iframe")
        .length
    : 0;

  const headingCount = parsedDocument
    ? parsedDocument.body.querySelectorAll("h2, h3").length
    : 0;

  const shortSentences = sentences.filter(
    (sentence) => countWords(sentence) <= 25
  ).length;

  const shortSentencePercentage = sentences.length
    ? Math.round((shortSentences / sentences.length) * 100)
    : 0;

  const paragraphLengthPassed =
    paragraphs.length > 0 &&
    paragraphs.every((paragraph) => countWords(paragraph) <= 120);

  const passiveMarkers = [
    " foi ",
    " foram ",
    " será ",
    " serão ",
    " é realizado ",
    " é realizada ",
    " são realizados ",
    " são realizadas ",
  ];

  const searchableBody = ` ${normalizeText(cleanBody)} `;

  const passiveOccurrences = passiveMarkers.filter((marker) =>
    searchableBody.includes(normalizeText(marker))
  ).length;

  const passiveVoicePassed =
    sentences.length > 0 && passiveOccurrences <= 1;

  const transitionWords = [
    "além disso",
    "por isso",
    "portanto",
    "contudo",
    "no entanto",
    "assim",
    "por exemplo",
    "deste modo",
    "por fim",
    "consequentemente",
  ];

  const sentencesWithTransitions = sentences.filter((sentence) =>
    transitionWords.some((word) =>
      includesKeyword(sentence, word)
    )
  ).length;

  const transitionPercentage = sentences.length
    ? Math.round(
        (sentencesWithTransitions / sentences.length) * 100
      )
    : 0;

  const firstWords = sentences.map(
    (sentence) => normalizeText(sentence).split(" ")[0]
  );

  const hasThreeConsecutiveStarts = firstWords.some(
    (word, index) =>
      index >= 2 &&
      Boolean(word) &&
      word === firstWords[index - 1] &&
      word === firstWords[index - 2]
  );

  const readingEase = calculateReadingEase(cleanBody, sentences);

  const groups = {
    basic: [
      {
        label: "Palavra-chave no conteúdo",
        passed:
          Boolean(keyword) && includesKeyword(cleanBody, keyword),
        tip: "Inclua a palavra-chave principal naturalmente no conteúdo.",
      },
      {
        label: "Palavra-chave na introdução",
        passed:
          Boolean(keyword) && includesKeyword(introduction, keyword),
        tip: "Inclua a palavra-chave nos primeiros parágrafos do artigo.",
      },
      {
        label: "Palavra-chave na descrição SEO",
        passed:
          Boolean(keyword) &&
          includesKeyword(form.seoDescription, keyword),
        tip: "Inclua a palavra-chave na descrição SEO.",
      },
      {
        label: "Palavra-chave na URL",
        passed:
          Boolean(keyword) &&
          includesKeyword(
            form.slug.replace(/-/g, " "),
            keyword
          ),
        tip: "Inclua a palavra-chave na slug do artigo.",
      },
      {
        label: "Tamanho da palavra-chave",
        passed:
          keywordWordCount >= 2 && keywordWordCount <= 5,
        tip: "Utilize uma palavra-chave entre 2 e 5 palavras.",
      },
      {
        label: "Tamanho da descrição SEO",
        passed:
          descriptionLength >= 120 &&
          descriptionLength <= 160,
        tip: "Escreva uma descrição SEO entre 120 e 160 caracteres.",
      },
      {
        label: "Extensão do conteúdo",
        passed: wordCount >= 300,
        tip: "Desenvolva o artigo até atingir pelo menos 300 palavras.",
      },
      {
        label: "Links internos",
        passed: internalLinkCount >= 1,
        tip: "Adicione um link interno, por exemplo: /credito-habitacao.",
      },
      {
        label: "Links externos",
        passed: externalLinkCount >= 1,
        tip: "Adicione um link externo relevante para uma fonte confiável.",
      },
    ],

    title: [
      {
        label: "Palavra-chave no título SEO",
        passed:
          Boolean(keyword) &&
          includesKeyword(form.title, keyword),
        tip: "Inclua a palavra-chave principal no título.",
      },
      {
        label: "Palavra-chave no início do título SEO",
        passed:
          Boolean(keyword) &&
          normalizeText(form.title).startsWith(
            normalizeText(keyword)
          ),
        tip: "Comece o título com a palavra-chave principal.",
      },
      {
        label: "Tamanho do título SEO",
        passed: titleLength >= 45 && titleLength <= 60,
        tip: "Ajuste o título para 45 a 60 caracteres.",
      },
    ],

    readability: [
      {
        label: "Imagens ou vídeos no conteúdo",
        passed: mediaCount >= 1,
        tip: "Inclua uma imagem ou vídeo dentro do corpo do artigo.",
      },
      {
        label: "Tamanho dos parágrafos",
        passed: paragraphLengthPassed,
        tip: "Evite parágrafos com mais de 120 palavras.",
      },
      {
        label: "Tamanho das frases",
        passed:
          sentences.length > 0 &&
          shortSentencePercentage >= 75,
        tip: "Mantenha pelo menos 75% das frases com até 25 palavras.",
      },
      {
        label: "Voz passiva",
        passed: passiveVoicePassed,
        tip: "Reduza construções em voz passiva para melhorar a clareza.",
      },
      {
        label: "Palavras de transição",
        passed: transitionPercentage >= 10,
        tip: "Utilize conectores como por isso, além disso ou por fim.",
      },
      {
        label: "Frases consecutivas",
        passed:
          sentences.length > 0 &&
          !hasThreeConsecutiveStarts,
        tip: "Evite iniciar três frases consecutivas com a mesma palavra.",
      },
      {
        label: "Distribuição de subtítulos",
        passed: headingCount >= 2,
        tip: "Distribua o conteúdo utilizando pelo menos dois subtítulos.",
      },
      {
        label: "Facilidade de leitura",
        passed: readingEase >= 50,
        tip: "Simplifique frases e palavras para melhorar a legibilidade.",
      },
    ],
  };

  const checks = [
    ...groups.basic,
    ...groups.title,
    ...groups.readability,
  ];

  const passedChecks = checks.filter((check) => check.passed).length;

  const score = Math.round(
    (passedChecks / checks.length) * 100
  );

  let label = "A melhorar";

  if (score >= 80) {
    label = "Muito bom";
  } else if (score >= 60) {
    label = "Bom";
  } else if (score >= 40) {
    label = "Em progresso";
  }

  return {
    score,
    label,
    groups,
    wordCount,
    titleLength,
    descriptionLength,
    internalLinkCount,
    externalLinkCount,
    mediaCount,
    readingEase,
  };
}

function mapDatabasePost(post) {
  const coverImageUrl = post.cover_image_url || "";

  return {
    id: post.id,
    title: post.title || "",
    slug: post.slug || "",
    category: post.category || "",
    keyword: post.keyword || "",
    seoDescription: post.seo_description || "",
    body: post.body || "",
    status: post.status || "rascunho",
    coverImageUrl,
    coverName: coverImageUrl
      ? decodeURIComponent(
          coverImageUrl.split("/").pop() || ""
        )
      : "",
    updatedAt: post.updated_at
      ? new Date(post.updated_at).toLocaleDateString("pt-PT")
      : "—",
  };
}

function sanitizeFileName(fileName = "") {
  return removeAccents(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

function getStoragePath(publicUrl) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

  if (!publicUrl || !publicUrl.includes(marker)) {
    return null;
  }

  return decodeURIComponent(publicUrl.split(marker)[1]);
}

function BrandLogo() {
  return (
    <div className="flex flex-col items-center gap-1 lg:items-start">
      <img
        src={LOGO}
        alt="CENTURY 21"
        className="h-10 w-auto object-contain sm:h-12"
      />

      <span className="pl-[0.34em] text-[0.64rem] font-semibold uppercase tracking-[0.34em] text-[#beaf87] sm:text-[0.7rem]">
        Nações
      </span>
    </div>
  );
}

export default function GestaoPostsCentury21() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggedUserEmail, setLoggedUserEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(
    DEFAULT_CATEGORIES
  );

  const [view, setView] = useState("list");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [notice, setNotice] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const seo = useMemo(() => calculateSeo(form), [form]);

  useEffect(() => {
    let mounted = true;

    async function validateSessionAndLoadData() {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (error || !session) {
        window.location.href = "/admin/login";
        return;
      }

      if (!mounted) {
        return;
      }

      setCurrentUser(session.user);
      setLoggedUserEmail(session.user.email || "");

      await Promise.all([
        loadPosts(),
        loadCategories(),
      ]);

      if (mounted) {
        setCheckingSession(false);
      }
    }

    validateSessionAndLoadData();

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          window.location.href = "/admin/login";
          return;
        }

        setCurrentUser(session.user);
        setLoggedUserEmail(session.user.email || "");
      });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  async function loadPosts() {
    setLoadingPosts(true);

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id,title,slug,category,keyword,seo_description,body,status,cover_image_url,seo_score,created_at,updated_at,author_id"
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar posts:", error);

      setNotice({
        type: "error",
        text: "Não foi possível carregar os posts. Confirme as permissões da tabela posts no Supabase.",
      });

      setPosts([]);
    } else {
      setPosts((data || []).map(mapDatabasePost));
    }

    setLoadingPosts(false);
  }

  async function loadCategories() {
    const { data, error } = await supabase
      .from("post_categories")
      .select("id,name,slug")
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao carregar categorias:", error);
      setCategories(DEFAULT_CATEGORIES);
      return;
    }

    const databaseCategories = (data || []).map(
      (category) => category.name
    );

    const allCategories = [
      ...new Set([
        ...DEFAULT_CATEGORIES,
        ...databaseCategories,
      ]),
    ];

    setCategories(
      allCategories.sort((first, second) =>
        first.localeCompare(second, "pt-PT")
      )
    );
  }

  const filteredPosts = useMemo(() => {
    const term = searchText.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTerm =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.category.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "todos" ||
        post.status === statusFilter;

      return matchesTerm && matchesStatus;
    });
  }, [posts, searchText, statusFilter]);

  const totals = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter(
        (post) => post.status === "publicado"
      ).length,
      drafts: posts.filter(
        (post) => post.status === "rascunho"
      ).length,
    }),
    [posts]
  );

  function handleMenuNavigation(item) {
    setSidebarOpen(false);

    if (item.id !== "posts") {
      window.location.href = item.path;
    }
  }

  function startNewPost() {
    setForm({ ...EMPTY_FORM });
    setCoverFile(null);
    setCoverPreview("");
    setNotice(null);
    setShowNewCategory(false);
    setNewCategoryName("");
    setView("editor");
  }

  function editPost(post) {
    setForm({ ...post });
    setCoverFile(null);
    setCoverPreview(post.coverImageUrl || "");
    setNotice(null);
    setShowNewCategory(false);
    setNewCategoryName("");
    setView("editor");
  }

  function handleTitleChange(event) {
    const title = event.target.value;

    setForm((current) => ({
      ...current,
      title,
      slug:
        current.id && current.slug
          ? current.slug
          : slugify(title),
    }));
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setNotice({
        type: "error",
        text: "Utilize apenas imagens JPG, PNG ou WEBP.",
      });

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice({
        type: "error",
        text: "A imagem de capa deve ter no máximo 5 MB.",
      });

      return;
    }

    if (coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));

    setForm((current) => ({
      ...current,
      coverName: file.name,
    }));
  }

  async function createCategory() {
    const categoryName = normalizeSpaces(newCategoryName);

    if (!currentUser) {
      window.location.href = "/admin/login";
      return;
    }

    if (categoryName.length < 3) {
      setNotice({
        type: "error",
        text: "A categoria deve ter pelo menos 3 caracteres.",
      });

      return;
    }

    setCreatingCategory(true);
    setNotice(null);

    const { data, error } = await supabase
      .from("post_categories")
      .insert({
        name: categoryName,
        slug: slugify(categoryName),
        created_by: currentUser.id,
      })
      .select("id,name,slug")
      .single();

    if (error) {
      console.error("Erro ao criar categoria:", error);

      setNotice({
        type: "error",
        text:
          error.code === "23505"
            ? "Esta categoria já existe. Selecione-a na lista."
            : "Não foi possível criar a categoria.",
      });

      setCreatingCategory(false);
      return;
    }

    await loadCategories();

    setForm((current) => ({
      ...current,
      category: data.name,
    }));

    setNewCategoryName("");
    setShowNewCategory(false);
    setCreatingCategory(false);

    setNotice({
      type: "success",
      text: "Categoria criada com sucesso.",
    });
  }

  async function uploadCoverImage() {
    if (!coverFile) {
      return form.coverImageUrl || null;
    }

    if (!currentUser) {
      throw new Error(
        "A sessão expirou. Inicie sessão novamente."
      );
    }

    const filePath = `${
      currentUser.id
    }/${Date.now()}-${sanitizeFileName(coverFile.name)}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, coverFile, {
        cacheControl: "3600",
        contentType: coverFile.type,
        upsert: false,
      });

    if (error) {
      console.error("Erro ao enviar imagem:", error);

      throw new Error(
        "Não foi possível enviar a imagem de capa."
      );
    }

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function removeStoredCover(publicUrl) {
    const storagePath = getStoragePath(publicUrl);

    if (!storagePath) {
      return;
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error("Erro ao remover imagem:", error);
    }
  }

  async function savePost(status) {
    setNotice(null);

    if (!currentUser) {
      window.location.href = "/admin/login";
      return;
    }

    const title = form.title.trim();

    if (!title) {
      setNotice({
        type: "error",
        text: "Introduza um título antes de guardar o post.",
      });

      return;
    }

    if (status === "publicado") {
      const requiredFieldsCompleted =
        form.slug.trim() &&
        form.category.trim() &&
        form.keyword.trim() &&
        form.seoDescription.trim() &&
        removeHtml(form.body);

      if (!requiredFieldsCompleted) {
        setNotice({
          type: "error",
          text: "Para publicar, preencha título, slug, categoria, palavra-chave, descrição SEO e conteúdo.",
        });

        return;
      }

      if (seo.score < 60) {
        const confirmed = window.confirm(
          "A pontuação SEO ainda está abaixo de 60. Pretende publicar mesmo assim?"
        );

        if (!confirmed) {
          return;
        }
      }
    }

    setSavingPost(true);

    let newCoverUrl = form.coverImageUrl || null;

    try {
      newCoverUrl = await uploadCoverImage();

      const payload = {
        title,
        slug: form.slug.trim() || slugify(title),
        category: form.category.trim(),
        keyword: form.keyword.trim(),
        seo_description: form.seoDescription.trim(),
        body: form.body || "",
        status,
        cover_image_url: newCoverUrl,
        seo_score: seo.score,
      };

      let error;

      if (form.id) {
        const response = await supabase
          .from("posts")
          .update(payload)
          .eq("id", form.id);

        error = response.error;
      } else {
        const response = await supabase
          .from("posts")
          .insert({
            ...payload,
            author_id: currentUser.id,
          });

        error = response.error;
      }

      if (error) {
        if (
          coverFile &&
          newCoverUrl &&
          newCoverUrl !== form.coverImageUrl
        ) {
          await removeStoredCover(newCoverUrl);
        }

        console.error("Erro ao guardar post:", error);

        setNotice({
          type: "error",
          text:
            error.code === "23505"
              ? "Já existe um post com esta slug. Escolha uma URL diferente."
              : "Não foi possível guardar o post no Supabase.",
        });

        return;
      }

      if (
        coverFile &&
        form.coverImageUrl &&
        newCoverUrl !== form.coverImageUrl
      ) {
        await removeStoredCover(form.coverImageUrl);
      }

      await loadPosts();

      setNotice({
        type: "success",
        text:
          status === "publicado"
            ? "Post publicado com sucesso."
            : "Rascunho guardado com sucesso.",
      });

      setForm({ ...EMPTY_FORM });
      setCoverFile(null);
      setCoverPreview("");
      setView("list");
    } catch (error) {
      console.error("Erro ao guardar post:", error);

      setNotice({
        type: "error",
        text:
          error.message ||
          "Não foi possível guardar o post.",
      });
    } finally {
      setSavingPost(false);
    }
  }

  async function deletePost(post) {
    if (!currentUser) {
      window.location.href = "/admin/login";
      return;
    }

    const confirmed = window.confirm(
      "Tem a certeza de que pretende eliminar este post?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingPostId(post.id);
    setNotice(null);

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.error("Erro ao eliminar post:", error);

      setNotice({
        type: "error",
        text: "Não foi possível eliminar o post.",
      });

      setDeletingPostId(null);
      return;
    }

    if (post.coverImageUrl) {
      await removeStoredCover(post.coverImageUrl);
    }

    await loadPosts();

    setNotice({
      type: "success",
      text: "Post eliminado com sucesso.",
    });

    setDeletingPostId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (checkingSession) {
    return (
      <main className="fixed inset-0 min-h-[100dvh] bg-black" />
    );
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <BackgroundDetails />

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu lateral"
        />
      )}

      <div className="relative z-10 flex min-h-[100dvh]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[285px] flex-col border-r border-[#beaf87]/15 bg-[#080808]/98 px-5 py-6 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between">
            <BrandLogo />

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-full border border-[#beaf87]/18 p-2 text-[#beaf87] lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-5 mt-12 px-3 text-[0.64rem] font-bold uppercase tracking-[0.32em] text-[#beaf87]/68">
            Menu administrativo
          </p>

          <nav className="space-y-2">
            {ADMIN_MENU.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === "posts";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleMenuNavigation(item)
                  }
                  className={`flex w-full items-center rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                    isActive
                      ? "border-[#beaf87]/30 bg-[#beaf87]/12 text-[#beaf87]"
                      : "border-transparent text-white/64 hover:border-[#beaf87]/15 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#beaf87]/12 bg-[#0e0e0e] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#beaf87]/70">
              Sessão ativa
            </p>

            <p className="mt-2 truncate text-sm text-white/68">
              {loggedUserEmail}
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center rounded-xl border border-[#beaf87]/18 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-20 items-center border-b border-[#beaf87]/12 bg-black/45 px-5 backdrop-blur sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/22 text-[#beaf87] lg:hidden"
                aria-label="Abrir menu administrativo"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.34em] text-[#beaf87]/70">
                  Back-office
                </p>

                <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                  Gestão de Posts
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            {view === "list" ? (
              <PostsList
                posts={filteredPosts}
                totals={totals}
                notice={notice}
                loadingPosts={loadingPosts}
                searchText={searchText}
                setSearchText={setSearchText}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onNew={startNewPost}
                onEdit={editPost}
                onDelete={deletePost}
                deletingPostId={deletingPostId}
              />
            ) : (
              <PostEditor
                form={form}
                setForm={setForm}
                seo={seo}
                notice={notice}
                categories={categories}
                coverPreview={coverPreview}
                savingPost={savingPost}
                showNewCategory={showNewCategory}
                setShowNewCategory={setShowNewCategory}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                creatingCategory={creatingCategory}
                onCreateCategory={createCategory}
                onTitleChange={handleTitleChange}
                onCoverChange={handleCoverChange}
                onBack={() => setView("list")}
                onSaveDraft={() => savePost("rascunho")}
                onPublish={() => savePost("publicado")}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Notice({ notice }) {
  if (!notice?.text) {
    return null;
  }

  const isError = notice.type === "error";

  return (
    <div
      className={`mb-6 rounded-2xl border px-5 py-4 text-sm leading-6 ${
        isError
          ? "border-red-400/20 bg-red-500/10 text-red-100"
          : "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      }`}
    >
      {notice.text}
    </div>
  );
}

function PostsList({
  posts,
  totals,
  notice,
  loadingPosts,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  onNew,
  onEdit,
  onDelete,
  deletingPostId,
}) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-9 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
            Conteúdos jurídicos e imobiliários
          </p>

          <h2 className="font-serif text-3xl leading-tight text-[#beaf87] sm:text-4xl">
            Gestão de Posts
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            Crie artigos com estrutura otimizada para pesquisa,
            monitorize a qualidade SEO e publique conteúdos na
            área de Apoio Jurídico.
          </p>
        </div>

        <button
          type="button"
          onClick={onNew}
          className="flex h-14 shrink-0 items-center justify-center rounded-2xl bg-[#beaf87] px-7 text-sm font-extrabold uppercase tracking-[0.15em] text-black transition hover:brightness-110"
        >
          <Plus className="mr-3 h-5 w-5" />
          Novo post
        </button>
      </div>

      <Notice notice={notice} />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total de posts"
          value={totals.all}
          icon={FileText}
        />

        <SummaryCard
          label="Publicados"
          value={totals.published}
          icon={Eye}
        />

        <SummaryCard
          label="Rascunhos"
          value={totals.drafts}
          icon={FilePenLine}
        />
      </div>

      <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <label className="flex h-14 flex-1 items-center rounded-2xl border border-[#beaf87]/14 bg-black px-4 focus-within:border-[#beaf87]/50">
            <Search className="mr-3 h-5 w-5 text-[#beaf87]" />

            <input
              type="search"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              placeholder="Pesquisar por título ou categoria"
              className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34"
            />
          </label>

          <label className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-14 min-w-[195px] appearance-none rounded-2xl border border-[#beaf87]/14 bg-black py-3 pl-4 pr-11 text-sm text-white outline-none transition focus:border-[#beaf87]/50"
            >
              <option value="todos">Todos os estados</option>
              <option value="publicado">Publicados</option>
              <option value="rascunho">Rascunhos</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
          </label>
        </div>

        <div className="hidden grid-cols-[minmax(280px,1fr)_180px_130px_130px_130px] gap-4 border-b border-[#beaf87]/12 px-4 pb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/38 lg:grid">
          <span>Artigo</span>
          <span>Categoria</span>
          <span>Estado</span>
          <span>Atualizado</span>
          <span className="text-right">Ações</span>
        </div>

        {loadingPosts ? (
          <div className="flex min-h-[230px] items-center justify-center text-sm text-white/54">
            A carregar posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
            <FileText className="mb-4 h-10 w-10 text-[#beaf87]/55" />

            <p className="text-sm text-white/54">
              Nenhum post encontrado.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#beaf87]/10">
            {posts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
                deleting={deletingPostId === post.id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-[1.5rem] border border-[#beaf87]/14 bg-[#090909]/85 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
          {label}
        </p>

        <p className="mt-3 font-serif text-4xl text-[#beaf87]">
          {value}
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#beaf87]/18 bg-[#beaf87]/8">
        <Icon className="h-5 w-5 text-[#beaf87]" />
      </div>
    </div>
  );
}

function PostRow({
  post,
  onEdit,
  onDelete,
  deleting,
}) {
  return (
    <article className="grid gap-4 px-2 py-5 sm:px-4 lg:grid-cols-[minmax(280px,1fr)_180px_130px_130px_130px] lg:items-center">
      <div>
        <p className="font-medium leading-6 text-white">
          {post.title}
        </p>

        <p className="mt-2 truncate text-xs text-white/42">
          /{post.slug}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/58">
        <Tag className="h-4 w-4 text-[#beaf87] lg:hidden" />
        {post.category || "Sem categoria"}
      </div>

      <StatusBadge status={post.status} />

      <div className="flex items-center gap-2 text-sm text-white/54">
        <CalendarDays className="h-4 w-4 text-[#beaf87] lg:hidden" />
        {post.updatedAt}
      </div>

      <div className="flex gap-2 lg:justify-end">
        <button
          type="button"
          onClick={() => onEdit(post)}
          disabled={deleting}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#beaf87]/18 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Editar post"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(post)}
          disabled={deleting}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/18 text-red-300 transition hover:bg-red-400/16 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Eliminar post"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const published = status === "publicado";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${
        published
          ? "border-emerald-400/22 bg-emerald-400/10 text-emerald-300"
          : "border-[#beaf87]/24 bg-[#beaf87]/8 text-[#beaf87]"
      }`}
    >
      {status}
    </span>
  );
}

function PostEditor({
  form,
  setForm,
  seo,
  notice,
  categories,
  coverPreview,
  savingPost,
  showNewCategory,
  setShowNewCategory,
  newCategoryName,
  setNewCategoryName,
  creatingCategory,
  onCreateCategory,
  onTitleChange,
  onCoverChange,
  onBack,
  onSaveDraft,
  onPublish,
}) {
  return (
    <section className="mx-auto max-w-[1450px]">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={savingPost}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/20 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black disabled:opacity-40"
            aria-label="Voltar à lista de posts"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#beaf87]">
              {form.id ? "Editar conteúdo" : "Novo conteúdo"}
            </p>

            <h2 className="mt-2 font-serif text-3xl text-white">
              {form.id ? "Editar post" : "Criar novo post"}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingPost}
            className="flex h-14 items-center justify-center rounded-2xl border border-[#beaf87]/24 px-6 text-sm font-bold uppercase tracking-[0.13em] text-[#beaf87] transition hover:bg-white/[0.04] disabled:opacity-40"
          >
            <Save className="mr-2 h-4 w-4" />
            {savingPost ? "A guardar..." : "Guardar rascunho"}
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={savingPost}
            className="flex h-14 items-center justify-center rounded-2xl bg-[#beaf87] px-6 text-sm font-extrabold uppercase tracking-[0.13em] text-black transition hover:brightness-110 disabled:opacity-40"
          >
            {savingPost ? "A guardar..." : "Publicar post"}
          </button>
        </div>
      </div>

      <Notice notice={notice} />

      <div className="grid gap-6 xl:grid-cols-[minmax(540px,1fr)_385px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <SectionTitle title="Informações do post" />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <FormField
                label="Título do post"
                className="md:col-span-2"
              >
                <input
                  type="text"
                  value={form.title}
                  onChange={onTitleChange}
                  placeholder="Ex.: Como preparar a venda do seu imóvel"
                  className="field-input"
                />

                <Counter
                  current={seo.titleLength}
                  ideal="Ideal: 45 a 60 caracteres"
                />
              </FormField>

              <FormField label="Slug / URL amigável">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: slugify(event.target.value),
                    }))
                  }
                  placeholder="como-preparar-venda-imovel"
                  className="field-input"
                />

                <p className="mt-2 text-xs text-white/38">
                  /apoio-juridico/
                  {form.slug || "url-do-artigo"}
                </p>
              </FormField>

              <FormField label="Categoria">
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    className="field-input appearance-none pr-12"
                  >
                    <option value="">Selecionar categoria</option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNewCategory((current) => !current)
                  }
                  className="mt-3 inline-flex items-center text-xs font-bold uppercase tracking-[0.12em] text-[#beaf87] transition hover:text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar nova categoria
                </button>

                {showNewCategory && (
                  <div className="mt-3 rounded-2xl border border-[#beaf87]/14 bg-black p-3">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(event) =>
                        setNewCategoryName(event.target.value)
                      }
                      placeholder="Nome da nova categoria"
                      className="field-input"
                    />

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={onCreateCategory}
                        disabled={creatingCategory}
                        className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#beaf87] px-3 text-xs font-extrabold uppercase tracking-[0.12em] text-black disabled:opacity-40"
                      >
                        {creatingCategory
                          ? "A guardar..."
                          : "Guardar categoria"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName("");
                        }}
                        className="flex h-10 items-center justify-center rounded-xl border border-[#beaf87]/18 px-3 text-xs font-bold uppercase text-[#beaf87]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </FormField>

              <FormField
                label="Palavra-chave principal (Focus Keyword)"
                className="md:col-span-2"
              >
                <input
                  type="text"
                  value={form.keyword}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      keyword: event.target.value,
                    }))
                  }
                  placeholder="Ex.: documentos para comprar casa"
                  className="field-input"
                />

                <p className="mt-2 text-xs text-white/38">
                  Usada para analisar título, URL, descrição,
                  introdução e conteúdo.
                </p>
              </FormField>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <SectionTitle title="Imagem de capa" />

            <label className="mt-6 flex min-h-[170px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.4rem] border border-dashed border-[#beaf87]/30 bg-black transition hover:border-[#beaf87]/60">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Pré-visualização da capa"
                  className="h-[210px] w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto mb-3 h-8 w-8 text-[#beaf87]" />

                  <p className="text-sm font-medium text-white/72">
                    Adicionar imagem de capa
                  </p>

                  <p className="mt-2 text-xs text-white/40">
                    JPG, PNG ou WEBP · Máximo de 5 MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={savingPost}
                onChange={onCoverChange}
              />
            </label>
          </div>

          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <SectionTitle title="Conteúdo do artigo" />

            <div className="mt-6">
              <RichTextEditor
                value={form.body}
                onChange={(body) =>
                  setForm((current) => ({
                    ...current,
                    body,
                  }))
                }
              />

              <p className="mt-3 text-xs leading-6 text-white/42">
                {seo.wordCount} palavras · Recomenda-se incluir
                palavra-chave na introdução, links internos e
                externos, subtítulos e pelo menos uma imagem ou
                vídeo no conteúdo.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <SectionTitle title="Descrição SEO" />

            <FormField
              label="Meta description"
              className="mt-6"
            >
              <textarea
                value={form.seoDescription}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    seoDescription: event.target.value,
                  }))
                }
                placeholder="Resumo atrativo que aparecerá nos resultados de pesquisa..."
                rows={4}
                className="field-input min-h-[116px] resize-none py-4"
              />

              <Counter
                current={seo.descriptionLength}
                ideal="Ideal: 120 a 160 caracteres"
              />
            </FormField>
          </div>
        </div>

        <SeoPanel seo={seo} keyword={form.keyword} />
      </div>

      <style>{`
        .field-input {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: 1px solid rgba(190, 175, 135, 0.16);
          background: #000;
          padding: 0 16px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .field-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .field-input:focus {
          border-color: rgba(190, 175, 135, 0.78);
          box-shadow: 0 0 0 4px rgba(190, 175, 135, 0.1);
        }
      `}</style>
    </section>
  );
}

function FormField({
  label,
  children,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-white/72">
        {label}
      </span>

      {children}
    </label>
  );
}

function Counter({ current, ideal }) {
  return (
    <div className="mt-2 flex items-center justify-between text-xs text-white/38">
      <span>{ideal}</span>
      <span>{current} caracteres</span>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-1 rounded-full bg-[#beaf87]" />

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>
    </div>
  );
}

function RichTextEditor({
  value,
  onChange,
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== value
    ) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function apply(command, commandValue = null) {
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();

    onChange(editorRef.current?.innerHTML || "");
  }

  function addLink() {
    const link = window.prompt(
      "Introduza o endereço do link:"
    );

    if (link) {
      apply("createLink", link);
    }
  }

  function addContentImage() {
    const imageUrl = window.prompt(
      "Introduza o endereço da imagem a inserir no conteúdo:"
    );

    if (imageUrl) {
      apply("insertImage", imageUrl);
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-[#beaf87]/16 bg-black">
      <div className="flex flex-wrap gap-2 border-b border-[#beaf87]/12 p-3">
        <ToolbarButton
          label="Negrito"
          onClick={() => apply("bold")}
          icon={Bold}
        />

        <ToolbarButton
          label="Itálico"
          onClick={() => apply("italic")}
          icon={Italic}
        />

        <ToolbarButton
          label="Subtítulo"
          onClick={() => apply("formatBlock", "h2")}
          icon={Heading2}
        />

        <ToolbarButton
          label="Lista"
          onClick={() => apply("insertUnorderedList")}
          icon={List}
        />

        <ToolbarButton
          label="Link"
          onClick={addLink}
          icon={Link2}
        />

        <ToolbarButton
          label="Imagem no conteúdo"
          onClick={addContentImage}
          icon={ImagePlus}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) =>
          onChange(event.currentTarget.innerHTML)
        }
        className="min-h-[270px] px-5 py-4 text-sm leading-8 text-white/78 outline-none [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-[#beaf87] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_img]:my-5 [&_img]:max-h-[350px] [&_img]:w-full [&_img]:rounded-xl [&_img]:object-cover"
      />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/58 transition hover:bg-[#beaf87]/12 hover:text-[#beaf87]"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function SeoPanel({
  seo,
  keyword,
}) {
  return (
    <aside className="xl:sticky xl:top-6 xl:h-fit">
      <div className="rounded-[2rem] border border-[#beaf87]/18 bg-[#090909]/94 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#beaf87]">
              Análise SEO
            </p>

            <h3 className="mt-3 text-xl font-semibold text-white">
              Qualidade do post
            </h3>
          </div>

          <BarChart3 className="h-6 w-6 text-[#beaf87]" />
        </div>

        <div className="mt-7 flex items-center gap-5 rounded-[1.5rem] border border-[#beaf87]/14 bg-black p-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[5px] border-[#beaf87]/30 text-center">
            <span className="font-serif text-3xl text-[#beaf87]">
              {seo.score}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {seo.label}
            </p>

            <p className="mt-2 text-xs leading-6 text-white/46">
              Resultado baseado em SEO básico, título e
              legibilidade.
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-[#beaf87] transition-all duration-500"
            style={{
              width: `${seo.score}%`,
            }}
          />
        </div>

        <div className="mt-7 rounded-2xl border border-[#beaf87]/12 bg-[#beaf87]/[0.04] p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#beaf87]">
            <TrendingUp className="h-4 w-4" />
            Focus Keyword
          </p>

          <p className="mt-3 text-sm text-white/62">
            {keyword.trim() || "Ainda não definida"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricCard
            label="Links internos"
            value={seo.internalLinkCount}
          />

          <MetricCard
            label="Links externos"
            value={seo.externalLinkCount}
          />

          <MetricCard
            label="Multimédia"
            value={seo.mediaCount}
          />

          <MetricCard
            label="Leitura"
            value={`${seo.readingEase}%`}
          />
        </div>

        <div className="mt-7 space-y-4">
          <SeoCriteriaGroup
            title="SEO básico"
            checks={seo.groups.basic}
          />

          <SeoCriteriaGroup
            title="Título"
            checks={seo.groups.title}
          />

          <SeoCriteriaGroup
            title="Legibilidade"
            checks={seo.groups.readability}
          />
        </div>

        <p className="mt-6 text-xs leading-6 text-white/36">
          A análise é uma orientação editorial e técnica para
          otimização do conteúdo e não garante posicionamento nos
          motores de pesquisa.
        </p>
      </div>
    </aside>
  );
}

function MetricCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#beaf87]/12 bg-black p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/42">
        {label}
      </p>

      <p className="mt-2 font-serif text-2xl text-[#beaf87]">
        {value}
      </p>
    </div>
  );
}

function SeoCriteriaGroup({
  title,
  checks,
}) {
  const errors = checks.filter(
    (check) => !check.passed
  ).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#beaf87]/12 bg-black">
      <div className="flex items-center justify-between border-b border-[#beaf87]/10 px-4 py-4">
        <h4 className="text-sm font-bold text-white">
          {title}
        </h4>

        <span
          className={`text-xs font-semibold ${
            errors === 0
              ? "text-emerald-300"
              : "text-[#beaf87]"
          }`}
        >
          {errors === 0
            ? "Tudo certo!"
            : `${errors} ${
                errors === 1 ? "erro" : "erros"
              }`}
        </span>
      </div>

      <div className="space-y-1 p-2">
        {checks.map((check) => (
          <SeoCriterion
            key={check.label}
            check={check}
          />
        ))}
      </div>
    </section>
  );
}

function SeoCriterion({
  check,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl px-3 py-3">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          check.passed
            ? "border-emerald-400 text-emerald-300"
            : "border-red-400 text-red-300"
        }`}
      >
        {check.passed ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-white/78">
          {check.label}
        </p>

        {!check.passed && (
          <p className="mt-1.5 text-xs leading-5 text-white/48">
            {check.tip}
          </p>
        )}
      </div>
    </div>
  );
}

function BackgroundDetails() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#beaf87]/10 blur-[120px]" />
      <div className="absolute -bottom-40 right-0 h-[34rem] w-[34rem] rounded-full bg-[#beaf87]/8 blur-[150px]" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(190,175,135,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(190,175,135,0.22) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
    </div>
  );
}