import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}
