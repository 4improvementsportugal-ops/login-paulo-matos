import React from "react";
import { ExternalLink, Home, MapPin, Menu, X } from "lucide-react";

const LOGO = "/assets/logosite.png";
const CREDIT_LINK = "https://pjmatos.century21.pt/credito-habitacao";

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

export default function CreditoHabitacaoCentury21() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Sobre Nós", href: "/#sobre" },
    { label: "Apoio Jurídico", href: "/apoio-juridico" },
    { label: "Crédito Habitação", href: "/credito-habitacao", active: true },
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

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-[#beaf87] sm:text-sm">
            Serviço para compradores
          </p>
          <h1 className="max-w-4xl font-serif text-4xl leading-tight text-[#2a2418] sm:text-5xl lg:text-6xl">
            Crédito Habitação
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#171717]/68 sm:text-lg">
            Acompanhamento especializado para avançar na compra da sua nova casa com confiança e segurança.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.44fr] lg:gap-16">
          <article className="order-2 max-w-3xl lg:order-1">
            <p className="text-lg leading-9 text-[#171717]/78">
              Comprar uma nova casa é uma das decisões mais importantes da sua vida. Por isso, contar com o apoio certo no processo de financiamento pode fazer toda a diferença.
            </p>

            <p className="mt-7 text-base leading-8 text-[#171717]/70">
              Como intermediários de crédito à habitação, prestamos aos nossos clientes compradores um serviço de acompanhamento especializado, com o objetivo de encontrar a solução de financiamento mais adequada ao seu perfil, objetivos e capacidade financeira.
            </p>

            <p className="mt-7 text-base leading-8 text-[#171717]/70">
              Em vez de consultar apenas um banco, analisamos várias opções disponíveis no mercado, comparando condições como spread, taxa fixa ou variável, prazo do financiamento, seguros associados, comissões e valor estimado da prestação mensal.
            </p>

            <div className="my-9 border-l-2 border-[#beaf87] bg-[#fbfaf7] px-6 py-5 sm:px-8">
              <p className="font-serif text-2xl leading-relaxed text-[#2a2418]">
                O objetivo é simples: ajudá-lo a tomar uma decisão informada, segura e financeiramente equilibrada.
              </p>
            </div>

            <p className="text-base leading-8 text-[#171717]/70">
              Acompanhamos todo o processo, desde a simulação inicial até à aprovação do crédito e à escritura, ajudando na recolha da documentação, análise das propostas bancárias, negociação de condições e esclarecimento de todas as dúvidas que possam surgir.
            </p>

            <p className="mt-7 text-base leading-8 text-[#171717]/70">
              Este serviço permite-lhe poupar tempo, evitar deslocações desnecessárias a vários bancos e aumentar a probabilidade de obter uma proposta de crédito competitiva e ajustada à sua realidade.
            </p>

            <p className="mt-7 text-base leading-8 text-[#171717]/70">
              Além disso, este é um serviço que prestamos aos nossos clientes compradores sem qualquer custo ou encargo para si. Ou seja, pode beneficiar deste acompanhamento profissional no processo de crédito à habitação sem ter de suportar qualquer valor pelo nosso apoio.
            </p>

            <p className="mt-7 text-base leading-8 text-[#171717]/70">
              O nosso compromisso é estar ao seu lado em cada etapa, com transparência, proximidade e foco na solução que melhor protege os seus interesses.
            </p>

            <p className="mt-7 text-lg font-medium leading-9 text-[#2a2418]">
              Antes de escolher a sua casa, é essencial saber até onde pode ir com segurança.
            </p>

            <p className="mt-5 text-base leading-8 text-[#171717]/70">
              Fale connosco e descubra qual o valor de financiamento mais adequado para si, para que possa avançar para a compra da sua nova casa com confiança.
            </p>
          </article>

          <aside className="order-1 lg:sticky lg:top-28 lg:order-2 lg:h-fit">
            <div className="rounded-[2rem] border border-[#beaf87]/25 bg-[#fbfaf7] p-6 shadow-[0_22px_70px_rgba(40,32,20,0.08)] sm:p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#beaf87]/30 bg-white">
                <Home className="h-6 w-6 text-[#beaf87]" />
              </div>
              <h2 className="font-serif text-3xl leading-tight text-[#2a2418]">
                Comece pela simulação
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#171717]/68">
                Aceda à plataforma de crédito habitação para iniciar a sua simulação e compreender as possibilidades de financiamento.
              </p>

              <a
                href={CREDIT_LINK}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#beaf87] px-5 py-4 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-black transition hover:brightness-105"
              >
                Simular crédito
                <ExternalLink className="ml-3 h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-[#beaf87]/20 bg-[#fbfaf7] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 text-center lg:grid-cols-[1fr_1.2fr_0.8fr] lg:text-left">
          <div>
            <a href="/" aria-label="Voltar à página inicial" className="inline-block">
              <div className="mb-6 flex flex-col items-center gap-1 lg:items-start">
                <img src={LOGO} alt="CENTURY 21" className="h-14 w-auto object-contain" />
                <span className="text-xs font-semibold uppercase tracking-[0.38em] text-[#beaf87]">
                  Nações
                </span>
              </div>
            </a>
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
            <a href="/politica-de-privacidade-e-cookies" className="transition hover:text-[#beaf87]">Política de Privacidade e Cookies</a>
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
