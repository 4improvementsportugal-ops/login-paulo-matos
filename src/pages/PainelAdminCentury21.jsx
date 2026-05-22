import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowRight,
  Building2,
  Construction,
  Eye,
  EyeOff,
  FileText,
  Lock,
  LogOut,
  Mail,
  Menu,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const env = import.meta.env || {};
const LOGO = "/assets/logosite.png";
const DEFAULT_SUPABASE_URL = "https://keulsgyzfruvscapcuxk.supabase.co";

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

const SUPABASE_URL = normalizeSupabaseUrl(
  env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
);

const SUPABASE_PUBLISHABLE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Rg-J0l6M1cGxvNdIupJwrg_Y7GWhrFK";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const ADMIN_MENU = [
  { id: "imoveis", label: "Gestão de Imóveis", icon: Building2 },
  { id: "posts", label: "Gestão de Posts", icon: FileText },
  { id: "usuarios", label: "Gestão de Usuários", icon: Users },
];

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

export default function PainelAdminCentury21() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggedUserEmail, setLoggedUserEmail] = useState("");

  const [activeSection, setActiveSection] = useState("imoveis");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [confirmNewUserPassword, setConfirmNewUserPassword] = useState("");
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [creationSuccess, setCreationSuccess] = useState("");
  const [createdUsers, setCreatedUsers] = useState([]);

  const pageTitle = ADMIN_MENU.find(
    (item) => item.id === activeSection
  )?.label;

  useEffect(() => {
    async function validateSession() {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (error || !session) {
        window.location.href = "/admin/login";
        return;
      }

      setLoggedUserEmail(session.user.email || "Administrador");
      setCheckingSession(false);
    }

    validateSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          window.location.href = "/admin/login";
          return;
        }

        setLoggedUserEmail(session.user.email || "Administrador");
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId);
    setAdminMenuOpen(false);
    setCreationError("");
    setCreationSuccess("");
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    setCreationError("");
    setCreationSuccess("");

    const normalizedEmail = newUserEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setCreationError("Introduza o e-mail do novo utilizador.");
      return;
    }

    if (newUserPassword.length < 8) {
      setCreationError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newUserPassword !== confirmNewUserPassword) {
      setCreationError("As palavras-passe não coincidem.");
      return;
    }

    try {
      setCreatingUser(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      const session = sessionData?.session;

      if (sessionError || !session) {
        setCreationError("A sessão expirou. Inicie sessão novamente.");

        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1200);

        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "create-access-user",
        {
          body: {
            email: normalizedEmail,
            password: newUserPassword,
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        console.error("Erro ao chamar create-access-user:", error);

        let functionErrorMessage =
          error.message || "Não foi possível criar o utilizador.";

        try {
          if (error.context && typeof error.context.json === "function") {
            const errorBody = await error.context.json();

            if (errorBody?.error) {
              functionErrorMessage = errorBody.error;
            }
          }
        } catch (contextError) {
          console.error(
            "Não foi possível ler o detalhe do erro da função:",
            contextError
          );
        }

        setCreationError(functionErrorMessage);
        return;
      }

      if (data?.error) {
        setCreationError(data.error);
        return;
      }

      setCreatedUsers((current) => [
        {
          email: normalizedEmail,
          createdAt: new Date().toLocaleString("pt-PT"),
        },
        ...current,
      ]);

      setCreationSuccess(
        `Utilizador ${normalizedEmail} criado com sucesso.`
      );

      setNewUserEmail("");
      setNewUserPassword("");
      setConfirmNewUserPassword("");
      setShowNewUserPassword(false);
    } catch (error) {
      console.error("Erro inesperado ao criar utilizador:", error);

      setCreationError(
        "Não foi possível criar o utilizador neste momento."
      );
    } finally {
      setCreatingUser(false);
    }
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

      {adminMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setAdminMenuOpen(false)}
          aria-label="Fechar menu lateral"
        />
      )}

      <div className="relative z-10 flex min-h-[100dvh]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[285px] flex-col border-r border-[#beaf87]/15 bg-[#080808]/98 px-5 py-6 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
            adminMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between">
            <BrandLogo />

            <button
              type="button"
              className="rounded-full border border-[#beaf87]/18 p-2 text-[#beaf87] lg:hidden"
              onClick={() => setAdminMenuOpen(false)}
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
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionChange(item.id)}
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#beaf87]/22 text-[#beaf87] lg:hidden"
                onClick={() => setAdminMenuOpen(true)}
                aria-label="Abrir menu administrativo"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.34em] text-[#beaf87]/70">
                  Back-office
                </p>

                <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                  {pageTitle}
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            {activeSection === "imoveis" && (
              <DevelopmentSection
                title="Gestão de Imóveis"
                description="Aqui será possível adicionar, editar e publicar os imóveis apresentados na área pública do site."
              />
            )}

            {activeSection === "posts" && (
              <DevelopmentSection
                title="Gestão de Posts"
                description="Aqui será possível criar conteúdos para o Apoio Jurídico, com campos orientados para SEO."
              />
            )}

            {activeSection === "usuarios" && (
              <UsersSection
                newUserEmail={newUserEmail}
                setNewUserEmail={setNewUserEmail}
                newUserPassword={newUserPassword}
                setNewUserPassword={setNewUserPassword}
                confirmNewUserPassword={confirmNewUserPassword}
                setConfirmNewUserPassword={setConfirmNewUserPassword}
                showNewUserPassword={showNewUserPassword}
                setShowNewUserPassword={setShowNewUserPassword}
                creatingUser={creatingUser}
                creationError={creationError}
                creationSuccess={creationSuccess}
                createdUsers={createdUsers}
                handleCreateUser={handleCreateUser}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function DevelopmentSection({ title, description }) {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-4xl items-center justify-center">
      <div className="w-full rounded-[2rem] border border-[#beaf87]/18 bg-[#0b0b0b]/92 p-7 text-center shadow-[0_25px_80px_rgba(0,0,0,0.46)] sm:p-12">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#beaf87]/24 bg-[#beaf87]/10">
          <Construction className="h-8 w-8 text-[#beaf87]" />
        </div>

        <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
          {title}
        </p>

        <h2 className="font-serif text-4xl leading-tight text-[#beaf87] sm:text-5xl">
          Página em desenvolvimento
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}

function UsersSection({
  newUserEmail,
  setNewUserEmail,
  newUserPassword,
  setNewUserPassword,
  confirmNewUserPassword,
  setConfirmNewUserPassword,
  showNewUserPassword,
  setShowNewUserPassword,
  creatingUser,
  creationError,
  creationSuccess,
  createdUsers,
  handleCreateUser,
}) {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
          Acessos ao back-office
        </p>

        <h2 className="font-serif text-3xl leading-tight text-[#beaf87] sm:text-4xl">
          Gestão de Usuários
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
          Crie novos utilizadores para acesso à área administrativa. Todos os
          utilizadores criados terão perfil de administrador.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.86fr]">
        <form
          onSubmit={handleCreateUser}
          className="rounded-[2rem] border border-[#beaf87]/18 bg-[#0b0b0b]/94 p-5 shadow-[0_25px_75px_rgba(0,0,0,0.45)] sm:p-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#beaf87]/20 bg-[#beaf87]/10">
              <UserPlus className="h-5 w-5 text-[#beaf87]" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Criar novo utilizador
              </h3>

              <p className="mt-1 text-sm text-white/52">
                Perfil atribuído: Administrador
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block text-left">
              <span className="mb-2 block text-sm font-medium text-white/76">
                E-mail
              </span>

              <div className="flex items-center rounded-2xl border border-[#beaf87]/16 bg-black px-4 focus-within:border-[#beaf87] focus-within:ring-4 focus-within:ring-[#beaf87]/10">
                <Mail className="mr-3 h-5 w-5 text-[#beaf87]" />

                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(event) => setNewUserEmail(event.target.value)}
                  placeholder="novo.utilizador@exemplo.pt"
                  className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/28"
                  autoComplete="off"
                />
              </div>
            </label>

            <label className="block text-left">
              <span className="mb-2 block text-sm font-medium text-white/76">
                Palavra-passe inicial
              </span>

              <div className="flex items-center rounded-2xl border border-[#beaf87]/16 bg-black px-4 focus-within:border-[#beaf87] focus-within:ring-4 focus-within:ring-[#beaf87]/10">
                <Lock className="mr-3 h-5 w-5 text-[#beaf87]" />

                <input
                  type={showNewUserPassword ? "text" : "password"}
                  value={newUserPassword}
                  onChange={(event) => setNewUserPassword(event.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/28"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewUserPassword((current) => !current)
                  }
                  className="ml-3 p-1 text-white/42 transition hover:text-[#beaf87]"
                  aria-label={
                    showNewUserPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                >
                  {showNewUserPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            <label className="block text-left">
              <span className="mb-2 block text-sm font-medium text-white/76">
                Confirmar palavra-passe
              </span>

              <div className="flex items-center rounded-2xl border border-[#beaf87]/16 bg-black px-4 focus-within:border-[#beaf87] focus-within:ring-4 focus-within:ring-[#beaf87]/10">
                <Lock className="mr-3 h-5 w-5 text-[#beaf87]" />

                <input
                  type={showNewUserPassword ? "text" : "password"}
                  value={confirmNewUserPassword}
                  onChange={(event) =>
                    setConfirmNewUserPassword(event.target.value)
                  }
                  placeholder="Repita a palavra-passe"
                  className="h-14 w-full bg-transparent text-white outline-none placeholder:text-white/28"
                  autoComplete="new-password"
                />
              </div>
            </label>
          </div>

          {creationError && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
              {creationError}
            </div>
          )}

          {creationSuccess && (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">
              {creationSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={creatingUser}
            className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-[#beaf87] px-5 text-sm font-extrabold uppercase tracking-[0.15em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {creatingUser ? "A criar utilizador..." : "Criar utilizador"}

            {!creatingUser && <ArrowRight className="ml-3 h-5 w-5" />}
          </button>
        </form>

        <div className="rounded-[2rem] border border-[#beaf87]/14 bg-[#090909]/88 p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#beaf87]">
                Criados nesta sessão
              </p>

              <p className="mt-2 text-sm text-white/52">
                Novos acessos adicionados agora
              </p>
            </div>

            <div className="rounded-full border border-[#beaf87]/18 px-3 py-1.5 text-sm font-semibold text-[#beaf87]">
              {createdUsers.length}
            </div>
          </div>

          {createdUsers.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[#beaf87]/18 px-5 text-center">
              <Users className="mb-4 h-8 w-8 text-[#beaf87]/60" />

              <p className="text-sm leading-7 text-white/50">
                Nenhum novo utilizador foi criado durante esta sessão.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {createdUsers.map((user) => (
                <div
                  key={`${user.email}-${user.createdAt}`}
                  className="rounded-2xl border border-[#beaf87]/12 bg-black p-4"
                >
                  <p className="break-all text-sm font-medium text-white">
                    {user.email}
                  </p>

                  <p className="mt-2 text-xs text-white/46">
                    Criado em {user.createdAt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
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