import ResetPasswordForm from "../components/ResetPasswordForm.tsx";
import useResetPassword from "../hooks/useResetPassword.ts";

function ResetPasswordPage() {
    const {isCodeSent, isEmailError, isCodeError, onSendCode, onResetPassword} = useResetPassword();

    return (
        <ResetPasswordForm
            isCodeSent={isCodeSent}
            isEmailError={isEmailError}
            isCodeError={isCodeError}
            onSendCode={onSendCode}
            onResetPassword={onResetPassword}
        />
    );
}

export default ResetPasswordPage;
