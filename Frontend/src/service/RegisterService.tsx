import User from "../model/User.ts";
import axios from "axios";
import {REGISTER_ENDPOINT} from "../constants/api.ts";

function RegisterService() {
    async function registerUser(user: Omit<User, 'uuid'>): Promise<User> {
        try {
            const response = await axios.post<User>(REGISTER_ENDPOINT, user, {
                headers: { "Content-Type": "application/json" }
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to register!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    return {
        registerUser
    };
}

export default RegisterService;