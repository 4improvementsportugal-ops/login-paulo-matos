import React, { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";

const LOGO = "/assets/logosite.png";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4651.468143284943!2d-9.208721522898792!3d38.74572857175669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1eccd949fc4aed%3A0x58c5d858199ae05a!2sR.%20Casquilha%202%2C%201500-154%20Lisboa%2C%20Portugal!5e1!3m2!1spt-BR!2sbr!4v1780226053359!5m2!1spt-BR!2sbr";

const CONTACT_FORM_URL =
  "https://api.leadconnectorhq.com/widget/form/7IiXoIfWD9V7uBsO3RFj";

const consultants = [
  {
    name: "Paulo Matos",
    role: "Consultor Imobiliário",
    phone: "+351 919 783 014",
    phoneHref: "tel:+351919783014",
    email: "pjmatos@century21.pt",
    emailHref: "mailto:pjmatos@century21.pt",
  },
  {
    name: "Maria Carreiro",
    role: "Consultora Imobiliária",
    phone: "+351 937 219 215",
    phoneHref: "tel:+351937219215",
    email: "mjcarreiro@century21.pt",
    emailHref: "mailto:mjcarreiro@century21.pt",
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

export default function ContacteNosCentury21() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const scriptId = "ghl-form-embed-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://link.msgsndr.com/js/form_embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const navItems = [
    { label: "Sobre Nós", href: "/sobre-nos" },
    { label: "Apoio Jurídico", href: "/apoio-juridico" },
    { label: "Crédito Habitação", href: "/credito-habitacao" },
    { label: "Contacte-nos", href: "/contacte-nos", active: true },
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
            Fale connosco
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-[#2a2418] sm:text-5xl lg:text-6xl">
            Contacte-nos
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#171717]/68 sm:text-lg">
            Estamos disponíveis para esclarecer dúvidas, avaliar o seu imóvel e acompanhar o seu próximo passo no mercado imobiliário.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-[#beaf87]/24 bg-[#fbfaf7] p-6 shadow-[0_22px_70px_rgba(40,32,20,0.08)] sm:p-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-[#beaf87]">
                Morada
              </p>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#beaf87]/25 bg-white">
                  <MapPin className="h-5 w-5 text-[#beaf87]" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl leading-tight text-[#2a2418]">
                    CENTURY 21 Nações IX
                  </h2>
                  <p className="mt-3 text-base leading-8 text-[#171717]/68">
                    Rua Casquilha 2, 1500-151 Lisboa
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {consultants.map((consultant) => (
                <ConsultantCard key={consultant.email} consultant={consultant} />
              ))}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#beaf87]/24 bg-[#fbfaf7] shadow-[0_22px_70px_rgba(40,32,20,0.08)]">
              <iframe
                src={MAP_EMBED_URL}
                title="Localização - Rua Casquilha 2, Lisboa"
                width="600"
                height="450"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full border-0 sm:h-[430px]"
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="overflow-hidden rounded-[2rem] border border-[#beaf87]/24 bg-[#fbfaf7] p-2 shadow-[0_28px_90px_rgba(40,32,20,0.12)]">
              <div className="px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#beaf87]">
                  Formulário de contacto
                </p>
                <h2 className="font-serif text-3xl leading-tight text-[#2a2418] sm:text-4xl">
                  Entre em contacto
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#171717]/62">
                  Preencha os dados abaixo e a equipa entrará em contacto consigo com a maior brevidade possível.
                </p>
              </div>

              <iframe
                src={CONTACT_FORM_URL}
                title="CONTACTO"
                id="inline-7IiXoIfWD9V7uBsO3RFj"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="CONTACTO"
                data-height="693"
                data-layout-iframe-id="inline-7IiXoIfWD9V7uBsO3RFj"
                data-form-id="7IiXoIfWD9V7uBsO3RFj"
                className="block h-[760px] w-full rounded-[24px] border-0 bg-white sm:h-[735px]"
              />
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

function ConsultantCard({ consultant }) {
  return (
    <article className="rounded-[2rem] border border-[#beaf87]/24 bg-white p-6 shadow-[0_18px_54px_rgba(40,32,20,0.07)]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#beaf87]/25 bg-[#fbfaf7]">
        <UserRound className="h-5 w-5 text-[#beaf87]" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#beaf87]">
        {consultant.role}
      </p>
      <h3 className="mt-3 font-serif text-3xl leading-tight text-[#2a2418]">
        {consultant.name}
      </h3>

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
    </article>
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
