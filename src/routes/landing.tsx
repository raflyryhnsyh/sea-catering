import { Route, Routes } from "react-router-dom";
import {
    Home,
    Login,
    Register,
    Subcriptions,
    Contact,
    Menu,
    NoPage
} from "../pages";


function LandingRoute() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscriptions" element={<Subcriptions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default LandingRoute;