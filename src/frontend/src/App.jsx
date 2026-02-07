import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import theme from './theme';
import { LayoutProvider } from './contexts/LayoutContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RealtimeProvider } from './providers/RealtimeProvider';
import { ModeProvider } from './providers/ModeProvider';
import DashboardRefactored from './pages/DashboardRefactored';
import ProposalPage from './pages/ProposalPage';
import ProposalsListPage from './pages/ProposalsListPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import ProposalViewPublicPage from './pages/ProposalViewPublicPage';
import ChatPage from './pages/ChatPage';
import LeadsPage from './pages/LeadsPage';
import LeadsListPage from './pages/LeadsListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import ClientsPage from './pages/ClientsPage';
import ProjetosPage from './pages/ProjetosPage';
import DimensionamentoPage from './pages/DimensionamentoPage';
import CronogramaPage from './pages/CronogramaPage';
import KitsPage from './pages/KitsPage';
import SettingsPage from './pages/SettingsPage';
import SalesWorkspace from './pages/SalesWorkspace';
import LoginPage from './pages/LoginPageAdvanced';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { CopilotProvider } from './context/CopilotContext';
import { CopilotSidebar } from './components/copilot/CopilotSidebar';
import { GlobalSearch, useGlobalSearchHotkey } from './components/dashboard/GlobalSearch';
import { UnifiedShell } from './shell/UnifiedShell';
import { CopilotBar } from './components/copilot/CopilotBar';
import '@mantine/core/styles.css';

// Componente para proteger rotas privadas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#F1F5F9] text-petroleum-600">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout protegido que inclui a Sidebar e Copilot
const ProtectedLayout = ({ children }) => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  useGlobalSearchHotkey(() => setSearchOpen(true));
  return (
    <CopilotProvider>
      <LayoutProvider>
        <UnifiedShell>
          {children}
        </UnifiedShell>
        <CopilotSidebar />
        <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </LayoutProvider>
    </CopilotProvider>
  );
};

function App() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <RealtimeProvider>
          <ModeProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/view-proposal/:slug" element={<ProposalViewPublicPage />} />

                {/* Private Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <DashboardRefactored />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <DashboardRefactored />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/funnel" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <LeadsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/leads/:id" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <LeadDetailPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/leads" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <LeadsListPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/clients" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ClientsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/proposals" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProposalsListPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/proposals/new" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProposalPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/proposals/:id" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProposalDetailPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChatPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/projetos" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProjetosPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dimensionamento" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <DimensionamentoPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/cronograma" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <CronogramaPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/kits" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <KitsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <SettingsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />

                <Route path="/workspace" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <SalesWorkspace />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ModeProvider>
        </RealtimeProvider>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
