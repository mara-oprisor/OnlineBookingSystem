import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import {useTranslation} from "react-i18next";

function AuthModal() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const { t } = useTranslation();

    return (
        <div className="auth-modal">
            <div className="d-flex mb-3">
                {(['register','login'] as const).map(m => (
                    <button
                        key={m}
                        className={`flex-fill btn ${
                            mode === m ? 'btn-outline-primary' : 'btn-light text-muted'
                        }`}
                        onClick={() => setMode(m)}
                    >
                        { t(`auth.${m}`) }
                    </button>
                ))}
            </div>
            {mode === 'register' ? <RegisterForm /> : <LoginForm />}
        </div>
    );
}

export default AuthModal;