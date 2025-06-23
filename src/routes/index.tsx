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


function BaseRoute() {
  return (
      <Routes>

      {/* Landing pages with LandingLayout */}
      <Route path="/*" element={
        <LandingLayout>
          <LandingRoute />
        </LandingLayout>
      } />
      
      {/* Dashboard with DashboardLayout */}
      <Route path="/dashboard/*" element={
        <DashboardLayout>
          <DashboardRoute />
        </DashboardLayout>
      } />
      
      {/* Admin Dashboard with AdminLayout */}
      <Route path="/admin/*" element={
        <AdminLayout>
          <AdminRoute />
        </AdminLayout>
      } />

      {/* Login, Register, Forgot Password */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default BaseRoute;