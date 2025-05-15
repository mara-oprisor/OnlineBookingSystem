import useRegister from "../hooks/useRegister";
import getPasswordRules from "../model/PasswordRule.ts";
import PasswordStrengthMeter from "./PasswordStrengthMeter.tsx";

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
    const results = rules.map(rule => ({
        rule,
        passed: rule.test(password1)
    }));

    const passwordsMatch = password1 === password2;
    const allRulesPass = results.every(r => r.passed);

    return (
        <div className="container-fluid py-5 d-flex justify-content-center">
            <form onSubmit={handleRegister} className="p-5 bg-light rounded shadow mx-auto" style={{ minWidth: '900px', maxWidth: '1700px' }}>
                <h1 className="h3 mb-4 text-center">Register</h1>

                {errorMsg && (
                    <div className="alert alert-danger mb-4">
                        {errorMsg}
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-12 col-md-5 mb-3">
                        <div className="form-floating">
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                style={{ width: '100%', minWidth: '350px' }}
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-5 offset-md-2 mb-3">
                        <div className="form-floating">
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                style={{ width: '100%', minWidth: '350px' }}
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <ul className="list-unstyled mb-3" style={{ lineHeight: 1.8 }}>
                        {results.map(({ rule, passed }) => (
                            <li key={rule.id} className="d-flex align-items-start mb-2">
                                <span className={`me-2 fs-5 ${passed ? "text-success" : "text-muted"}`}>
                                    {passed ? "✔" : "○"}
                                </span>
                                <small className={passed ? "" : "text-muted"}>
                                    {rule.label}
                                </small>
                            </li>
                        ))}
                    </ul>
                    <PasswordStrengthMeter password={password1} />
                </div>

                <div className="row mb-4">
                    <div className="col-12 col-md-5 mb-3">
                        <div className="form-floating">
                            <input
                                id="password1"
                                type="password"
                                className="form-control"
                                style={{ width: '100%', minWidth: '350px' }}
                                placeholder="Password"
                                value={password1}
                                onChange={handlePassword1Change}
                                required
                            />
                            <label htmlFor="password1">Password</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-5 offset-md-2 mb-3">
                        <div className="form-floating">
                            <input
                                id="password2"
                                type="password"
                                className="form-control"
                                style={{ width: '100%', minWidth: '350px' }}
                                placeholder="Confirm Password"
                                value={password2}
                                onChange={handlePassword2Change}
                                required
                            />
                            <label htmlFor="password2">Confirm Password</label>
                            {!passwordsMatch && password2 && (
                                <div className="text-danger small mt-1">
                                    Passwords must match
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-5 mb-3">
                        <label htmlFor="userType" className="form-label">
                            User Type
                        </label>
                        <select
                            id="userType"
                            className="form-select"
                            style={{ width: '100%', minWidth: '350px' }}
                            value={userType}
                            onChange={handleUserTypeChange}
                        >
                            <option value="CLIENT">Client</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-5 offset-md-2 d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg py-2"
                            style={{ width: '350px', height: '70px'}}
                            disabled={!(allRulesPass && passwordsMatch)}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;