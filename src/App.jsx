import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import About from "./About";
import Properties from "./Properties";
import Services from "./Services";
import Projects from "./Projects";
import ProjectDetail from "./ProjectDetail";
import PropertyDetails from "./PropertyDetails";
import Contact from "./Contact";
import NoPage from "./NoPage";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import PropertiesManagement from "./components/admin/PropertiesManagement";
import PropertyForm from "./components/admin/PropertyForm";
import ProjectsManagement from "./components/admin/ProjectsManagement";
import Users from "./components/admin/Users";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="properties" element={<Properties />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/completed" element={<Projects type="completed" />} />
            <Route path="projects/ongoing" element={<Projects type="ongoing" />} />
            <Route path="projects/upcoming" element={<Projects type="upcoming" />} />
            <Route path="project/:id" element={<ProjectDetail />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="properties" element={<PropertiesManagement />} />
              <Route path="properties/add" element={<PropertyForm />} />
              <Route path="properties/edit/:id" element={<PropertyForm />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="projects/add" element={<PropertyForm />} />
              <Route path="projects/edit/:id" element={<PropertyForm />} />
              <Route path="users" element={<Users />} />
              {/* Add more admin routes here as needed */}
            </Route>

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;