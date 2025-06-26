
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "@/components/LandingPage";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import AddAsset from "./pages/AddAsset";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/portfolio" element={
            <Layout>
              <Portfolio />
            </Layout>
          } />
          <Route path="/add-asset" element={
            <Layout>
              <AddAsset />
            </Layout>
          } />
          <Route path="/analytics" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Análises</h1>
                <p className="text-slate-600">Em desenvolvimento...</p>
              </div>
            </Layout>
          } />
          <Route path="/reports" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Relatórios</h1>
                <p className="text-slate-600">Em desenvolvimento...</p>
              </div>
            </Layout>
          } />
          <Route path="/dividends" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Dividendos</h1>
                <p className="text-slate-600">Em desenvolvimento...</p>
              </div>
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Configurações</h1>
                <p className="text-slate-600">Em desenvolvimento...</p>
              </div>
            </Layout>
          } />
          <Route path="/help" element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Ajuda</h1>
                <p className="text-slate-600">Em desenvolvimento...</p>
              </div>
            </Layout>
          } />
          
          {/* Redirect old index to landing */}
          <Route path="/index" element={<Navigate to="/" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
