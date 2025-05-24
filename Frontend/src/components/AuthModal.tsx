import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthModal() {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <div className="auth-modal">
            <div className="d-flex mb-3">
                <button
                    className={`flex-fill btn ${
                        mode === "register" ? "btn-outline-primary" : "btn-light text-muted"
                    }`}
                    onClick={() => setMode("register")}
                >
                    Register
                </button>
                <button
                    className={`flex-fill btn ${
                        mode === "login" ? "btn-outline-primary" : "btn-light text-muted"
                    }`}
                    onClick={() => setMode("login")}
                >
                    Login
                </button>
            </div>

            {mode === "register" ? <RegisterForm /> : <LoginForm />}
        </div>
    );
}

export default AuthModal;