import useLogin from "../hooks/useLogin";

function LoginForm() {
    const {
        username,
        handleUsernameChange,
        password,
        handlePasswordChange,
        errorMsg,
        handleLogin,
    } = useLogin();

    return (
        <form onSubmit={handleLogin}>
            <h1>Log In</h1>
            <div className="form-floating">
                <input
                    type="text"
                    onChange={handleUsernameChange}
                    className="form-control"
                    id="floatingInput"
                    placeholder="Username"
                    value={username}
                />
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            <button type="submit" className="btn btn-primary">
                Log In
            </button>
            <a
                href="/reset_password"
                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            >
                Forgot your password?
            </a>
        </form>
    );
}

export default LoginForm;