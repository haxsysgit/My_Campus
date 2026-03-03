import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import EmergencyOverlay from "@/components/EmergencyOverlay";
import Dashboard from "@/pages/Dashboard";
import Navigate from "@/pages/Navigate";
import ClassPulse from "@/pages/ClassPulse";
import ClassDetail from "@/pages/ClassDetail";
import Emergency from "@/pages/Emergency";
import NotFound from "@/pages/NotFound";

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/navigate" element={<Navigate />} />
            <Route path="/classpulse" element={<ClassPulse />} />
            <Route path="/classpulse/:roomId" element={<ClassDetail />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
