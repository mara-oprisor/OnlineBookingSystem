import { LOGIN_ENDPOINT } from "../constants/api";
import axios from "axios";

function LoginService() {
    async function login(username: string, password: string) {
        try {
            const response = await axios.post(LOGIN_ENDPOINT, { username, password }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string;

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? error.response.data.errorMessage : error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Unknown error!";
            }

            return {
                success: false,
                role: null,
                errorMessage: errorMessage,
                token: null
            };
        }
    }

    return {
        login
    };
}

export default LoginService;
