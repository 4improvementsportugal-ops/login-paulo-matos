import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ruler,
  Share2,
  X,
} from "lucide-react";

const ENV = import.meta.env || {};
const LOGO = "/assets/logosite.png";
const DEFAULT_SUPABASE_URL = "https://keulsgyzfruvscapcuxk.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_Rg-J0l6M1cGxvNdIupJwrg_Y7GWhrFK";
const DEFAULT_CREDIT_LINK = "/credito-habitacao";

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

const SUPABASE_URL = normalizeSupabaseUrl(
  ENV.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
);

const SUPABASE_PUBLISHABLE_KEY =
  ENV.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const CONSULTANTS = {
  paulo: {
    name: "Paulo Matos",
    role: "Consultor Imobiliário",
    phone: "+351 919 783 014",
    phoneHref: "tel:+351919783014",
    whatsapp: "https://wa.me/351919783014",
    email: "pjmatos@century21.pt",
    emailHref: "mailto:pjmatos@century21.pt",
  },
  maria: {
    name: "Maria Carreiro",
    role: "Consultora Imobiliária",
    phone: "+351 937 219 215",
    phoneHref: "tel:+351937219215",
    whatsapp: "https://wa.me/351937219215",
    email: "mjcarreiro@century21.pt",
    emailHref: "mailto:mjcarreiro@century21.pt",
  },
};

function getSlugFromPath() {
  const match = window.location.pathname.match(/\/imoveis\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : "";
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

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getPropertyPhotos(property) {
  if (!property) return [];

  const photos = Array.isArray(property.photos) ? property.photos : [];
  const urls = photos.map((photo) => photo?.url).filter(Boolean);

  if (property.cover_photo_url && !urls.includes(property.cover_photo_url)) {
    return [property.cover_photo_url, ...urls];
  }

  return urls;
}

function getCoverPhoto(property) {
  if (property?.cover_photo_url) return property.cover_photo_url;

  const photos = getPropertyPhotos(property);
  return photos[0] || "";
}

function normalizeCharacteristics(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
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

export default function ImovelIndividualCentury21() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      setErrorMessage("");

      const slug = getSlugFromPath();

      if (!slug) {
        setErrorMessage("Imóvel não encontrado.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .eq("status", "publicado")
        .single();

      if (error || !data) {
        console.error("Erro ao carregar imóvel:", error);
        setProperty(null);
        setErrorMessage(
          "Este imóvel não está disponível ou deixou de estar publicado."
        );
      } else {
        setProperty(data);
        setCurrentPhotoIndex(0);
      }

      setLoading(false);
    }

    loadProperty();
  }, []);

  const photos = useMemo(() => getPropertyPhotos(property), [property]);
  const cover = photos[currentPhotoIndex] || getCoverPhoto(property);
  const consultant = CONSULTANTS[property?.consultant] || CONSULTANTS.paulo;

  const characteristics = useMemo(
    () => normalizeCharacteristics(property?.characteristics),
    [property]
  );

  function goToPreviousPhoto() {
    if (!photos.length) return;

    setCurrentPhotoIndex((current) =>
      current === 0 ? photos.length - 1 : current - 1
    );
  }

  function goToNextPhoto() {
    if (!photos.length) return;

    setCurrentPhotoIndex((current) =>
      current === photos.length - 1 ? 0 : current + 1
    );
  }

  async function handleShare() {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title || "Imóvel CENTURY 21 Nações",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("Link do imóvel copiado.");
    } catch {
      alert("Não foi possível partilhar este imóvel neste momento.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <PublicNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {loading ? (
        <section className="flex min-h-[65vh] items-center justify-center px-6 text-sm text-[#171717]/54">
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#beaf87]" />
          A carregar imóvel...
        </section>
      ) : errorMessage || !property ? (
        <NotFoundState errorMessage={errorMessage} />
      ) : (
        <>
          <section className="border-b border-[#beaf87]/20 bg-[#fbfaf7] px-6 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-[430px] sm:max-w-7xl">
              <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#171717]/45">
                <a href="/" className="transition hover:text-[#beaf87]">
                  Início
                </a>
                <span>/</span>
                <a href="/#imoveis" className="transition hover:text-[#beaf87]">
                  Imóveis
                </a>
                <span>/</span>
                <span className="text-[#beaf87]">
                  {property.property_type || "Imóvel"}
                </span>
              </nav>
            </div>
          </section>

          <section className="px-6 py-8 sm:px-8 sm:py-12 lg:px-10">
            <div className="mx-auto grid w-full max-w-[430px] gap-8 sm:max-w-7xl lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-12">
              <div className="min-w-0">
                <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
                  <div className="min-w-0">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#beaf87] sm:tracking-[0.34em]">
                      {property.transaction_type || "Venda"} ·{" "}
                      {property.property_type || "Imóvel"}
                    </p>

                    <h1 className="max-w-4xl break-words font-serif text-3xl leading-tight text-[#2a2418] sm:text-5xl lg:text-6xl">
                      {property.title}
                    </h1>

                    <p className="mt-5 flex items-start gap-2 text-sm leading-7 text-[#171717]/58 sm:items-center sm:text-base">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#beaf87] sm:mt-0" />
                      <span>
                        {[property.parish, property.city, property.district]
                          .filter(Boolean)
                          .join(", ") || "Lisboa"}
                      </span>
                    </p>
                  </div>

                  <div className="w-full rounded-[1.5rem] border border-[#beaf87]/25 bg-[#fbfaf7] px-5 py-5 text-left sm:w-auto sm:px-6 xl:shrink-0 xl:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#beaf87]">
                      Valor
                    </p>
                    <p className="mt-2 font-serif text-3xl text-[#2a2418] sm:text-4xl">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                </div>

                <Gallery
                  photos={photos}
                  cover={cover}
                  title={property.title}
                  currentPhotoIndex={currentPhotoIndex}
                  setCurrentPhotoIndex={setCurrentPhotoIndex}
                  onPrevious={goToPreviousPhoto}
                  onNext={goToNextPhoto}
                />

                <PropertyMetrics property={property} />

                <ContentSection title="Descrição">
                  <p className="whitespace-pre-line text-base leading-8 text-[#171717]/72 sm:text-lg sm:leading-9">
                    {property.description ||
                      property.short_description ||
                      "Descrição indisponível."}
                  </p>
                </ContentSection>

                <ContentSection title="Localização">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoLine
                      label="Morada / zona"
                      value={property.address || "—"}
                    />
                    <InfoLine
                      label="Freguesia"
                      value={property.parish || "—"}
                    />
                    <InfoLine label="Cidade" value={property.city || "—"} />
                    <InfoLine
                      label="Código postal"
                      value={property.postal_code || "—"}
                    />
                  </div>

                  {property.map_url && (
                    <a
                      href={property.map_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#beaf87]/45 bg-white px-7 py-4 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-[#2a2418] transition hover:bg-[#beaf87] hover:text-black sm:w-auto"
                    >
                      Ver no mapa
                      <ExternalLink className="ml-3 h-4 w-4" />
                    </a>
                  )}
                </ContentSection>

                <ContentSection title="Características">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoLine
                      label="Tipo de imóvel"
                      value={property.property_type || "—"}
                    />
                    <InfoLine label="Estado" value={property.condition || "—"} />
                    <InfoLine
                      label="Certificado energético"
                      value={property.energy_certificate || "—"}
                    />
                    <InfoLine
                      label="Quartos"
                      value={formatNumber(property.bedrooms)}
                    />
                    <InfoLine
                      label="Casas de banho"
                      value={formatNumber(property.bathrooms)}
                    />
                    <InfoLine
                      label="Estacionamento"
                      value={formatNumber(property.parking_spaces)}
                    />
                  </div>

                  {characteristics.length > 0 && (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {characteristics.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-4 text-sm leading-6 text-[#171717]/70"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </ContentSection>
              </div>

              <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
                <div className="space-y-5">
                  <ConsultantCard consultant={consultant} />

                  <div className="rounded-[1.6rem] border border-[#beaf87]/25 bg-[#fbfaf7] p-5 shadow-[0_22px_70px_rgba(40,32,20,0.08)] sm:rounded-[2rem] sm:p-7">
                    <h2 className="font-serif text-3xl leading-tight text-[#2a2418]">
                      Simular crédito
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[#171717]/66">
                      Faça uma simulação de financiamento para perceber melhor
                      as possibilidades de compra deste imóvel.
                    </p>

                    <a
                      href={property.credit_simulation_url || DEFAULT_CREDIT_LINK}
                      target={property.credit_simulation_url ? "_blank" : "_self"}
                      rel={property.credit_simulation_url ? "noreferrer" : undefined}
                      className="mt-7 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#beaf87] px-5 py-4 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-black transition hover:brightness-105"
                    >
                      Simular crédito
                      <ExternalLink className="ml-3 h-4 w-4" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#beaf87]/35 bg-white px-5 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-[#2a2418] transition hover:bg-[#beaf87] hover:text-black"
                  >
                    Partilhar imóvel
                    <Share2 className="ml-3 h-4 w-4" />
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </>
      )}

      <PublicFooter />
    </main>
  );
}

function PublicNavbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Apoio Jurídico", href: "/apoio-juridico" },
  { label: "Crédito Habitação", href: "/credito-habitacao" },
  { label: "Contacte-nos", href: "/contacte-nos" },
];

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
              className="text-sm font-semibold uppercase tracking-[0.16em] text-[#171717]/70 transition hover:text-[#beaf87]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/35 text-[#beaf87] lg:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#beaf87]/20 bg-white px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-[#beaf87]/25 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#171717]/78"
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

function Gallery({
  photos,
  cover,
  title,
  currentPhotoIndex,
  setCurrentPhotoIndex,
  onPrevious,
  onNext,
}) {
  return (
    <section className="w-full overflow-hidden rounded-[1.5rem] border border-[#beaf87]/24 bg-[#fbfaf7] shadow-[0_24px_70px_rgba(40,32,20,0.1)] sm:rounded-[2rem]">
      <div className="relative bg-[#111]">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="h-[285px] w-full object-cover sm:h-[500px] lg:h-[620px]"
          />
        ) : (
          <div className="flex h-[285px] items-center justify-center sm:h-[500px] lg:h-[620px]">
            <Building2 className="h-14 w-14 text-[#beaf87]/70" />
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-[#beaf87] hover:text-black sm:left-4 sm:h-11 sm:w-11"
              aria-label="Fotografia anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-[#beaf87] hover:text-black sm:right-4 sm:h-11 sm:w-11"
              aria-label="Próxima fotografia"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 right-4 rounded-full bg-black/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
              {currentPhotoIndex + 1}/{photos.length}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
          {photos.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setCurrentPhotoIndex(index)}
              className={`h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition ${
                index === currentPhotoIndex
                  ? "border-[#beaf87] ring-2 ring-[#beaf87]/35"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
              aria-label={`Ver fotografia ${index + 1}`}
            >
              <img
                src={photo}
                alt={`${title} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function PropertyMetrics({ property }) {
  const metrics = [
    {
      label: "Área",
      value: property.area ? `${formatNumber(property.area)} m²` : "—",
      icon: Ruler,
    },
    {
      label: "Quartos",
      value: formatNumber(property.bedrooms),
      icon: BedDouble,
    },
    {
      label: "Casas de banho",
      value: formatNumber(property.bathrooms),
      icon: Bath,
    },
    {
      label: "Tipo",
      value: property.property_type || "—",
      icon: Building2,
    },
  ];

  return (
    <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="rounded-[1.5rem] border border-[#beaf87]/22 bg-white p-5 shadow-[0_16px_48px_rgba(40,32,20,0.06)]"
          >
            <Icon className="mb-4 h-5 w-5 text-[#beaf87]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#171717]/40">
              {metric.label}
            </p>
            <p className="mt-2 font-serif text-2xl text-[#2a2418]">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ContentSection({ title, children }) {
  return (
    <section className="mt-10 border-t border-[#beaf87]/20 pt-8 sm:mt-12 sm:pt-10">
      <h2 className="mb-6 font-serif text-3xl text-[#2a2418] sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#beaf87]/20 bg-[#fbfaf7] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#beaf87]">
        {label}
      </p>
      <p className="mt-2 break-words text-base text-[#171717]/72">{value}</p>
    </div>
  );
}

function ConsultantCard({ consultant }) {
  return (
    <div className="rounded-[1.6rem] border border-[#beaf87]/25 bg-[#fbfaf7] p-5 shadow-[0_22px_70px_rgba(40,32,20,0.08)] sm:rounded-[2rem] sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#beaf87]">
        Consultor responsável
      </p>

      <h2 className="mt-3 font-serif text-3xl leading-tight text-[#2a2418]">
        {consultant.name}
      </h2>

      <p className="mt-1 text-sm text-[#171717]/56">{consultant.role}</p>

      <div className="mt-6 space-y-4 text-sm text-[#171717]/68">
        <a
          href={consultant.phoneHref}
          className="flex items-center gap-3 transition hover:text-[#beaf87]"
        >
          <Phone className="h-4 w-4 shrink-0 text-[#beaf87]" />
          <span>Tlm: {consultant.phone}</span>
        </a>

        <a
          href={consultant.emailHref}
          className="flex items-center gap-3 break-all transition hover:text-[#beaf87]"
        >
          <Mail className="h-4 w-4 shrink-0 text-[#beaf87]" />
          <span>{consultant.email}</span>
        </a>
      </div>

      <a
        href={consultant.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="mt-7 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#beaf87] px-5 py-4 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-black transition hover:brightness-105"
      >
        Falar com consultor
      </a>
    </div>
  );
}

function NotFoundState({ errorMessage }) {
  return (
    <section className="px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[430px] rounded-[2rem] border border-[#beaf87]/25 bg-[#fbfaf7] p-8 text-center sm:max-w-3xl sm:p-12">
        <Building2 className="mx-auto mb-5 h-12 w-12 text-[#beaf87]" />

        <h1 className="font-serif text-4xl text-[#2a2418]">
          Imóvel não encontrado
        </h1>

        <p className="mt-5 text-base leading-8 text-[#171717]/62">
          {errorMessage || "O imóvel que procura não está disponível neste momento."}
        </p>

        <a
          href="/#imoveis"
          className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-[#beaf87] px-7 text-sm font-extrabold uppercase tracking-[0.14em] text-black"
        >
          <ArrowLeft className="mr-3 h-5 w-5" />
          Ver imóveis
        </a>
      </div>
    </section>
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