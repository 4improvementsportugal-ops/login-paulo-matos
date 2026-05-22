import { Routes, Route } from "react-router";
import ClienteHomeCentury21 from "./pages/ClienteHomeCentury21";
import CreditoHabitacaoCentury21 from "./pages/CreditoHabitacaoCentury21";
import Century21Login from "./pages/Login";
import PainelAdminCentury21 from "./pages/PainelAdminCentury21";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClienteHomeCentury21 />} />
      <Route path="/credito-habitacao" element={<CreditoHabitacaoCentury21 />} />
      <Route path="/admin/login" element={<Century21Login />} />
      <Route path="/admin/painel" element={<PainelAdminCentury21 />} />
    </Routes>
  );
}

export default App;