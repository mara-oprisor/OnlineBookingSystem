import {LOGIN_ENDPOINT} from "../constants/api.ts";

function LoginService() {
    async function login(username: string, password: string) {
        try {
            const response = await fetch(LOGIN_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                role: null,
                error: error instanceof Error? error.message : "Unknown error!"
            };
        }
    }

    return {
        login
    };
}

export default LoginService;