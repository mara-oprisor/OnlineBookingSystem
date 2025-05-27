import ResetPasswordForm from "../components/ResetPasswordForm.tsx";
import useResetPassword from "../hooks/useResetPassword.ts";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

function ResetPasswordPage() {
    const {isCodeSent, isEmailError, isCodeError, onSendCode, onResetPassword} = useResetPassword();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <div className="d-flex justify-content-start p-3">
                <Button variant="link" onClick={() => navigate(-1)}>
                    {t("bookingPage.btnBack")}
                </Button>
            </div>
            <ResetPasswordForm
                isCodeSent={isCodeSent}
                isEmailError={isEmailError}
                isCodeError={isCodeError}
                onSendCode={onSendCode}
                onResetPassword={onResetPassword}
            />
        </>
    );
}

export default ResetPasswordPage;
