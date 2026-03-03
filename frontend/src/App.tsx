import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import EmergencyOverlay from "@/components/EmergencyOverlay";
import Dashboard from "@/pages/Dashboard";
import NavigatePage from "@/pages/Navigate";
import ClassPulse from "@/pages/ClassPulse";
import ClassDetail from "@/pages/ClassDetail";
import Emergency from "@/pages/Emergency";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { useApp } from "@/context/AppContext";
import { Navigate as RouterNavigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <RouterNavigate to="/login" replace />;
  return <>{children}</>;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Navbar />
          <EmergencyOverlay />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/navigate" element={<ProtectedRoute><NavigatePage /></ProtectedRoute>} />
            <Route path="/classpulse" element={<ProtectedRoute><ClassPulse /></ProtectedRoute>} />
            <Route path="/classpulse/:roomId" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
