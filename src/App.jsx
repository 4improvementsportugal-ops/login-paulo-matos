import { Routes, Route } from "react-router";
import ClienteHomeCentury21 from "./pages/ClienteHomeCentury21";
import CreditoHabitacaoCentury21 from "./pages/CreditoHabitacaoCentury21";
import Century21Login from "./pages/Login";
import PainelAdminCentury21 from "./pages/PainelAdminCentury21";
import GestaoPostsCentury21 from "./pages/GestaoPostsCentury21";
import ApoioJuridicoCentury21 from "./pages/ApoioJuridicoCentury21";
import PoliticaPrivacidadeCookiesCentury21 from "./pages/PoliticaPrivacidadeCookiesCentury21";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClienteHomeCentury21 />} />

      <Route
        path="/credito-habitacao"
        element={<CreditoHabitacaoCentury21 />}
      />

      <Route
        path="/apoio-juridico"
        element={<ApoioJuridicoCentury21 />}
      />

      <Route
        path="/apoio-juridico/:slug"
        element={<ApoioJuridicoCentury21 />}
      />

      <Route path="/admin/login" element={<Century21Login />} />

      <Route
        path="/admin/painel"
        element={<PainelAdminCentury21 />}
      />

      <Route
        path="/admin/posts"
        element={<GestaoPostsCentury21 />}
      />

      <Route
  path="/politica-de-privacidade-e-cookies"
  element={<PoliticaPrivacidadeCookiesCentury21 />}
/>
    </Routes>


    
  );
}

export default App;