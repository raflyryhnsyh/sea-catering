import { Route, Routes } from "react-router-dom";
import {
    Home,
    DashboardUser,
    Login,
    Register,
    Subcriptions,
    Contact,
    Menu,
    DashboardAdmin,
    NoPage
} from "../pages";

function BaseRoute() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/subscriptions" element={<Subcriptions />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/dashboard-user" element={<DashboardUser />} />
    <Route path="/dashboard-admin" element={<DashboardAdmin />} />
    <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default BaseRoute;