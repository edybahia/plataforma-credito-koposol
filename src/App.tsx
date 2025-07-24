import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthFlowLayout from '@/components/AuthFlowLayout'; // Importa o novo layout

// Public Pages
import AuthPage from '@/pages/AuthPage'; // Nova página unificada
import Register from '@/pages/Register'; // Será a página de 'Completar Cadastro'
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AwaitingApproval from '@/pages/AwaitingApproval';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import IntegratorsPage from '@/pages/admin/Integrators'; // Manages all integrators
import Kanban from '@/pages/admin/Kanban';
import ProposalsPage from '@/pages/admin/Proposals';
import Settings from '@/pages/admin/Settings';

// Integrator Pages
import IntegratorDashboard from '@/pages/integrator/Dashboard';
import GenerateLink from '@/pages/integrator/GenerateLink';
import IntegratorKanban from '@/pages/integrator/Kanban';
import SubmitProposal from '@/pages/integrator/SubmitProposal';



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Status Pages - Accessible only when logged in, but not the final destination */}
          <Route element={<AuthFlowLayout />}>
            <Route path="/complete-profile" element={<Register />} />
            <Route path="/awaiting-approval" element={<AwaitingApproval />} />
          </Route>

          {/* Main Protected Routes (Dashboards) */}
          <Route element={<ProtectedRoute />}>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="integrators" element={<IntegratorsPage />} />
              <Route path="kanban" element={<Kanban />} />
              <Route path="proposals" element={<ProposalsPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Integrator Routes */}
            {/* TODO: Consider creating an IntegratorLayout similar to AdminLayout */}
            <Route path="/integrator/dashboard" element={<IntegratorDashboard />} />
            <Route path="/integrator/generate-link" element={<GenerateLink />} />
            <Route path="/integrator/kanban" element={<IntegratorKanban />} />
            <Route path="/integrator/submit-proposal" element={<SubmitProposal />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
