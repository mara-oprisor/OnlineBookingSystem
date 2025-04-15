import useLogin from "../hooks/useLogin.ts";

function LogoutButton() {
    const { logout } = useLogin();

    function handleLogout() {
        logout();
    }

    return <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;