import DashboardLayout from "@/layouts/DashboardLayout";
import CreateProjectPage from "@/pages/CreateProjectPage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import ProjectListPage from "@/pages/ProjectListPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AppRoutes = () => {
    return(
       <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/project/create" element={<CreateProjectPage />} />
          <Route path="/project/list" element={<ProjectListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
};

export default AppRoutes;