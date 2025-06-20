import { Route, Routes } from "react-router-dom";
import {
    Dashboard,
    Login,
    Register,
    Subcriptions,
    Contact,
    Menu,
    Admin,
    NoPage
} from "../pages";

function BaseRoute() {
  return (
    <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/subscriptions" element={<Subcriptions />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default BaseRoute;