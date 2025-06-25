// filepath: d:\Codelabs\COMPFEST_SEA_17\Submission\sea-catering-fe\src\routes\index.tsx
import { Route, Routes } from "react-router-dom";
import LandingRoute from "./landing";
import LandingLayout from "@/layouts/LandingLayout";
import DashboardRoute from "./dashboard";
import AdminLayout from "@/layouts/AdminLayout";
import AdminRoute from "./admin";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { NoPage } from "@/pages";
import ForgotPassword from "@/pages/ForgotPassword";
import { AuthProvider } from "@/hooks/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

function BaseRoute() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing pages - auth context available */}
        <Route path="/*" element={
          <LandingLayout>
            <LandingRoute />
          </LandingLayout>
        } />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardRoute />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Protected Admin */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminRoute />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<NoPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default BaseRoute;