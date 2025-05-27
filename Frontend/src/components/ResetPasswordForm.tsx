import React, {useState} from "react";
import {useTranslation} from "react-i18next";

export interface ResetPasswordProps {
    isCodeSent: boolean;
    isEmailError: boolean;
    isCodeError: boolean;
    onSendCode: (email: string) => void;
    onResetPassword: (
        email: string,
        token: string,
        newPassword: string,
        confirmPassword: string
    ) => void;
}

function ResetPasswordForm({isCodeSent, isEmailError, isCodeError, onSendCode, onResetPassword}: ResetPasswordProps) {
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { t } = useTranslation();

    function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSendCode(email);
    }

    function handleResetPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onResetPassword(email, token, newPassword, confirmPassword);
    }


    return(
        <div className="container mt-4" style={{ maxWidth: 400 }}>
            {!isCodeSent ? (
                <form onSubmit={handleEmailSubmit}>
                    <h5>{t("resetForm.enterEmailTitle")}</h5>
                    <div className="mb-3">
                        <label htmlFor="resetEmail" className="form-label">
                            {t("resetForm.labelEmail")}
                        </label>
                        <input
                            type="email"
                            id="resetEmail"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {isEmailError && (
                        <div className="text-danger mb-2">
                            {t("resetForm.errorEmailNotFound")}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100">
                        {t("resetForm.btnSendCode")}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPasswordSubmit}>
                    <h5>
                        A code has been sent to <strong>{email}</strong>
                    </h5>
                    <div className="mb-3">
                        <label htmlFor="resetCode" className="form-label">
                            {t("resetForm.labelCode6")}
                        </label>
                        <input
                            type="text"
                            id="resetCode"
                            className="form-control"
                            maxLength={6}
                            placeholder="Enter code"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newPw" className="form-label">
                            {t("resetForm.labelNewPassword")}
                        </label>
                        <input
                            type="password"
                            id="newPw"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPw" className="form-label">
                            {t("resetForm.labelConfirmPassword")}
                        </label>
                        <input
                            type="password"
                            id="confirmPw"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    {isCodeError && (
                        <div className="text-danger mb-2">
                            {t("resetForm.errorInvalidCode")}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100">
                        {t("resetForm.btnResetPassword")}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPasswordForm;