import {USER_ENDPOINT, USERS_ENDPOINT, USERS_FILTER_ENDPOINT} from "../constants/api";
import User from "../model/User";
import UserFilter from "../model/UserFilter";
import axios from "axios";

function UserService() {

    async function getUsers(): Promise<User[]> {
        try {
            const response = await axios.get<User[]>(USERS_ENDPOINT);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch users from the database!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function getUserByUsername(username: string): Promise<User> {
        try{
            const response = await axios.get<User>(`${USER_ENDPOINT}/${username}`);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch the user with the given username!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function filterUsers(filter: UserFilter): Promise<User[]> {
        try {
            const response = await axios.post<User[]>(USERS_FILTER_ENDPOINT, filter, {
                headers: { "Content-Type": "application/json" }
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to filter users!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function addUser(user: Omit<User, 'uuid'>): Promise<User> {
        try {
            const response = await axios.post<User>(USER_ENDPOINT, user, {
                headers: { "Content-Type": "application/json" }
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to add user!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function updateUser(user: User): Promise<User> {
        try {
            const response = await axios.put<User>(`${USER_ENDPOINT}/${user.uuid}`, user, {
                headers: { "Content-Type": "application/json" }
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to update user!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function deleteUser(id: string): Promise<void> {
        try {
            await axios.delete(`${USER_ENDPOINT}/${id}`);
        } catch {
            throw new Error("Failed to delete the user!");
        }
    }

    return {
        getUsers,
        getUserByUsername,
        filterUsers,
        addUser,
        updateUser,
        deleteUser
    };
}

export default UserService;
