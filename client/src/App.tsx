import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

import CreateClassroom from "./pages/CreateClassroom";
import JoinClassroom from "./pages/JoinClassroom";
import MyClassrooms from "./pages/MyClassrooms";
import ClassroomDetail from "./pages/ClassroomDetail";
import MyGrades from "./pages/MyGrades";
import TeacherStudents from "./pages/TeacherStudents";

import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";

import Navbar from "./components/Navbar";
import AdminAuditLogs from "./pages/AdminAuditLogs";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Footer from "./components/Footer";
import AdminSystem from "./pages/admin/AdminSystem";
import FeedbackPage from "./pages/FeedbackPage";
import ContactPage from "./pages/ContactPage";
import AdminInboxPage from "./admin/pages/AdminInboxPage";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import CookiePolicyPage from "./pages/cookies";
import HelpCenterPage from "./pages/help";
import Unsubscribe from "./pages/Unsubscribe";
import NewsletterPage from "./admin/newsletter/NewsletterPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import BlogPage from "./pages/admin/blog/BlogPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import SitemapPage from "./pages/SiteMap";
import AccessibilityPage from "./pages/Accessibility";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function AppRoutes() {
  const location = useLocation();

  const hideLayoutRoutes = ["/login", "/register", "/dashboard", "/admin", "/verify-email" , "/forgot-password", "/verify-otp", "/reset-password"];

  const shouldHideLayout = hideLayoutRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />

        {/* Dashboard layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="classrooms/my" element={<MyClassrooms />} />
          <Route path="classrooms/:id" element={<ClassroomDetail />} />
          <Route path="classrooms/create" element={<CreateClassroom />} />
          <Route path="classrooms/join" element={<JoinClassroom />} />
          <Route path="grades" element={<MyGrades />} />
          <Route path="students" element={<TeacherStudents />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="system" element={<AdminSystem />} />
          <Route path="inbox" element={<AdminInboxPage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="blogs" element={<BlogPage />} />
        </Route>

        {/* 404 Catch-All - Must be at the very bottom */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}