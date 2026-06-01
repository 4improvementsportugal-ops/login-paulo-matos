import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  FileText,
  Home,
  ImagePlus,
  ListChecks,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

const ENV = import.meta.env || {};
const LOGO = "/assets/logosite.png";
const DEFAULT_SUPABASE_URL = "https://keulsgyzfruvscapcuxk.supabase.co";
const DEFAULT_SUPABASE_KEY =
  "sb_publishable_Rg-J0l6M1cGxvNdIupJwrg_Y7GWhrFK";

const STORAGE_BUCKET = "property-photos";
const MAX_PUBLISHED_PROPERTIES = 8;
const MAX_PROPERTY_PHOTOS = 12;

const FIXED_CREDIT_SIMULATION_URL =
  "https://pjmatos.century21.pt/credito-habitacao";

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

const SUPABASE_URL = normalizeSupabaseUrl(
  ENV.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
);

const SUPABASE_PUBLISHABLE_KEY =
  ENV.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

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

const CONSULTANTS = [
  {
    id: "paulo",
    name: "Paulo Matos",
    role: "Consultor Imobiliário",
    phone: "+351 919 783 014",
    email: "pjmatos@century21.pt",
  },
  {
    id: "maria",
    name: "Maria Carreiro",
    role: "Consultora Imobiliária",
    phone: "+351 937 219 215",
    email: "mjcarreiro@century21.pt",
  },
];

const PROPERTY_TYPES = [
  "Apartamento",
  "Moradia",
  "Terreno",
  "Loja",
  "Escritório",
  "Prédio",
  "Garagem",
  "Outro",
];

const TRANSACTION_TYPES = ["Venda", "Arrendamento"];

const CONDITION_OPTIONS = [
  "Novo",
  "Usado",
  "Renovado",
  "Para renovar",
  "Em construção",
];

const ENERGY_OPTIONS = [
  "A+",
  "A",
  "B",
  "B-",
  "C",
  "D",
  "E",
  "F",
  "Isento",
  "Em curso",
];

const EMPTY_FORM = {
  id: null,
  title: "",
  slug: "",
  status: "rascunho",
  consultant: "paulo",
  transactionType: "Venda",
  propertyType: "Apartamento",
  customPropertyType: "",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  parkingSpaces: "",
  energyCertificate: "Em curso",
  condition: "Usado",
  address: "",
  parish: "",
  city: "Lisboa",
  district: "Lisboa",
  postalCode: "",
  mapUrl: "",
  shortDescription: "",
  description: "",
  characteristicsText: "",
  seoTitle: "",
  seoDescription: "",
  photos: [],
  coverPhotoUrl: "",
};

const EDITOR_TABS = [
  { id: "descricao", label: "Descrição", icon: FileText },
  { id: "localizacao", label: "Localização", icon: MapPin },
  { id: "caracteristicas", label: "Características", icon: ListChecks },
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

function countWords(text = "") {
  const normalized = normalizeSpaces(text);

  if (!normalized) {
    return 0;
  }

  return normalized.split(" ").filter(Boolean).length;
}

function formatCurrency(value) {
  const number = Number(String(value || "").replace(/[^0-9.]/g, ""));

  if (!number) {
    return "Preço sob consulta";
  }

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("pt-PT");
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

function parseCharacteristics(text = "") {
  return text
    .split("\n")
    .map((item) => normalizeSpaces(item.replace(/^[-•]\s*/, "")))
    .filter(Boolean);
}

function characteristicsToText(value) {
  if (Array.isArray(value)) {
    return value.join("\n");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function buildPropertyTypeOptions(properties = []) {
  const defaultTypes = PROPERTY_TYPES.filter((type) => type !== "Outro");

  const customTypes = properties
    .map((property) => normalizeSpaces(property.property_type || ""))
    .filter(Boolean)
    .filter((type) => !PROPERTY_TYPES.includes(type));

  const uniqueCustomTypes = [...new Set(customTypes)];

  return [...defaultTypes, ...uniqueCustomTypes, "Outro"];
}

function getEffectivePropertyType(form) {
  if (form.propertyType === "Outro") {
    return normalizeSpaces(form.customPropertyType || "");
  }

  return normalizeSpaces(form.propertyType || "");
}

function calculatePropertySeo(form, pendingPhotos = []) {
  const title = form.seoTitle.trim() || form.title.trim();
  const description = normalizeSpaces(form.description);
  const shortDescription = normalizeSpaces(form.shortDescription);

  const locationText = normalizeSpaces(
    `${form.parish} ${form.city} ${form.district}`
  );

  const characteristics = parseCharacteristics(form.characteristicsText);
  const effectivePropertyType =
    getEffectivePropertyType(form) || form.propertyType;

  const keyword = normalizeSpaces(
    `${effectivePropertyType} ${form.transactionType} ${form.city}`
  );

  const titleLength = title.length;
  const descriptionLength = form.seoDescription.trim().length;

  const fullText = normalizeSpaces(
    `${title} ${shortDescription} ${description} ${locationText} ${characteristics.join(
      " "
    )}`
  );

  const wordCount = countWords(description);

  const savedPhotosCount = Array.isArray(form.photos)
    ? form.photos.length
    : 0;

  const pendingPhotosCount = Array.isArray(pendingPhotos)
    ? pendingPhotos.length
    : 0;

  const totalPhotosCount = savedPhotosCount + pendingPhotosCount;

  const hasCoverPhoto = Boolean(
    form.coverPhotoUrl ||
      form.photos?.[0]?.url ||
      pendingPhotos?.[0]?.previewUrl
  );

  const checks = [
    {
      group: "Conteúdo",
      label: "Título do imóvel preenchido",
      passed: form.title.trim().length >= 12,
      tip: "Use um título claro com tipo, localização e diferencial do imóvel.",
    },
    {
      group: "Conteúdo",
      label: "Descrição com pelo menos 120 palavras",
      passed: wordCount >= 120,
      tip: "Desenvolva a descrição com detalhes do imóvel, zona e benefícios.",
    },
    {
      group: "Conteúdo",
      label: "Resumo curto preenchido",
      passed: shortDescription.length >= 80 && shortDescription.length <= 180,
      tip: "Crie um resumo entre 80 e 180 caracteres para os cards públicos.",
    },
    {
      group: "Conteúdo",
      label: "Características principais listadas",
      passed: characteristics.length >= 4,
      tip: "Adicione pelo menos 4 características, uma por linha.",
    },
    {
      group: "Localização",
      label: "Cidade e freguesia preenchidas",
      passed: Boolean(form.city.trim()) && Boolean(form.parish.trim()),
      tip: "Indique cidade e freguesia para melhorar a pesquisa e a clareza do anúncio.",
    },
    {
      group: "Localização",
      label: "Morada ou zona preenchida",
      passed: Boolean(form.address.trim()) || Boolean(form.parish.trim()),
      tip: "Indique uma morada, rua ou zona de referência.",
    },
    {
      group: "SEO",
      label: "Slug amigável",
      passed: form.slug.trim().length >= 8 && !form.slug.includes(" "),
      tip: "Use uma URL curta, sem espaços e com palavras relevantes.",
    },
    {
      group: "SEO",
      label: "Título SEO com tamanho adequado",
      passed: titleLength >= 45 && titleLength <= 70,
      tip: "Ajuste o título SEO para ficar entre 45 e 70 caracteres.",
    },
    {
      group: "SEO",
      label: "Descrição SEO com tamanho adequado",
      passed: descriptionLength >= 120 && descriptionLength <= 160,
      tip: "A descrição SEO deve ter entre 120 e 160 caracteres.",
    },
    {
      group: "SEO",
      label: "Termos-chave aparecem no conteúdo",
      passed: [effectivePropertyType, form.transactionType, form.city].every(
        (term) => normalizeText(fullText).includes(normalizeText(term))
      ),
      tip: "Inclua tipo de imóvel, objetivo e localização no texto.",
    },
    {
      group: "Multimédia",
      label: "Pelo menos 4 fotografias",
      passed: totalPhotosCount >= 4,
      tip: "Adicione pelo menos 4 fotografias para o imóvel ficar mais completo.",
    },
    {
      group: "Multimédia",
      label: "Fotografia de capa definida",
      passed: hasCoverPhoto,
      tip: "A primeira fotografia adicionada será usada como capa automaticamente.",
    },
    {
      group: "Conversão",
      label: "Consultor responsável selecionado",
      passed: Boolean(form.consultant),
      tip: "Selecione Paulo ou Maria como consultor responsável pelo imóvel.",
    },
  ];

  const passed = checks.filter((check) => check.passed).length;
  const score = Math.round((passed / checks.length) * 100);

  let label = "A melhorar";

  if (score >= 82) {
    label = "Muito bom";
  } else if (score >= 62) {
    label = "Bom";
  } else if (score >= 42) {
    label = "Em progresso";
  }

  const groups = checks.reduce((acc, check) => {
    if (!acc[check.group]) {
      acc[check.group] = [];
    }

    acc[check.group].push(check);
    return acc;
  }, {});

  return {
    score,
    label,
    checks,
    groups,
    wordCount,
    titleLength,
    descriptionLength,
    keyword,
    totalPhotosCount,
    hasCoverPhoto,
  };
}

function mapDatabaseProperty(property, propertyTypeOptions = PROPERTY_TYPES) {
  const photos = Array.isArray(property.photos) ? property.photos : [];
  const databasePropertyType = property.property_type || "Apartamento";
  const propertyTypeExists = propertyTypeOptions.includes(databasePropertyType);

  return {
    id: property.id,
    title: property.title || "",
    slug: property.slug || "",
    status: property.status || "rascunho",
    consultant: property.consultant || "paulo",
    transactionType: property.transaction_type || "Venda",
    propertyType: propertyTypeExists ? databasePropertyType : "Outro",
    customPropertyType: propertyTypeExists ? "" : databasePropertyType,
    price: property.price ? String(property.price) : "",
    area: property.area ? String(property.area) : "",
    bedrooms: property.bedrooms ? String(property.bedrooms) : "",
    bathrooms: property.bathrooms ? String(property.bathrooms) : "",
    parkingSpaces: property.parking_spaces
      ? String(property.parking_spaces)
      : "",
    energyCertificate: property.energy_certificate || "Em curso",
    condition: property.condition || "Usado",
    address: property.address || "",
    parish: property.parish || "",
    city: property.city || "Lisboa",
    district: property.district || "Lisboa",
    postalCode: property.postal_code || "",
    mapUrl: property.map_url || "",
    shortDescription: property.short_description || "",
    description: property.description || "",
    characteristicsText: characteristicsToText(property.characteristics),
    seoTitle: property.seo_title || "",
    seoDescription: property.seo_description || "",
    seoScore: property.seo_score || 0,
    photos,
    coverPhotoUrl: property.cover_photo_url || photos[0]?.url || "",
    createdAt: property.created_at,
    updatedAt: property.updated_at,
  };
}

function BrandLogo({ compact = false }) {
  return (
    <div className="flex flex-col items-center gap-1 lg:items-start">
      <img
        src={LOGO}
        alt="CENTURY 21"
        className={
          compact
            ? "h-10 w-auto object-contain sm:h-12"
            : "h-11 w-auto object-contain sm:h-12"
        }
      />
      <span className="pl-[0.34em] text-[0.64rem] font-semibold uppercase tracking-[0.34em] text-[#beaf87] sm:text-[0.7rem]">
        Nações
      </span>
    </div>
  );
}

export default function GestaoImoveisCentury21() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedUserEmail, setLoggedUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] =
    useState(PROPERTY_TYPES);
  const [view, setView] = useState("list");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [activeTab, setActiveTab] = useState("descricao");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photosToRemove, setPhotosToRemove] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [consultantFilter, setConsultantFilter] = useState("todos");
  const [notice, setNotice] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);

  const seo = useMemo(
    () => calculatePropertySeo(form, photoFiles),
    [form, photoFiles]
  );

  useEffect(() => {
    let mounted = true;

    async function validateSession() {
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
      await loadProperties();
      setCheckingSession(false);
    }

    validateSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          window.location.href = "/admin/login";
          return;
        }

        setCurrentUser(session.user);
        setLoggedUserEmail(session.user.email || "");
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadProperties() {
    setLoadingProperties(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar imóveis:", error);
      setNotice({
        type: "error",
        text: "Não foi possível carregar os imóveis. Confirme a tabela properties e as políticas RLS no Supabase.",
      });
      setProperties([]);
    } else {
      const rows = data || [];
      const updatedPropertyTypes = buildPropertyTypeOptions(rows);

      setPropertyTypeOptions(updatedPropertyTypes);
      setProperties(
        rows.map((property) =>
          mapDatabaseProperty(property, updatedPropertyTypes)
        )
      );
    }

    setLoadingProperties(false);
  }

  const publishedCount = useMemo(
    () =>
      properties.filter((property) => property.status === "publicado").length,
    [properties]
  );

  const totals = useMemo(
    () => ({
      all: properties.length,
      published: properties.filter(
        (property) => property.status === "publicado"
      ).length,
      drafts: properties.filter((property) => property.status === "rascunho")
        .length,
    }),
    [properties]
  );

  const filteredProperties = useMemo(() => {
    const term = searchText.trim().toLowerCase();

    return properties.filter((property) => {
      const visiblePropertyType =
        property.propertyType === "Outro"
          ? property.customPropertyType || "Outro"
          : property.propertyType;

      const matchesTerm =
        !term ||
        property.title.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term) ||
        property.parish.toLowerCase().includes(term) ||
        visiblePropertyType.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "todos" || property.status === statusFilter;

      const matchesConsultant =
        consultantFilter === "todos" ||
        property.consultant === consultantFilter;

      return matchesTerm && matchesStatus && matchesConsultant;
    });
  }, [properties, searchText, statusFilter, consultantFilter]);

  function handleMenuNavigation(item) {
    setSidebarOpen(false);

    if (item.id !== "imoveis") {
      window.location.href = item.path;
    }
  }

  function startNewProperty() {
    setForm({ ...EMPTY_FORM });
    setPhotoFiles([]);
    setPhotosToRemove([]);
    setNotice(null);
    setActiveTab("descricao");
    setView("editor");
  }

  function editProperty(property) {
    setForm({ ...property });
    setPhotoFiles([]);
    setPhotosToRemove([]);
    setNotice(null);
    setActiveTab("descricao");
    setView("editor");
  }

  function handleTitleChange(event) {
    const title = event.target.value;

    setForm((current) => ({
      ...current,
      title,
      slug: current.id && current.slug ? current.slug : slugify(title),
      seoTitle: current.seoTitle || title,
    }));
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addPropertyTypeOption(type) {
    const normalizedType = normalizeSpaces(type);

    if (!normalizedType) {
      setNotice({
        type: "error",
        text: "Introduza o novo tipo de imóvel antes de adicionar.",
      });
      return false;
    }

    const existingType = propertyTypeOptions.find(
      (option) => normalizeText(option) === normalizeText(normalizedType)
    );

    const finalType = existingType || normalizedType;

    setPropertyTypeOptions((current) => {
      const currentWithoutOutro = current.filter((option) => option !== "Outro");
      const alreadyExists = currentWithoutOutro.some(
        (option) => normalizeText(option) === normalizeText(finalType)
      );

      if (alreadyExists) {
        return current;
      }

      return [...currentWithoutOutro, finalType, "Outro"];
    });

    setForm((current) => ({
      ...current,
      propertyType: finalType,
      customPropertyType: "",
    }));

    setNotice({
      type: "success",
      text: `Tipo de imóvel "${finalType}" adicionado. Ao guardar o imóvel, ele ficará disponível para reutilização.`,
    });

    return true;
  }

  function handlePhotoChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const availableSlots =
      MAX_PROPERTY_PHOTOS - form.photos.length - photoFiles.length;

    if (availableSlots <= 0) {
      setNotice({
        type: "error",
        text: `Só é possível adicionar no máximo ${MAX_PROPERTY_PHOTOS} fotografias por imóvel.`,
      });
      return;
    }

    const validFiles = [];

    for (const file of selectedFiles.slice(0, availableSlots)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setNotice({
          type: "error",
          text: "Utilize apenas imagens JPG, PNG ou WEBP.",
        });
        continue;
      }

      if (file.size > 8 * 1024 * 1024) {
        setNotice({
          type: "error",
          text: "Cada fotografia deve ter no máximo 8 MB.",
        });
        continue;
      }

      validFiles.push({
        id: `${Date.now()}-${file.name}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (selectedFiles.length > availableSlots) {
      setNotice({
        type: "error",
        text: `Foram adicionadas apenas ${availableSlots} fotografias. O limite total é de ${MAX_PROPERTY_PHOTOS}.`,
      });
    }

    setPhotoFiles((current) => [...current, ...validFiles]);
    event.target.value = "";
  }

  function removeExistingPhoto(photo) {
    setForm((current) => {
      const updatedPhotos = current.photos.filter(
        (item) => item.url !== photo.url
      );

      return {
        ...current,
        photos: updatedPhotos,
        coverPhotoUrl:
          current.coverPhotoUrl === photo.url
            ? updatedPhotos[0]?.url || ""
            : current.coverPhotoUrl,
      };
    });

    setPhotosToRemove((current) => [...current, photo.url]);
  }

  function removeNewPhoto(photoId) {
    setPhotoFiles((current) => {
      const photo = current.find((item) => item.id === photoId);

      if (photo?.previewUrl) {
        URL.revokeObjectURL(photo.previewUrl);
      }

      return current.filter((item) => item.id !== photoId);
    });
  }

  async function uploadNewPhotos(propertyId) {
    if (!photoFiles.length) {
      return [];
    }

    const uploadedPhotos = [];

    for (const item of photoFiles) {
      const path = `${propertyId}/${Date.now()}-${sanitizeFileName(
        item.file.name
      )}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, item.file, {
          cacheControl: "3600",
          contentType: item.file.type,
          upsert: false,
        });

      if (error) {
        console.error("Erro no upload da fotografia:", error);
        throw new Error(
          "Não foi possível enviar uma ou mais fotografias do imóvel."
        );
      }

      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

      uploadedPhotos.push({
        url: data.publicUrl,
        path,
        name: item.name,
      });
    }

    return uploadedPhotos;
  }

  async function removeStoredPhoto(publicUrl) {
    const path = getStoragePath(publicUrl);

    if (!path) {
      return;
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error("Erro ao remover fotografia:", error);
    }
  }

  function validateBeforeSave(status) {
    const title = form.title.trim();
    const totalPhotosCount = form.photos.length + photoFiles.length;
    const effectivePropertyType = getEffectivePropertyType(form);

    if (!title) {
      return "Introduza o título do imóvel antes de guardar.";
    }

    if (!effectivePropertyType) {
      return "Introduza o tipo de imóvel antes de guardar.";
    }

    if (totalPhotosCount > MAX_PROPERTY_PHOTOS) {
      return `Cada imóvel pode ter no máximo ${MAX_PROPERTY_PHOTOS} fotografias.`;
    }

    if (status === "publicado") {
      const willCountAsNewPublication = form.status !== "publicado";

      if (
        willCountAsNewPublication &&
        publishedCount >= MAX_PUBLISHED_PROPERTIES
      ) {
        return `Só é possível ter ${MAX_PUBLISHED_PROPERTIES} imóveis publicados simultaneamente. Coloque outro imóvel como rascunho antes de publicar este.`;
      }

      if (
        !form.slug.trim() ||
        !effectivePropertyType ||
        !form.transactionType ||
        !form.consultant
      ) {
        return "Para publicar, preencha tipo de imóvel, objetivo, consultor e slug.";
      }

      if (!form.shortDescription.trim() || !form.description.trim()) {
        return "Para publicar, preencha o resumo e a descrição do imóvel.";
      }

      if (!form.city.trim() || !form.parish.trim()) {
        return "Para publicar, preencha cidade e freguesia.";
      }

      if (totalPhotosCount < 4) {
        return "Para publicar, adicione pelo menos 4 fotografias do imóvel.";
      }
    }

    return "";
  }

  async function saveProperty(status) {
    setNotice(null);

    if (!currentUser) {
      window.location.href = "/admin/login";
      return;
    }

    const validationError = validateBeforeSave(status);

    if (validationError) {
      setNotice({
        type: "error",
        text: validationError,
      });
      return;
    }

    setSavingProperty(true);

    try {
      let propertyId = form.id;
      const effectivePropertyType = getEffectivePropertyType(form);

      const basePayload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        status,
        consultant: form.consultant,
        transaction_type: form.transactionType,
        property_type: effectivePropertyType,
        price: form.price ? Number(form.price) : null,
        area: form.area ? Number(form.area) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        parking_spaces: form.parkingSpaces
          ? Number(form.parkingSpaces)
          : null,
        energy_certificate: form.energyCertificate,
        condition: form.condition,
        address: form.address.trim(),
        parish: form.parish.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        postal_code: form.postalCode.trim(),
        map_url: form.mapUrl.trim(),
        short_description: form.shortDescription.trim(),
        description: form.description.trim(),
        characteristics: parseCharacteristics(form.characteristicsText),
        credit_simulation_url: FIXED_CREDIT_SIMULATION_URL,
        seo_title: form.seoTitle.trim(),
        seo_description: form.seoDescription.trim(),
        seo_score: seo.score,
      };

      if (!propertyId) {
        const { data, error } = await supabase
          .from("properties")
          .insert({
            ...basePayload,
            author_id: currentUser.id,
            photos: [],
            cover_photo_url: null,
          })
          .select("id")
          .single();

        if (error) {
          console.error("Erro ao criar imóvel:", error);

          setNotice({
            type: "error",
            text:
              error.code === "23505"
                ? "Já existe um imóvel com esta slug."
                : "Não foi possível criar o imóvel.",
          });

          setSavingProperty(false);
          return;
        }

        propertyId = data.id;
      }

      const uploadedPhotos = await uploadNewPhotos(propertyId);

      const updatedPhotos = [...form.photos, ...uploadedPhotos].slice(
        0,
        MAX_PROPERTY_PHOTOS
      );

      const coverPhotoUrl = form.coverPhotoUrl || updatedPhotos[0]?.url || "";

      const { error: updateError } = await supabase
        .from("properties")
        .update({
          ...basePayload,
          photos: updatedPhotos,
          cover_photo_url: coverPhotoUrl,
        })
        .eq("id", propertyId);

      if (updateError) {
        console.error("Erro ao guardar imóvel:", updateError);

        for (const photo of uploadedPhotos) {
          await removeStoredPhoto(photo.url);
        }

        setNotice({
          type: "error",
          text:
            updateError.code === "23505"
              ? "Já existe um imóvel com esta slug."
              : "Não foi possível guardar o imóvel no Supabase.",
        });

        setSavingProperty(false);
        return;
      }

      for (const photoUrl of photosToRemove) {
        await removeStoredPhoto(photoUrl);
      }

      photoFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));

      await loadProperties();

      setForm({ ...EMPTY_FORM });
      setPhotoFiles([]);
      setPhotosToRemove([]);
      setView("list");

      setNotice({
        type: "success",
        text:
          status === "publicado"
            ? "Imóvel publicado com sucesso."
            : "Rascunho guardado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao guardar imóvel:", error);

      setNotice({
        type: "error",
        text: error.message || "Não foi possível guardar o imóvel.",
      });
    } finally {
      setSavingProperty(false);
    }
  }

  async function deleteProperty(property) {
    if (!currentUser) {
      window.location.href = "/admin/login";
      return;
    }

    const confirmed = window.confirm(
      "Tem a certeza de que pretende eliminar este imóvel?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingPropertyId(property.id);
    setNotice(null);

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", property.id);

    if (error) {
      console.error("Erro ao eliminar imóvel:", error);

      setNotice({
        type: "error",
        text: "Não foi possível eliminar o imóvel.",
      });

      setDeletingPropertyId(null);
      return;
    }

    for (const photo of property.photos || []) {
      await removeStoredPhoto(photo.url);
    }

    await loadProperties();

    setNotice({
      type: "success",
      text: "Imóvel eliminado com sucesso.",
    });

    setDeletingPropertyId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (checkingSession) {
    return <main className="fixed inset-0 min-h-[100dvh] bg-black" />;
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
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between">
            <BrandLogo compact />

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
              const active = item.id === "imoveis";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenuNavigation(item)}
                  className={`flex w-full items-center rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                    active
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
                  Gestão de Imóveis
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            {view === "list" ? (
              <PropertiesList
                properties={filteredProperties}
                totals={totals}
                publishedCount={publishedCount}
                notice={notice}
                loadingProperties={loadingProperties}
                searchText={searchText}
                setSearchText={setSearchText}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                consultantFilter={consultantFilter}
                setConsultantFilter={setConsultantFilter}
                onNew={startNewProperty}
                onEdit={editProperty}
                onDelete={deleteProperty}
                deletingPropertyId={deletingPropertyId}
              />
            ) : (
              <PropertyEditor
                form={form}
                propertyTypeOptions={propertyTypeOptions}
                onAddPropertyType={addPropertyTypeOption}
                updateField={updateField}
                seo={seo}
                notice={notice}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                photoFiles={photoFiles}
                savingProperty={savingProperty}
                publishedCount={publishedCount}
                onTitleChange={handleTitleChange}
                onPhotoChange={handlePhotoChange}
                onRemoveExistingPhoto={removeExistingPhoto}
                onRemoveNewPhoto={removeNewPhoto}
                onBack={() => setView("list")}
                onSaveDraft={() => saveProperty("rascunho")}
                onPublish={() => saveProperty("publicado")}
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

function PropertiesList({
  properties,
  totals,
  publishedCount,
  notice,
  loadingProperties,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  consultantFilter,
  setConsultantFilter,
  onNew,
  onEdit,
  onDelete,
  deletingPropertyId,
}) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-9 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
            Catálogo público de imóveis
          </p>

          <h2 className="font-serif text-3xl leading-tight text-[#beaf87] sm:text-4xl">
            Gestão de Imóveis
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            Crie imóveis com fotografias, consultor responsável, análise SEO e
            controlo de publicação. Apenas {MAX_PUBLISHED_PROPERTIES} imóveis
            podem estar publicados ao mesmo tempo.
          </p>
        </div>

        <button
          type="button"
          onClick={onNew}
          className="flex h-14 shrink-0 items-center justify-center rounded-2xl bg-[#beaf87] px-7 text-sm font-extrabold uppercase tracking-[0.15em] text-black transition hover:brightness-110"
        >
          <Plus className="mr-3 h-5 w-5" />
          Novo imóvel
        </button>
      </div>

      <Notice notice={notice} />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total" value={totals.all} icon={Building2} />
        <SummaryCard
          label="Publicados"
          value={`${publishedCount}/${MAX_PUBLISHED_PROPERTIES}`}
          icon={Home}
        />
        <SummaryCard label="Rascunhos" value={totals.drafts} icon={FileText} />
        <SummaryCard
          label="Limite de fotos"
          value={MAX_PROPERTY_PHOTOS}
          icon={Camera}
        />
      </div>

      <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_190px_210px]">
          <label className="flex h-14 items-center rounded-2xl border border-[#beaf87]/14 bg-black px-4 focus-within:border-[#beaf87]/50">
            <Search className="mr-3 h-5 w-5 text-[#beaf87]" />

            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Pesquisar por título, localização ou tipo"
              className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34"
            />
          </label>

          <SelectFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={["todos", "publicado", "rascunho"]}
          />

          <SelectFilter
            value={consultantFilter}
            onChange={setConsultantFilter}
            options={[
              "todos",
              ...CONSULTANTS.map((consultant) => consultant.id),
            ]}
            labels={{
              todos: "Todos os consultores",
              paulo: "Paulo Matos",
              maria: "Maria Carreiro",
            }}
          />
        </div>

        <div className="hidden grid-cols-[minmax(280px,1fr)_150px_140px_140px_130px] gap-4 border-b border-[#beaf87]/12 px-4 pb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/38 lg:grid">
          <span>Imóvel</span>
          <span>Consultor</span>
          <span>Estado</span>
          <span>Atualizado</span>
          <span className="text-right">Ações</span>
        </div>

        {loadingProperties ? (
          <div className="flex min-h-[260px] items-center justify-center text-sm text-white/54">
            <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#beaf87]" />
            A carregar imóveis...
          </div>
        ) : properties.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <Building2 className="mb-4 h-10 w-10 text-[#beaf87]/55" />
            <p className="text-sm text-white/54">Nenhum imóvel encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#beaf87]/10">
            {properties.map((property) => (
              <PropertyRow
                key={property.id}
                property={property}
                onEdit={onEdit}
                onDelete={onDelete}
                deleting={deletingPropertyId === property.id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SelectFilter({ value, onChange, options, labels = {} }) {
  return (
    <label className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full appearance-none rounded-2xl border border-[#beaf87]/14 bg-black py-3 pl-4 pr-11 text-sm capitalize text-white outline-none transition focus:border-[#beaf87]/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] || option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
    </label>
  );
}

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-[1.5rem] border border-[#beaf87]/14 bg-[#090909]/85 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
          {label}
        </p>

        <p className="mt-3 font-serif text-4xl text-[#beaf87]">{value}</p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#beaf87]/18 bg-[#beaf87]/8">
        <Icon className="h-5 w-5 text-[#beaf87]" />
      </div>
    </div>
  );
}

function PropertyRow({ property, onEdit, onDelete, deleting }) {
  const consultant = CONSULTANTS.find(
    (item) => item.id === property.consultant
  );

  const cover = property.coverPhotoUrl || property.photos[0]?.url;
  const visiblePropertyType =
    property.propertyType === "Outro"
      ? property.customPropertyType || "Outro"
      : property.propertyType;

  return (
    <article className="grid gap-4 px-2 py-5 sm:px-4 lg:grid-cols-[minmax(280px,1fr)_150px_140px_140px_130px] lg:items-center">
      <div className="flex items-center gap-4">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#beaf87]/14 bg-black">
          {cover ? (
            <img
              src={cover}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2 className="h-6 w-6 text-[#beaf87]/60" />
            </div>
          )}
        </div>

        <div>
          <p className="font-medium leading-6 text-white">{property.title}</p>
          <p className="mt-1 text-sm text-[#beaf87]">
            {formatCurrency(property.price)}
          </p>
          <p className="mt-1 text-xs text-white/42">
            {visiblePropertyType} · /{property.slug}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-white/58">
        <UserRound className="h-4 w-4 text-[#beaf87] lg:hidden" />
        {consultant?.name || "—"}
      </div>

      <StatusBadge status={property.status} />

      <div className="flex items-center gap-2 text-sm text-white/54">
        <CalendarDays className="h-4 w-4 text-[#beaf87] lg:hidden" />
        {formatDate(property.updatedAt)}
      </div>

      <div className="flex gap-2 lg:justify-end">
        <button
          type="button"
          onClick={() => onEdit(property)}
          disabled={deleting}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#beaf87]/18 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Editar imóvel"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(property)}
          disabled={deleting}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/18 text-red-300 transition hover:bg-red-400/16 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Eliminar imóvel"
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

function PropertyEditor({
  form,
  propertyTypeOptions,
  onAddPropertyType,
  updateField,
  seo,
  notice,
  activeTab,
  setActiveTab,
  photoFiles,
  savingProperty,
  publishedCount,
  onTitleChange,
  onPhotoChange,
  onRemoveExistingPhoto,
  onRemoveNewPhoto,
  onBack,
  onSaveDraft,
  onPublish,
}) {
  const allPhotosCount = form.photos.length + photoFiles.length;
  const [showNewPropertyType, setShowNewPropertyType] = useState(false);
  const [newPropertyType, setNewPropertyType] = useState("");

  function handleAddNewPropertyType() {
    const added = onAddPropertyType(newPropertyType);

    if (added) {
      setNewPropertyType("");
      setShowNewPropertyType(false);
    }
  }

  function handleCancelNewPropertyType() {
    setNewPropertyType("");
    setShowNewPropertyType(false);
  }

  const canPublishMore =
    form.status === "publicado" || publishedCount < MAX_PUBLISHED_PROPERTIES;

  return (
    <section className="mx-auto max-w-[1480px]">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={savingProperty}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/20 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black disabled:opacity-40"
            aria-label="Voltar à lista de imóveis"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#beaf87]">
              {form.id ? "Editar imóvel" : "Novo imóvel"}
            </p>

            <h2 className="mt-2 font-serif text-3xl text-white">
              {form.id ? "Editar imóvel" : "Criar novo imóvel"}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingProperty}
            className="flex h-14 items-center justify-center rounded-2xl border border-[#beaf87]/24 px-6 text-sm font-bold uppercase tracking-[0.13em] text-[#beaf87] transition hover:bg-white/[0.04] disabled:opacity-40"
          >
            <Save className="mr-2 h-4 w-4" />
            {savingProperty ? "A guardar..." : "Guardar rascunho"}
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={savingProperty || !canPublishMore}
            className="flex h-14 items-center justify-center rounded-2xl bg-[#beaf87] px-6 text-sm font-extrabold uppercase tracking-[0.13em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {savingProperty ? "A guardar..." : "Publicar imóvel"}
          </button>
        </div>
      </div>

      <Notice notice={notice} />

      {!canPublishMore && (
        <div className="mb-6 rounded-2xl border border-amber-400/22 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100">
          O limite de {MAX_PUBLISHED_PROPERTIES} imóveis publicados já foi
          atingido. Coloque outro imóvel como rascunho antes de publicar este.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(580px,1fr)_390px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <SectionTitle title="Informações principais" />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <FormField label="Título do imóvel" className="md:col-span-2">
                <input
                  type="text"
                  value={form.title}
                  onChange={onTitleChange}
                  placeholder="Ex.: Apartamento T2 renovado em Lisboa"
                  className="field-input"
                />
              </FormField>

              <FormField label="Slug / URL amigável">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", slugify(event.target.value))
                  }
                  placeholder="apartamento-t2-renovado-lisboa"
                  className="field-input"
                />
              </FormField>

              <FormField label="Consultor responsável">
                <div className="relative">
                  <select
                    value={form.consultant}
                    onChange={(event) =>
                      updateField("consultant", event.target.value)
                    }
                    className="field-input appearance-none pr-12"
                  >
                    {CONSULTANTS.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
                </div>
              </FormField>

              <FormField label="Tipo de negócio">
                <div className="relative">
                  <select
                    value={form.transactionType}
                    onChange={(event) =>
                      updateField("transactionType", event.target.value)
                    }
                    className="field-input appearance-none pr-12"
                  >
                    {TRANSACTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
                </div>
              </FormField>

              <FormField label="Tipo de imóvel">
                <div className="space-y-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_54px] gap-3">
                    <div className="relative">
                      <select
                        value={form.propertyType}
                        onChange={(event) => {
                          const selectedType = event.target.value;

                          updateField("propertyType", selectedType);

                          if (selectedType !== "Outro") {
                            updateField("customPropertyType", "");
                          }
                        }}
                        className="field-input appearance-none pr-12"
                      >
                        {propertyTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowNewPropertyType(true)}
                      className="flex h-[54px] items-center justify-center rounded-2xl border border-[#beaf87]/24 bg-[#beaf87]/10 text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black"
                      aria-label="Adicionar novo tipo de imóvel"
                      title="Adicionar novo tipo de imóvel"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  {showNewPropertyType && (
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                      <input
                        type="text"
                        value={newPropertyType}
                        onChange={(event) => setNewPropertyType(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddNewPropertyType();
                          }
                        }}
                        placeholder="Novo tipo. Ex.: Quinta, Duplex, Armazém"
                        className="field-input"
                      />

                      <button
                        type="button"
                        onClick={handleAddNewPropertyType}
                        className="min-h-[54px] rounded-2xl bg-[#beaf87] px-5 text-xs font-extrabold uppercase tracking-[0.14em] text-black transition hover:brightness-110"
                      >
                        Adicionar
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelNewPropertyType}
                        className="min-h-[54px] rounded-2xl border border-[#beaf87]/24 px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#beaf87] transition hover:bg-white/[0.04]"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {form.propertyType === "Outro" && !showNewPropertyType && (
                    <input
                      type="text"
                      value={form.customPropertyType}
                      onChange={(event) =>
                        updateField("customPropertyType", event.target.value)
                      }
                      placeholder="Escreva o tipo de imóvel. Ex.: Quinta, Duplex, Armazém"
                      className="field-input"
                    />
                  )}
                </div>
              </FormField>

              <FormField label="Preço (€)">
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  className="field-input"
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <SectionTitle
              title={`Fotografias do imóvel (${allPhotosCount}/${MAX_PROPERTY_PHOTOS})`}
            />

            <label className="mt-6 flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[#beaf87]/30 bg-black px-5 py-8 text-center transition hover:border-[#beaf87]/60">
              <ImagePlus className="mb-3 h-9 w-9 text-[#beaf87]" />

              <p className="text-sm font-medium text-white/72">
                Adicionar fotografias
              </p>

              <p className="mt-2 text-xs leading-6 text-white/40">
                JPG, PNG ou WEBP · Máximo de 8 MB por foto · Limite de{" "}
                {MAX_PROPERTY_PHOTOS} fotografias
              </p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={savingProperty || allPhotosCount >= MAX_PROPERTY_PHOTOS}
                onChange={onPhotoChange}
              />
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {form.photos.map((photo, index) => (
                <PhotoPreview
                  key={photo.url}
                  src={photo.url}
                  label={
                    form.coverPhotoUrl === photo.url ||
                    (!form.coverPhotoUrl && index === 0)
                      ? "Capa"
                      : `Foto ${index + 1}`
                  }
                  onRemove={() => onRemoveExistingPhoto(photo)}
                  onSetCover={() => updateField("coverPhotoUrl", photo.url)}
                />
              ))}

              {photoFiles.map((photo, index) => (
                <PhotoPreview
                  key={photo.id}
                  src={photo.previewUrl}
                  label={
                    !form.coverPhotoUrl && form.photos.length === 0 && index === 0
                      ? "Capa"
                      : `Nova ${index + 1}`
                  }
                  onRemove={() => onRemoveNewPhoto(photo.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#beaf87]/16 bg-[#090909]/90 p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap gap-2">
              {EDITOR_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center rounded-2xl border px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition ${
                      active
                        ? "border-[#beaf87] bg-[#beaf87] text-black"
                        : "border-[#beaf87]/16 text-[#beaf87] hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "descricao" && (
              <DescriptionTab form={form} updateField={updateField} seo={seo} />
            )}

            {activeTab === "localizacao" && (
              <LocationTab form={form} updateField={updateField} />
            )}

            {activeTab === "caracteristicas" && (
              <CharacteristicsTab form={form} updateField={updateField} />
            )}
          </div>
        </div>

        <SeoPanel seo={seo} />
      </div>

      <style>{`
        .field-input {
          width: 100%;
          min-height: 54px;
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

function DescriptionTab({ form, updateField, seo }) {
  return (
    <div className="grid gap-5">
      <SectionTitle title="Descrição" />

      <FormField label="Resumo para o card público">
        <textarea
          value={form.shortDescription}
          onChange={(event) =>
            updateField("shortDescription", event.target.value)
          }
          placeholder="Resumo curto do imóvel para aparecer na listagem pública."
          rows={3}
          className="field-input min-h-[100px] resize-none py-4"
        />
      </FormField>

      <FormField label="Descrição completa">
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Descreva o imóvel, a zona, os diferenciais e os benefícios para o comprador."
          rows={10}
          className="field-input min-h-[260px] resize-none py-4 leading-7"
        />

        <p className="mt-2 text-xs text-white/38">
          {seo.wordCount} palavras · Recomendado: pelo menos 120 palavras.
        </p>
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Título SEO">
          <input
            value={form.seoTitle}
            onChange={(event) => updateField("seoTitle", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Descrição SEO">
          <input
            value={form.seoDescription}
            onChange={(event) =>
              updateField("seoDescription", event.target.value)
            }
            className="field-input"
          />

          <p className="mt-2 text-xs text-white/38">
            {seo.descriptionLength} caracteres · Ideal: 120 a 160.
          </p>
        </FormField>
      </div>
    </div>
  );
}

function LocationTab({ form, updateField }) {
  return (
    <div className="grid gap-5">
      <SectionTitle title="Localização" />

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Morada / Zona">
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Código postal">
          <input
            value={form.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Freguesia">
          <input
            value={form.parish}
            onChange={(event) => updateField("parish", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Cidade">
          <input
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Distrito">
          <input
            value={form.district}
            onChange={(event) => updateField("district", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Link do Google Maps">
          <input
            value={form.mapUrl}
            onChange={(event) => updateField("mapUrl", event.target.value)}
            className="field-input"
          />
        </FormField>
      </div>
    </div>
  );
}

function CharacteristicsTab({ form, updateField }) {
  return (
    <div className="grid gap-5">
      <SectionTitle title="Características" />

      <div className="grid gap-5 md:grid-cols-3">
        <FormField label="Área útil (m²)">
          <input
            type="number"
            value={form.area}
            onChange={(event) => updateField("area", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Quartos">
          <input
            type="number"
            value={form.bedrooms}
            onChange={(event) => updateField("bedrooms", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Casas de banho">
          <input
            type="number"
            value={form.bathrooms}
            onChange={(event) => updateField("bathrooms", event.target.value)}
            className="field-input"
          />
        </FormField>

        <FormField label="Lugares de estacionamento">
          <input
            type="number"
            value={form.parkingSpaces}
            onChange={(event) =>
              updateField("parkingSpaces", event.target.value)
            }
            className="field-input"
          />
        </FormField>

        <FormField label="Certificado energético">
          <div className="relative">
            <select
              value={form.energyCertificate}
              onChange={(event) =>
                updateField("energyCertificate", event.target.value)
              }
              className="field-input appearance-none pr-12"
            >
              {ENERGY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
          </div>
        </FormField>

        <FormField label="Estado do imóvel">
          <div className="relative">
            <select
              value={form.condition}
              onChange={(event) => updateField("condition", event.target.value)}
              className="field-input appearance-none pr-12"
            >
              {CONDITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#beaf87]" />
          </div>
        </FormField>
      </div>

      <FormField label="Lista de características adicionais">
        <textarea
          value={form.characteristicsText}
          onChange={(event) =>
            updateField("characteristicsText", event.target.value)
          }
          placeholder={`Uma característica por linha. Ex.:
Varanda
Cozinha equipada
Elevador
Arrecadação`}
          rows={8}
          className="field-input min-h-[210px] resize-none py-4 leading-7"
        />
      </FormField>
    </div>
  );
}

function PhotoPreview({ src, label, onRemove, onSetCover }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#beaf87]/14 bg-black">
      <img src={src} alt={label} className="h-44 w-full object-cover" />

      <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
        {label}
      </div>

      <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
        {onSetCover && (
          <button
            type="button"
            onClick={onSetCover}
            className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#beaf87] px-3 text-xs font-extrabold uppercase text-black"
          >
            Capa
          </button>
        )}

        <button
          type="button"
          onClick={onRemove}
          className="flex h-10 items-center justify-center rounded-xl bg-red-500/90 px-3 text-xs font-bold uppercase text-white"
        >
          Remover
        </button>
      </div>
    </div>
  );
}

function SeoPanel({ seo }) {
  return (
    <aside className="xl:sticky xl:top-6 xl:h-fit">
      <div className="rounded-[2rem] border border-[#beaf87]/18 bg-[#090909]/94 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#beaf87]">
              Análise SEO
            </p>

            <h3 className="mt-3 text-xl font-semibold text-white">
              Qualidade do imóvel
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
            <p className="text-sm font-semibold text-white">{seo.label}</p>
            <p className="mt-2 text-xs leading-6 text-white/46">
              Resultado baseado em conteúdo, SEO, localização, imagens e
              conversão.
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-[#beaf87] transition-all duration-500"
            style={{ width: `${seo.score}%` }}
          />
        </div>

        <div className="mt-7 rounded-2xl border border-[#beaf87]/12 bg-[#beaf87]/[0.04] p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#beaf87]">
            <TrendingUp className="h-4 w-4" />
            Palavra-chave sugerida
          </p>

          <p className="mt-3 text-sm text-white/62">{seo.keyword}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricCard
            label="Fotos"
            value={`${seo.totalPhotosCount}/${MAX_PROPERTY_PHOTOS}`}
          />
          <MetricCard label="Palavras" value={seo.wordCount} />
          <MetricCard label="Título SEO" value={seo.titleLength} />
          <MetricCard label="Descrição" value={seo.descriptionLength} />
        </div>

        <div className="mt-7 space-y-4">
          {Object.entries(seo.groups).map(([group, checks]) => (
            <SeoCriteriaGroup key={group} title={group} checks={checks} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#beaf87]/12 bg-black p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/42">
        {label}
      </p>

      <p className="mt-2 font-serif text-2xl text-[#beaf87]">{value}</p>
    </div>
  );
}

function SeoCriteriaGroup({ title, checks }) {
  const errors = checks.filter((check) => !check.passed).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#beaf87]/12 bg-black">
      <div className="flex items-center justify-between border-b border-[#beaf87]/10 px-4 py-4">
        <h4 className="text-sm font-bold text-white">{title}</h4>

        <span
          className={`text-xs font-semibold ${
            errors === 0 ? "text-emerald-300" : "text-[#beaf87]"
          }`}
        >
          {errors === 0
            ? "Tudo certo!"
            : `${errors} ${errors === 1 ? "erro" : "erros"}`}
        </span>
      </div>

      <div className="space-y-1 p-2">
        {checks.map((check) => (
          <SeoCriterion key={check.label} check={check} />
        ))}
      </div>
    </section>
  );
}

function SeoCriterion({ check }) {
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
        <p className="text-sm font-medium text-white/78">{check.label}</p>

        {!check.passed && (
          <p className="mt-1.5 text-xs leading-5 text-white/48">
            {check.tip}
          </p>
        )}
      </div>
    </div>
  );
}

function FormField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-white/72">
        {label}
      </span>

      {children}
    </label>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-1 rounded-full bg-[#beaf87]" />

      <h3 className="text-lg font-semibold text-white">{title}</h3>
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
