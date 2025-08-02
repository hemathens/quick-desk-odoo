import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AskQuestion from "./pages/AskQuestion";
import AdminPanel from "./pages/AdminPanel";
import AgentPanel from "./pages/AgentPanel";
import Profile from "./pages/Profile";
import QuestionDetail from "./pages/QuestionDetail";
import TicketDetail from "./pages/TicketDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/agent" element={<AgentPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
