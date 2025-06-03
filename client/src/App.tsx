import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Simulator from "@/pages/simulator";
import Documentation from "@/components/Documentation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Simulator} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/docs" component={Documentation} />
      <Route component={() => <div>Page not found</div>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
