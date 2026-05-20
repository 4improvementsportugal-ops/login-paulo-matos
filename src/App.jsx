import { Routes, Route } from "react-router";
import ClienteHomeCentury21 from "./pages/ClienteHomeCentury21";
import Century21Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ClienteHomeCentury21 />} />
      <Route path="/admin/login" element={<Century21Login />} />
    </Routes>
  );
}

export default App;