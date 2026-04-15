import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Feedback360 from "./pages/Feedback360";
import EmployeeProfile from "./pages/EmployeeProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PerformanceProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/feedback" element={<Feedback360 />} />
              <Route path="/profile/:id" element={<EmployeeProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </PerformanceProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
