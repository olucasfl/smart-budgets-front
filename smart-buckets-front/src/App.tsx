import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { HubDetailPage } from "./pages/HubDetailPage";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hub/:id" element={<HubDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
