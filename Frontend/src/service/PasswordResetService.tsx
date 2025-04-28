import axios from "axios";
import {RESET_PASSWORD_ENDPOINT, SEND_RESET_TOKEN_ENDPOINT} from "../constants/api.ts";

function PasswordResetService() {
    async function getToken(email: string): Promise<void> {
        try{
            await axios.post<string>(SEND_RESET_TOKEN_ENDPOINT, email,{
                    headers: { "Content-Type": "application/json" }
                });

        } catch (error: unknown) {
            let errorMessage: string = "Failed to send the code!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function sendNewPassword(email: string, password: string, token: string) {
        try {
            await axios.post<string>(RESET_PASSWORD_ENDPOINT, { email, password, token }, {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error: unknown) {
            let errorMessage: string = "Failed to update the password!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    return {
        getToken,
        sendNewPassword
    }
}

export default PasswordResetService;