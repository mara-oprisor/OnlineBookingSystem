import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css";
import './App.css'
import Dashboard from './pages/Dashboard.tsx'
import SalonsPage from "./pages/SalonsPage.tsx";
import BookingPage from "./pages/BookingPage.tsx";
import 'bootstrap/dist/css/bootstrap.css';
import AuthenticatedRouteGuard from "./security/AuthenticatedRouteGuard.tsx";
import './security/axiosConfig.ts';
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import AuthModal from "./components/AuthModal.tsx";
import MyBookingsPage from "./pages/MyBookingsPage.tsx";
import BookingPaymentPage from "./pages/BookingPaymentPage.tsx";
import MyLoyaltyPage from "./pages/MyLoyaltyPointsPage.tsx";
import AIChatPage from "./pages/AIChatPage.tsx";
import './i18n';
import LanguageSelector from "./components/LanguageSeletor.tsx";
import ReminderProvider from "./components/ReminderProvider.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ReminderProvider>
            <Router>
                <div className="app-header d-flex justify-content-end p-2">
                    <LanguageSelector/>
                </div>

                <Routes>
                    <Route path="/" element={<Navigate to="/auth"/>}/>
                    <Route path="/auth" element={<AuthModal/>}/>
                    <Route path={"/forbidden"} element={
                        <div className="container-fluid">
                            <h1>403 - Access forbidden</h1>
                        </div>
                    }/>
                    <Route path="/reset_password" element={<ResetPasswordPage/>}/>
                    <Route element={<AuthenticatedRouteGuard requiredRole={"CLIENT"}/>}>
                        <Route path="/salons" element={<SalonsPage/>}/>
                        <Route path="/my_bookings" element={<MyBookingsPage/>}/>
                        <Route path="/book/:salonId" element={<BookingPage/>}/>
                        <Route path="/payment" element={<BookingPaymentPage/>}/>
                        <Route path="/loyalty-points" element={<MyLoyaltyPage/>}/>
                        <Route path="/ai-chat" element={<AIChatPage/>}/>
                    </Route>
                    <Route element={<AuthenticatedRouteGuard requiredRole={"ADMIN"}/>}>
                        <Route path="/admin" element={<Dashboard/>}/>
                    </Route>
                    <Route path="*" element={
                        <div className="app-fluid">
                            <h1>404 - Page Not Found</h1>
                        </div>
                    }/>
                </Routes>
            </Router>
        </ReminderProvider>
    </StrictMode>
)
