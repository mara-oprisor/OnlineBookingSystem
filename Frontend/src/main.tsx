import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LoginForm from "./components/LoginForm.tsx";
import ClientPage from "./pages/ClientPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<App />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={
                <div className="app-container">
                    <h1>Page Not Found</h1>
                </div>
            } />
        </Routes>
    </Router>
  </StrictMode>,
)
