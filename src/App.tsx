
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthPage } from "@/components/auth/AuthPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Layout>
                  <Portfolio />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/add-asset" element={
              <ProtectedRoute>
                <Layout>
                  <AddAsset />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Análises</h1>
                    <p className="text-slate-600">Em desenvolvimento...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Relatórios</h1>
                    <p className="text-slate-600">Em desenvolvimento...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dividends" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Dividendos</h1>
                    <p className="text-slate-600">Em desenvolvimento...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Configurações</h1>
                    <p className="text-slate-600">Em desenvolvimento...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Ajuda</h1>
                    <p className="text-slate-600">Em desenvolvimento...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect old routes */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
