import useLogin from "../hooks/useLogin.ts";

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
            <h1 className="h3 mb-3 fw-normal">Log In</h1>
            <div className="form-floating">
                <input
                    type="text"
                    onChange={handleUsernameChange}
                    className="form-control"
                    id="floatingInput"
                    placeholder="Username"
                    value={username}/>
                <label htmlFor="floatingInput">Username</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <button
                type="submit"
                className="btn btn-primary w-100 py-2">Log In
            </button>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        </form>
    );
}

export default LoginForm;