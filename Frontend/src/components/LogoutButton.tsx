import useLogin from "../hooks/useLogin.ts";
import {useTranslation} from "react-i18next";

function LogoutButton() {
    const { logout } = useLogin();
    const { t } = useTranslation();

    function handleLogout() {
        logout();
    }

    return <button className="btn btn-secondary" onClick={handleLogout}>
        {t("logoutButton.logout")}
    </button>;
}

export default LogoutButton;