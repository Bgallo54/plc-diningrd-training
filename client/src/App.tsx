import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "./components/app-layout";
import Dashboard from "./pages/dashboard";
import ModulePage from "./pages/module-page";
import ResidentGuide from "./pages/resident-guide";
import KnowledgeChecks from "./pages/knowledge-checks";
import ManagerDashboard from "./pages/manager-dashboard";
import NotFound from "./pages/not-found";

function AppRouter() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/module/:id" component={ModulePage} />
        <Route path="/resident-guide" component={ResidentGuide} />
        <Route path="/knowledge-checks" component={KnowledgeChecks} />
        <Route path="/manager" component={ManagerDashboard} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router hook={useHashLocation}>
        <AppRouter />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
