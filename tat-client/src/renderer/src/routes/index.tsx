import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
    return(
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
    );
};

export default AppRoutes;