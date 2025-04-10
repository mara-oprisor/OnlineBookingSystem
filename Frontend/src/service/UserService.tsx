import {
    ADD_USER_ENDPOINT,
    DELETE_USER_ENDPOINT,
    EDIT_USER_ENDPOINT,
    USER_ENDPOINT,
    USER_FILTER_ENDPOINT
} from "../constants/api";
import User from "../model/User";
import UserFilter from "../model/UserFilter.ts";

function UserService() {

    async function getUsers(): Promise<User[]> {
        const response = await fetch(USER_ENDPOINT);

        if (!response.ok) {
            throw new Error("Failed to fetch users from the database!");
        }

        return response.json();
    }

    async function filterUsers(filter: UserFilter): Promise<User[]> {
        const response = await fetch(USER_FILTER_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filter),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        return response.json();
    }

    async function addUser(user: Omit<User, 'uuid'>): Promise<User> {
        const response = await fetch(ADD_USER_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function updateUser(user: User): Promise<User> {
        const response = await fetch(`${EDIT_USER_ENDPOINT}/${user.uuid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function deleteUser(id: string): Promise<void> {
        const response = await fetch(`${DELETE_USER_ENDPOINT}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete the user!");
        }
    }

    return {
        getUsers,
        filterUsers,
        addUser,
        updateUser,
        deleteUser
    };
}

export default UserService;
