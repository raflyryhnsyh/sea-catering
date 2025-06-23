import { Route, Routes } from "react-router-dom";
import LandingRoute from "./landing";
import LandingLayout from "@/layouts/LandingLayout";
import DashboardRoute from "./dashboard";
import AdminLayout from "@/layouts/AdminLayout";
import AdminRoute from "./admin";
import DashboardLayout from "@/layouts/DashboardLayout";


function BaseRoute() {
  return (
      <Routes>
        <Route path="/*" element={
          <LandingLayout>
            <LandingRoute />
          </LandingLayout>
        } />
        
        <Route path="/dashboard/*" element={
          <DashboardLayout>
            <DashboardRoute />
          </DashboardLayout>
        } />
        
        <Route path="/admin/*" element={
          <AdminLayout>
            <AdminRoute />
          </AdminLayout>
        } />
    </Routes>
  );
}

export default BaseRoute;