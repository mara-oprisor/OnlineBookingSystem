import {useState} from "react";
import PasswordResetService from "../service/PasswordResetService.tsx";
import {useNavigate} from "react-router-dom";

function useResetPassword() {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [isCodeError, setIsCodeError] = useState(false);
    const navigate = useNavigate();
    const passwordResetService = PasswordResetService();

    async function onSendCode(email: string): Promise<void> {
        setIsEmailError(false);
        try {
            await passwordResetService.getToken(email);
            setIsCodeSent(true);
        } catch {
            setIsEmailError(true);
        }
    }

    async function onResetPassword(email: string, token: string, newPassword: string, confirmPassword: string): Promise<void> {
        setIsCodeError(false);

        if (newPassword !== confirmPassword) {
            setIsCodeError(true);
            return;
        }

        try {
            await passwordResetService.sendNewPassword(email, newPassword, token);
            navigate("/login");
        } catch {
            setIsCodeError(true);
        }
    }

    return {
        isCodeSent,
        isEmailError,
        isCodeError,
        onSendCode,
        onResetPassword,
    };
}

export default useResetPassword;