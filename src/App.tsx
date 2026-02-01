import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/page";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
