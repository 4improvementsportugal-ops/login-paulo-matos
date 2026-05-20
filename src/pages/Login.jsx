import React, { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Construction, LogOut } from "lucide-react";

const env = import.meta.env || {};

const DEFAULT_SUPABASE_URL = "https://keulsgyzfruvscapcuxk.supabase.co";
const CENTURY21_LOGO = "/assets/paulo-matos-login.png";
const GOLD = "#beaf87";

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

const SUPABASE_URL = normalizeSupabaseUrl(env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL);
const SUPABASE_PUBLISHABLE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_Rg-J0l6M1cGxvNdIupJwrg_Y7GWhrFK";

function isValidSupabaseUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Century21Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Preencha o e-mail e a palavra-passe para continuar.");
      return;
    }

    if (!SUPABASE_URL || !isValidSupabaseUrl(SUPABASE_URL)) {
      setErrorMessage("Configure uma URL válida do Supabase antes de iniciar sessão.");
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("E-mail ou palavra-passe inválidos. Verifique os dados e tente novamente.");
        return;
      }

      if (data?.session) {
        setSuccessMessage("Sessão iniciada com sucesso.");
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 700);
      }
    } catch {
      setErrorMessage("Não foi possível iniciar sessão neste momento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  if (isAuthenticated) {
    return (
      <main className="fixed inset-0 flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black px-6 py-10 text-white">
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
          <div className="absolute bottom-4 right-8 hidden select-none text-[12rem] font-black leading-none tracking-[-0.08em] text-transparent opacity-80 [-webkit-text-stroke:1px_rgba(190,175,135,0.10)] lg:block xl:text-[15rem]">
            21
          </div>
        </div>

        <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-[#beaf87]/20 bg-[#0b0b0b]/95 p-8 text-center shadow-[0_0_0_1px_rgba(190,175,135,0.04),0_28px_90px_rgba(0,0,0,0.70)] backdrop-blur sm:p-10">
          <img
            src={CENTURY21_LOGO}
            alt="CENTURY 21"
            className="mx-auto mb-10 h-10 w-auto object-contain sm:h-12"
          />

          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#beaf87]/25 bg-[#beaf87]/10">
            <Construction className="h-8 w-8 text-[#beaf87]" />
          </div>

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#beaf87]">
            Painel administrativo
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[#beaf87] sm:text-5xl">
            Página em desenvolvimento
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/68 sm:text-base">
            O acesso foi realizado com sucesso. As funcionalidades internas do back-office ainda estão em construção.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mx-auto mt-9 flex h-12 items-center justify-center rounded-2xl border border-[#beaf87]/20 px-6 text-sm font-bold uppercase tracking-[0.14em] text-[#beaf87] transition hover:bg-[#beaf87] hover:text-black"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-black text-white">
      <section className="relative flex min-h-[100dvh] flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:px-14 lg:py-8 xl:px-20">
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

          <div className="absolute left-[53%] top-12 hidden h-[calc(100%-6rem)] w-px bg-gradient-to-b from-transparent via-[#beaf87]/28 to-transparent lg:block" />
          <div className="absolute left-[53%] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <div className="relative h-[420px] w-[420px]">
              <div className="absolute inset-0 rounded-full border border-[#beaf87]/10" />
              <div className="absolute inset-12 rounded-full border border-[#beaf87]/10" />
              <div className="absolute inset-24 rounded-full border border-[#beaf87]/10" />
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#beaf87]/20 to-transparent" />
            </div>
          </div>

          <div className="absolute bottom-4 right-8 hidden select-none text-[12rem] font-black leading-none tracking-[-0.08em] text-transparent opacity-80 [-webkit-text-stroke:1px_rgba(190,175,135,0.10)] lg:block xl:text-[15rem]">
            21
          </div>

          <div className="absolute right-10 top-10 hidden h-32 w-32 border-r border-t border-[#beaf87]/16 lg:block" />
          <div className="absolute bottom-10 left-10 hidden h-32 w-32 border-b border-l border-[#beaf87]/16 lg:block" />
        </div>

        <aside className="relative z-10 flex flex-col justify-start lg:min-h-[calc(100vh-4rem)] lg:justify-between lg:py-4">
          <div>
            <img
              src={CENTURY21_LOGO}
              alt="CENTURY 21"
              className="h-9 w-auto object-contain sm:h-11 lg:h-12"
            />

            <div className="mt-12 max-w-xl sm:mt-16 lg:mt-24 xl:mt-28">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-[#beaf87] sm:mb-5 sm:tracking-[0.45em] sm:text-sm">
                Back-office imobiliário
              </p>

              <h1 className="font-serif text-4xl leading-[1.05] text-[#beaf87] sm:text-6xl xl:text-7xl">
                Paulo Matos
              </h1>

              <p className="mt-3 font-serif text-2xl leading-tight text-white sm:mt-4 sm:text-4xl xl:text-[2.65rem]">
                Consultor Imobiliário
              </p>

              <div className="mt-7 flex items-center gap-4 sm:mt-9">
                <div className="h-px w-36 bg-[#beaf87] sm:w-44" />
                <div className="h-2 w-2 rounded-full bg-[#beaf87]" />
                <div className="h-px w-14 bg-[#beaf87]/35" />
              </div>
            </div>
          </div>

          <div className="mt-12 hidden max-w-[520px] lg:block">
            <div className="relative overflow-hidden rounded-[28px] border border-[#beaf87]/16 bg-[#080808]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#beaf87]/8 to-transparent" />
              <ShieldCheck className="mb-4 h-5 w-5 text-[#beaf87]" />
              <p className="text-base font-semibold text-white">Acesso protegido</p>
              <p className="mt-2 text-sm leading-6 text-white/68">Área reservada ao administrador.</p>
            </div>
          </div>
        </aside>

        <section className="relative z-10 flex items-center justify-center pb-4 pt-7 sm:pt-8 lg:min-h-[calc(100vh-4rem)] lg:justify-center lg:py-4">
          <div className="w-full max-w-md lg:-translate-x-6 xl:-translate-x-10">
            <div className="relative rounded-[1.6rem] border border-[#beaf87]/22 bg-[#0b0b0b]/95 p-5 shadow-[0_0_0_1px_rgba(190,175,135,0.04),0_28px_90px_rgba(0,0,0,0.70)] backdrop-blur sm:rounded-[2rem] sm:p-8 lg:p-9">
              <div className="pointer-events-none absolute -left-3 top-8 hidden h-20 w-px bg-gradient-to-b from-transparent via-[#beaf87]/60 to-transparent sm:block" />
              <div className="pointer-events-none absolute -right-3 bottom-8 hidden h-20 w-px bg-gradient-to-b from-transparent via-[#beaf87]/60 to-transparent sm:block" />

              <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#beaf87]">
                  Login administrativo
                </p>
                <div className="hidden h-px flex-1 bg-gradient-to-r from-[#beaf87]/35 to-transparent sm:block" />
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/78">E-mail</span>
                  <div className="flex items-center rounded-2xl border border-[#beaf87]/16 bg-black px-4 transition focus-within:border-[#beaf87] focus-within:ring-4 focus-within:ring-[#beaf87]/10">
                    <Mail className="mr-3 h-5 w-5 shrink-0 text-[#beaf87]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@exemplo.pt"
                      className="h-14 w-full min-w-0 bg-transparent text-white outline-none placeholder:text-white/28"
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/78">Palavra-passe</span>
                  <div className="flex items-center rounded-2xl border border-[#beaf87]/16 bg-black px-4 transition focus-within:border-[#beaf87] focus-within:ring-4 focus-within:ring-[#beaf87]/10">
                    <Lock className="mr-3 h-5 w-5 shrink-0 text-[#beaf87]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Introduza a palavra-passe"
                      className="h-14 w-full min-w-0 bg-transparent text-white outline-none placeholder:text-white/28"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="ml-3 rounded-full p-1 text-white/45 transition hover:text-[#beaf87]"
                      aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group flex h-14 w-full items-center justify-center rounded-2xl bg-[#beaf87] px-5 text-sm font-extrabold uppercase tracking-[0.16em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? "A iniciar sessão..." : "Entrar no painel"}
                  {!loading && <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />}
                </button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-[#beaf87]/12 bg-[#080808]/80 p-4 text-sm text-white/62 lg:hidden">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#beaf87]" />
                <div>
                  <p className="font-semibold text-white">Acesso protegido</p>
                  <p className="mt-1">Área reservada ao administrador.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
