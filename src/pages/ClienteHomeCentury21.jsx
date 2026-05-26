import React, { useEffect } from "react";
import { ArrowRight, Building2, Mail, MapPin, Menu, Phone, X } from "lucide-react";

const LOGO = "/assets/logosite.png";
const PAULO_PHOTO = "/assets/paulo-matos.png";
const MARIA_PHOTO = "/assets/maria-carreiro.png";

const consultants = [
  {
    name: "Paulo Matos",
    role: "Consultor Imobiliário",
    phone: "+351 919 783 014",
    email: "pjmatos@century21.pt",
    image: PAULO_PHOTO,
    whatsapp: "https://wa.me/351919783014",
  },
  {
    name: "Maria Carreiro",
    role: "Consultora Imobiliária",
    phone: "+351 937 219 215",
    email: "mjcarreiro@century21.pt",
    image: MARIA_PHOTO,
    whatsapp: "https://wa.me/351937219215",
  },
];

function BrandLogo() {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <img src={LOGO} alt="CENTURY 21" className="h-11 w-auto object-contain sm:h-12" />
      <span className="pl-[0.34em] text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#beaf87]">
        Nações
      </span>
    </div>
  );
}

export default function ClienteHomeCentury21() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
    { label: "Sobre Nós", href: "#home", section: true },
    { label: "Apoio Jurídico", href: "/apoio-juridico", section: false },
    { label: "Crédito Habitação", href: "/credito-habitacao", section: false },
    { label: "Contacte-nos", href: "#contacte-nos", section: true },
  ];

  function handleNavClick(event, item) {
    setMobileMenuOpen(false);

    if (!item.section) {
      return;
    }

    event.preventDefault();
    const target = document.querySelector(item.href);
    target?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-[#beaf87]/25 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="/" aria-label="Ir para a página inicial">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => handleNavClick(event, item)}
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
                  onClick={(event) => handleNavClick(event, item)}
                  className="rounded-2xl border border-[#beaf87]/25 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#171717]/78"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <section id="home" className="relative overflow-hidden bg-white pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-36 top-10 h-[34rem] w-[34rem] rounded-full bg-[#beaf87]/18 blur-[150px]" />
          <div className="absolute -right-36 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#beaf87]/12 blur-[160px]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(190,175,135,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(190,175,135,0.24) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div className="absolute bottom-8 right-6 hidden select-none text-[13rem] font-black leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_rgba(190,175,135,0.18)] lg:block xl:text-[17rem]">
            21
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1560px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-20 xl:gap-20">
          <div className="text-center lg:text-left">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#beaf87] sm:text-sm">
              Mediação imobiliária · Lisboa
            </p>

            <h1 className="font-serif text-5xl leading-[1.05] text-[#2a2418] sm:text-6xl lg:text-7xl">
              O seu próximo imóvel começa aqui.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#171717]/68 sm:text-lg lg:mx-0">
              Acompanhamento próximo e especializado na compra, venda e valorização do seu imóvel.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="https://wa.me/351919783014"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#beaf87] px-7 text-sm font-extrabold uppercase tracking-[0.16em] text-black transition hover:brightness-105"
              >
                Falar com Paulo
                <ArrowRight className="ml-3 h-5 w-5" />
              </a>
              <a
                href="https://wa.me/351937219215"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-[#beaf87]/55 bg-white px-7 text-sm font-extrabold uppercase tracking-[0.16em] text-[#2a2418] transition hover:bg-[#beaf87] hover:text-black"
              >
                Falar com Maria
              </a>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:gap-8 xl:gap-10">
            {consultants.map((consultant) => (
              <article
                key={consultant.email}
                className="group overflow-hidden rounded-[2rem] border border-[#beaf87]/35 bg-white shadow-[0_28px_90px_rgba(40,32,20,0.16)]"
              >
                <div className="relative h-[420px] overflow-hidden sm:h-[470px] lg:h-[680px] xl:h-[740px] 2xl:h-[780px]">
                  <img
                    src={consultant.image}
                    alt={consultant.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#beaf87]">{consultant.role}</p>
                    <h2 className="mt-2 font-serif text-4xl text-white lg:text-[2.9rem] xl:text-[3.15rem]">{consultant.name}</h2>
                    <div className="mt-5 space-y-3 text-sm text-white/86">
                      <p className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-[#beaf87]" /><span>Tlm: {consultant.phone}</span></p>
                      <p className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#beaf87]" /><span>{consultant.email}</span></p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="imoveis" className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.38em] text-[#beaf87]">Imóveis disponíveis</p>
            <h2 className="font-serif text-4xl leading-tight text-[#2a2418] sm:text-5xl">Esta secção está em desenvolvimento.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#171717]/68">
              Em breve, poderá consultar aqui os imóveis disponíveis para compra, com fotografias, localização, características e contacto direto com a equipa.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {["Imóvel em breve", "Novas oportunidades", "Catálogo em construção"].map((title) => (
              <article key={title} className="rounded-[2rem] border border-[#beaf87]/25 bg-white p-7 shadow-[0_24px_70px_rgba(40,32,20,0.08)]">
                <div className="mb-6 flex h-44 items-center justify-center rounded-[1.5rem] border border-[#beaf87]/20 bg-[#fbfaf7]">
                  <Building2 className="h-10 w-10 text-[#beaf87]" />
                </div>
                <h3 className="font-serif text-2xl text-[#2a2418]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#171717]/62">
                  Informação em atualização. Os imóveis serão apresentados nesta área assim que forem adicionados ao back-office.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacte-nos" className="overflow-hidden border-t border-[#beaf87]/20 bg-white px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid w-full max-w-[430px] gap-8 sm:max-w-7xl lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div className="w-full">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87] sm:tracking-[0.38em]">Contacte-nos</p>
            <h2 className="max-w-[360px] font-serif text-[2.15rem] leading-tight text-[#2a2418] sm:max-w-none sm:text-5xl">
              Faça uma avaliação do seu imóvel.
            </h2>
            <p className="mt-5 max-w-[360px] text-base leading-8 text-[#171717]/68 sm:max-w-none">
              Preencha o formulário e a equipa entrará em contacto para analisar o seu imóvel e indicar os próximos passos.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[430px] overflow-hidden border-0 bg-transparent shadow-none sm:max-w-none sm:rounded-[2rem] sm:border sm:border-[#beaf87]/25 sm:bg-[#fbfaf7] sm:p-2 sm:shadow-[0_28px_90px_rgba(40,32,20,0.12)]">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/6GtQplOnxB64sOvqRUUl"
              className="block h-[730px] w-full sm:h-[1063px] sm:rounded-[24px]"
              style={{ border: "none" }}
              id="inline-6GtQplOnxB64sOvqRUUl"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Form 1"
              data-height="730"
              data-layout-iframe-id="inline-6GtQplOnxB64sOvqRUUl"
              data-form-id="6GtQplOnxB64sOvqRUUl"
              title="Form 1"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 text-center lg:grid-cols-[1fr_1.2fr_0.8fr] lg:text-left">
          <div>
            <div className="mb-6 flex flex-col items-center gap-1 lg:items-start">
              <img src={LOGO} alt="CENTURY 21" className="h-14 w-auto object-contain" />
              <span className="text-xs font-semibold uppercase tracking-[0.38em] text-[#beaf87]">Nações</span>
            </div>
            <h3 className="font-serif text-3xl text-[#2a2418]">Paulo Matos</h3>
            <p className="mt-1 text-[#171717]/68">Consultor Imobiliário</p>
            <p className="mt-5 text-lg font-bold text-[#171717]">CENTURY 21.</p>
            <p className="text-[#beaf87]">Nações</p>
          </div>

          <div className="space-y-4 text-sm leading-7 text-[#171717]/68">
            <p className="flex flex-col items-center gap-3 lg:flex-row lg:items-start">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#beaf87]" />
              <span>CENTURY 21 Nações IX<br />Rua Casquilha 2, 1500-151 Lisboa</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 text-sm text-[#171717]/68 lg:items-end">
            <a href="/politica-de-privacidade" className="transition hover:text-[#beaf87]">Política de Privacidade</a>
            <a href="/politica-de-cookies" className="transition hover:text-[#beaf87]">Política de Cookies</a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-[#beaf87]/20 pt-6 text-center text-xs leading-6 text-[#171717]/46">
          <p>Cada agência é jurídica e financeiramente independente.</p>
          <p>DNZ - Mediação Imobiliária, LDA AMI 10786</p>
        </div>
      </footer>
    </main>
  );
}
