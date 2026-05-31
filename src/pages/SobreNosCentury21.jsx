import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";

const LOGO = "/assets/logosite.png";
const PAULO_VIDEO = "https://www.youtube.com/embed/qTAhNY9Lklw";
const MARIA_VIDEO = "https://www.youtube.com/embed/aUb4Sl57rS4";

const consultants = [
  {
    name: "Paulo Matos",
    role: "Consultor Imobiliário",
    phone: "+351 919 783 014",
    phoneHref: "tel:+351919783014",
    email: "pjmatos@century21.pt",
    emailHref: "mailto:pjmatos@century21.pt",
    video: PAULO_VIDEO,
    description:
      "Paulo Matos apresenta a visão, o acompanhamento e a proximidade que caracterizam o trabalho da equipa C21 Nações.",
  },
  {
    name: "Maria Carreiro",
    role: "Consultora Imobiliária",
    phone: "+351 937 219 215",
    phoneHref: "tel:+351937219215",
    email: "mjcarreiro@century21.pt",
    emailHref: "mailto:mjcarreiro@century21.pt",
    video: MARIA_VIDEO,
    description:
      "Maria Carreiro partilha a importância de um serviço próximo, transparente e orientado para cada cliente.",
  },
];

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

export default function SobreNosCentury21() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Sobre Nós", href: "/sobre-nos", active: true },
    { label: "Apoio Jurídico", href: "/apoio-juridico" },
    { label: "Crédito Habitação", href: "/credito-habitacao" },
    { label: "Contacte-nos", href: "/contacte-nos" },
  ];

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <header className="sticky top-0 z-50 w-full border-b border-[#beaf87]/25 bg-white/94 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="/" aria-label="Ir para a página inicial">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
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

      <section className="relative overflow-hidden border-b border-[#beaf87]/20 bg-[#fbfaf7]">
        <HeroBackground />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-[#beaf87] sm:text-sm">
            Conheça a equipa
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-[#2a2418] sm:text-5xl lg:text-6xl">
            Sobre Nós
          </h1>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
                C21 Nações
              </p>
              <h2 className="font-serif text-4xl leading-tight text-[#2a2418] sm:text-5xl">
                Uma equipa focada em criar uma experiência imobiliária mais próxima.
              </h2>
            </div>
            <p className="text-base leading-8 text-[#171717]/68 sm:text-lg">
              A C21 Nações combina conhecimento local, acompanhamento personalizado e uma abordagem orientada para resultados. Nesta página, Paulo Matos e Maria Carreiro apresentam, em vídeo, a forma como trabalham e o que significa fazer parte desta equipa.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 xl:gap-10">
            {consultants.map((consultant) => (
              <ConsultantVideoCard
                key={consultant.email}
                consultant={consultant}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#beaf87]/24 bg-white p-7 shadow-[0_22px_70px_rgba(40,32,20,0.08)] sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
              Acompanhamento imobiliário
            </p>
            <h2 className="font-serif text-3xl leading-tight text-[#2a2418] sm:text-4xl">
              Precisa de apoio para comprar, vender ou avaliar um imóvel?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#171717]/64">
              Fale connosco para percebermos o seu objetivo e indicarmos o melhor próximo passo.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href="/contacte-nos"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#beaf87] px-7 text-sm font-extrabold uppercase tracking-[0.14em] text-black transition hover:brightness-105"
            >
              Contacte-nos
            </a>
            <a
              href="/credito-habitacao"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#beaf87]/45 bg-white px-7 text-sm font-extrabold uppercase tracking-[0.14em] text-[#2a2418] transition hover:bg-[#beaf87] hover:text-black"
            >
              Crédito Habitação
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

function ConsultantVideoCard({ consultant }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#beaf87]/24 bg-white shadow-[0_24px_80px_rgba(40,32,20,0.11)]">
      <div className="grid gap-0 lg:grid-cols-[0.82fr_1fr]">
        <div className="relative bg-black">
          <div className="relative aspect-[9/16] h-full w-full overflow-hidden bg-black">
            <iframe
              src={consultant.video}
              title={`Vídeo de ${consultant.name}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#beaf87]">
            {consultant.role}
          </p>
          <h3 className="mt-3 font-serif text-4xl leading-tight text-[#2a2418]">
            {consultant.name}
          </h3>
          <p className="mt-5 text-base leading-8 text-[#171717]/66">
            {consultant.description}
          </p>

          <div className="mt-7 space-y-4 text-sm text-[#171717]/68">
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
        </div>
      </div>
    </article>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-12 sm:px-8 lg:px-10">
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
          <h3 className="font-serif text-3xl text-[#2a2418]">Paulo Matos</h3>
          <p className="mt-1 text-[#171717]/68">Consultor Imobiliário</p>
          <p className="mt-5 text-lg font-bold text-[#171717]">CENTURY 21.</p>
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
