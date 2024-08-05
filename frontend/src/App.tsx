import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import NavigationbarComp from "./components/navigation/navigation";
import CardsPage from "./pages/cardsPage";
import HomePage from "./pages/homePage";
import BuilderPage from "./pages/builderPage";
import DecksPage from "./pages/decksPage";
import CardPage from "./pages/cardPage";

export default function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <NavigationbarComp />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/card/:cardId" element={<CardPage />} />
      </Routes>
    </NextUIProvider>
  );
}
