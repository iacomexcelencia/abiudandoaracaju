import React, { Suspense } from "react";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth } from "@/hooks/use-auth";
import SpotDetails from "@/pages/spot-details";
import QRScanner from "@/pages/qr-scanner";
import LanguageSelector from "@/pages/language-selector";
import NextDestinations from "@/pages/next-destinations";
import TouristRoutes from "@/pages/tourist-routes";
import PublicTransparency from "@/pages/public-transparency";
import MeuPassaporte from "@/pages/meu-passaporte";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

// Admin Pages - Using relative imports temporarily to fix resolution issue
const AdminDashboard = React.lazy(() => import("./pages/admin/dashboard"));
const AdminSpots = React.lazy(() => import("./pages/admin/spots"));
const AdminReports = React.lazy(() => import("./pages/admin/reports"));
const AdminFeedback = React.lazy(() => import("./pages/admin/feedback"));
const AdminPassports = React.lazy(() => import("./pages/admin/passports"));
const AdminBadges = React.lazy(() => import("./pages/admin/badges"));
const AdminRoutes = React.lazy(() => import("./pages/admin/routes"));
const AdminMap = React.lazy(() => import("./pages/admin/map"));
const AdminQRCodes = React.lazy(() => import("./pages/admin/qr-codes"));
const AdminSettings = React.lazy(() => import("./pages/admin/settings"));

function Router() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
      <Switch>
        <Route path="/">
          <Redirect to="/admin" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/language/:spotId?" component={LanguageSelector} />
        <Route path="/spot/:id" component={SpotDetails} />
        <Route path="/next-destinations/:spotId?/:lang?" component={NextDestinations} />
        <Route path="/routes" component={TouristRoutes} />
        <Route path="/transparency" component={PublicTransparency} />
        <Route path="/meu-passaporte" component={MeuPassaporte} />
        <Route path="/scan" component={QRScanner} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin">
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        </Route>
        <Route path="/admin/spots">
          <RequireAuth>
            <AdminSpots />
          </RequireAuth>
        </Route>
        <Route path="/admin/reports">
          <RequireAuth>
            <AdminReports />
          </RequireAuth>
        </Route>
        <Route path="/admin/feedback">
          <RequireAuth>
            <AdminFeedback />
          </RequireAuth>
        </Route>
        <Route path="/admin/passports">
          <RequireAuth>
            <AdminPassports />
          </RequireAuth>
        </Route>
        <Route path="/admin/badges">
          <RequireAuth>
            <AdminBadges />
          </RequireAuth>
        </Route>
        <Route path="/admin/routes">
          <RequireAuth>
            <AdminRoutes />
          </RequireAuth>
        </Route>
        <Route path="/admin/map">
          <RequireAuth>
            <AdminMap />
          </RequireAuth>
        </Route>
        <Route path="/admin/qr-codes">
          <RequireAuth>
            <AdminQRCodes />
          </RequireAuth>
        </Route>
        <Route path="/admin/settings">
          <RequireAuth>
            <AdminSettings />
          </RequireAuth>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
