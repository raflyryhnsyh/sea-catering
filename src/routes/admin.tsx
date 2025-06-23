import NoPage from "@/pages/Error";
import MenuPage from "../pages/Dashboard/admin/menu";
import OrdersPage from "../pages/Dashboard/admin/orders";
import UsersPage from "../pages/Dashboard/admin/users";
import HomeAdmin from "@/pages/Dashboard/admin/home";
import { Route, Routes } from "react-router-dom";

function AdminRoute() {
    return (
        <Routes>
            <Route path="/" element={<HomeAdmin />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
    )
}

export default AdminRoute;