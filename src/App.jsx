import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import VehicleDetail from "./pages/VehicleDetail";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="bg-white text-slate-900 flex flex-col min-h-screen overflow-x-hidden font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:slug" element={<VehicleDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
