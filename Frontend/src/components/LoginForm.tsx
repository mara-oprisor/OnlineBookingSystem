import useLogin from "../hooks/useLogin";
import {useTranslation} from "react-i18next";

function LoginForm() {
    const {
        username,
        handleUsernameChange,
        password,
        handlePasswordChange,
        errorMsg,
        handleLogin,
    } = useLogin();
    const { t } = useTranslation();

    return (
        <form onSubmit={handleLogin}>
            <h1>{t("loginForm.title")}</h1>
            <div className="form-floating">
                <input
                    type="text"
                    onChange={handleUsernameChange}
                    className="form-control"
                    id="floatingInput"
                    placeholder={t("loginForm.username")}
                    value={username}
                />
                <label htmlFor="floatingInput">{t("loginForm.username")}</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="form-control"
                    id="floatingPassword"
                    placeholder={t("loginForm.password")}
                    value={password}
                />
                <label htmlFor="floatingPassword">{t("loginForm.password")}</label>
            </div>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            <button type="submit" className="btn btn-primary">
                {t("loginForm.btnLogin")}
            </button>
            <a
                href="/reset_password"
                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            >
                {t("loginForm.forgotPassword")}
            </a>
        </form>
    );
}

export default LoginForm;