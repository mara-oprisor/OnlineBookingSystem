import User from "../model/User.ts";
import {ADD_USER_ENDPOINT, DELETE_USER_ENDPOINT, EDIT_USER_ENDPOINT, USER_ENDPOINT} from "../constants/api.ts";

function UserService() {

    async function getUsers(){
        const response = await fetch(USER_ENDPOINT);

        if(!response.ok) {
            throw new Error("Failed to fetch the users from the database!");
        }

        return response.json();
    }

    async function addUser(user: Omit<User, 'uuid'>) {
        const response = await fetch(ADD_USER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function updateUser(user: User) {
        const response = await fetch(`${EDIT_USER_ENDPOINT}/${user.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
    }

    async function deleteUser(id: string) {
        const response = await fetch(`${DELETE_USER_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error("Failed to delete the user!");
        }
    }

    return {
        getUsers,
        addUser,
        updateUser,
        deleteUser
    };
}

export default UserService;