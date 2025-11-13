import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { initializeSampleData } from "@/services/blockchain";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import CredentialDetails from "./pages/CredentialDetails";
import VerifyCredential from "./pages/VerifyCredential";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Initialize sample data
initializeSampleData();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Index />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/university" element={<UniversityDashboard />} />
              <Route path="/employer" element={<EmployerDashboard />} />
              <Route path="/credential/:id" element={<CredentialDetails />} />
              <Route path="/verify/:id?" element={<VerifyCredential />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
