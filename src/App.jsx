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
import AOS from 'aos';
import 'aos/dist/aos.css';

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import AdminProperties from "./components/admin/Properties";
import AddProperty from "./components/admin/AddProperty";
import AdminProjects from "./components/admin/Projects";
// import Inquiries from "./components/admin/Inquiries";
import Users from "./components/admin/Users";

const App = () => {
  return (
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
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/new" element={<AddProperty />} />
            <Route path="properties/edit/:id" element={<AddProperty />} />
            <Route path="projects" element={<AdminProjects />} />
            {/* <Route path="inquiries" element={<Inquiries />} /> */}
            <Route path="users" element={<Users />} />
            {/* Add more admin routes here as needed */}
          </Route>

          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;