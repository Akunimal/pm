import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "./context/AppContext";
import ChatPage from "@/pages/chat";
import LanguageSelect from "@/pages/language-select";
import NotFound from "@/pages/not-found";
import React, { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLanguageSelected } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLanguageSelected) {
      setLocation("/");
    }
  }, [isLanguageSelected, setLocation]);

  if (!isLanguageSelected) {
    return null;
  }

  return <Component />;
}

function Router() {
  const { isLanguageSelected } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Si el usuario intenta acceder a /chat sin haber seleccionado idioma, redirigir a /
    if (!isLanguageSelected) {
      setLocation("/");
    }
  }, [isLanguageSelected, setLocation]);

  return (
    <Switch>
      <Route path="/" component={LanguageSelect} />
      <Route path="/chat">
        {() => <ProtectedRoute component={ChatPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;