import { DashboardUser, NoPage } from "@/pages";
import { Route, Routes } from "react-router-dom";

function DashboardRoute() {
    return (
        <Routes>
            <Route path="/" element={<DashboardUser />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
    )
}

export default DashboardRoute;