import useRegister from "../hooks/useRegister";
import getPasswordRules from "../model/PasswordRule";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import {useTranslation} from "react-i18next";

function RegisterForm() {
    const {
        username,
        email,
        password1,
        password2,
        userType,
        errorMsg,
        handleUsernameChange,
        handleEmailChange,
        handlePassword1Change,
        handlePassword2Change,
        handleUserTypeChange,
        handleRegister,
    } = useRegister();

    const rules = getPasswordRules();
    const results = rules.map((rule) => ({
        rule,
        passed: rule.test(password1),
    }));

    const passwordsMatch = password1 === password2;
    const allRulesPass = results.every((r) => r.passed);
    const { t } = useTranslation();

    return (
        <div className="register-form-container">
            <form onSubmit={handleRegister}>
                <h1>{t("registerForm.title")}</h1>

                {errorMsg && <div className="alert alert-danger mb-4">{errorMsg}</div>}

                <div className="row mb-4">
                    <div className="col-12 col-md-6 mb-3">
                        <div className="form-floating">
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            <label htmlFor="username">{t("registerForm.labelUsername")}</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <div className="form-floating">
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            <label htmlFor="email">{t("registerForm.labelEmail")}</label>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <ul className="list-unstyled mb-3">
                        {results.map(({ rule, passed }) => (
                            <li key={rule.id} className="d-flex align-items-start mb-2">
                <span className={`me-2 fs-5 ${passed ? "text-success" : "text-muted"}`}>
                  {passed ? "✔" : "○"}
                </span>
                                <small className={passed ? "" : "text-muted"}>{rule.label}</small>
                            </li>
                        ))}
                    </ul>
                    <PasswordStrengthMeter password={password1} />
                </div>

                <div className="row mb-4">
                    <div className="col-12 col-md-6 mb-3">
                        <div className="form-floating">
                            <input
                                id="password1"
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password1}
                                onChange={handlePassword1Change}
                                required
                            />
                            <label htmlFor="password1">{t("registerForm.labelPassword")}</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <div className="form-floating">
                            <input
                                id="password2"
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={password2}
                                onChange={handlePassword2Change}
                                required
                            />
                            <label htmlFor="password2">{t("registerForm.labelConfirmPassword")}</label>
                            {!passwordsMatch && password2 && (
                                <div className="text-danger small mt-1">{t("registerForm.errorPasswordsMatch")}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="userType" className="form-label">
                            {t("registerForm.labelUserType")}
                        </label>
                        <select
                            id="userType"
                            className="form-select"
                            value={userType}
                            onChange={handleUserTypeChange}
                        >
                            <option value="CLIENT">{t("registerForm.optionClient")}</option>
                            <option value="ADMIN">{t("registerForm.optionAdmin")}</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-6 d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm py-1"
                            disabled={!(allRulesPass && passwordsMatch)}
                        >
                            {t("registerForm.btnRegister")}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;