import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import GroupDetail from "./pages/GroupDetail";
import ParticipantResult from "./pages/ParticipantResult";
import AllResults from "./pages/AllResults";
import RoletaDemo from "./pages/RoletaDemo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/demo-roleta" component={RoletaDemo} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create" component={CreateGroup} />
      <Route path="/group/:id" component={GroupDetail} />
      <Route path="/group/:id/results" component={AllResults} />
      <Route path="/result/:token" component={ParticipantResult} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
