import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'
import Dashboard from './pages/Dashboard.tsx'
import LoginForm from "./components/LoginForm.tsx";
import SalonsPage from "./pages/SalonsPage.tsx";
import BookingPage from "./pages/BookingPage.tsx";
import 'bootstrap/dist/css/bootstrap.css';
import AuthenticatedRouteGuard from "./security/AuthenticatedRouteGuard.tsx";
import './security/axiosConfig.ts';
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path={"/forbidden"} element={
                <div className="app-container">
                    <h1>403 - Access forbidden</h1>
                </div>
            } />
            <Route path="/reset_password" element={<ResetPasswordPage />} />
            <Route element={<AuthenticatedRouteGuard requiredRole={"CLIENT"} />}>
                <Route path="/client" element={<SalonsPage />} />
                <Route path="/book/:salonId" element={<BookingPage />} />
            </Route>
            <Route element={<AuthenticatedRouteGuard requiredRole={"ADMIN"} />}>
                <Route path="/admin" element={<Dashboard />} />
            </Route>
            <Route path="*" element={
                <div className="app-container">
                    <h1>404 - Page Not Found</h1>
                </div>
            } />
        </Routes>
    </Router>
  </StrictMode>,
)
