import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";

// Pages
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import MentalHealthAssessmentPage from "./pages/MentalHealthAssessmentPage";
import BehavioralAssessmentPage from "./pages/BehavioralAssessmentPage";
import ResourcesPage from "./pages/ResourcesPage";
import HistoryPage from "./pages/HistoryPage";
import NotFound from "./pages/NotFound";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/mental-health-assessment" element={<MentalHealthAssessmentPage />} />
              <Route path="/behavioral-assessment" element={<BehavioralAssessmentPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
