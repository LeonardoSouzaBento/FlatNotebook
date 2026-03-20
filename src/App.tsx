import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/ui/sonner.tsx";
import { Toaster } from "@/ui/toaster.tsx";
import { TooltipProvider } from "@/ui/tooltip.tsx";
import { Home, DocPage, LoginPage, NotFound } from "./pages";
import { AppProviderLayout } from "./main-layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppProviderLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/document/:id" element={<DocPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
