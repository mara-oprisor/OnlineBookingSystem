import User from "../model/User";
import UserService from "../service/UserService";
import React from "react";

export interface UseUserActionProps {
    setData: React.Dispatch<React.SetStateAction<User[]>>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    selectedUser: User | null;
}

function useUserCRUD({ setData, setSelectedUser, selectedUser }: UseUserActionProps) {
    const userService = UserService();

    function parseErrorMessage(errorMessage: string): string {
        try {
            const errors = JSON.parse(errorMessage);
            return Object.values(errors).join("\n");
        } catch {
            return errorMessage;
        }
    }

    async function handleAddUser(user: User): Promise<void> {
        try {
            const addedUser = await userService.addUser(user);
            setData(prevData => [...prevData, addedUser]);
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error adding the user:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to add user:\n${detailedMessage}`);
            throw error;
        }
    }

    async function handleUpdateUser(user: User): Promise<void> {
        if (!selectedUser) return;
        try {
            const updatedUser = await userService.updateUser(user);
            setData(prevData =>
                prevData.map(u => (u.uuid === selectedUser.uuid ? updatedUser : u))
            );
        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("Error updating the user:", error);
            const detailedMessage = parseErrorMessage(errorMessage);
            alert(`Failed to update user:\n${detailedMessage}`);
            throw error;
        }
    }

    async function handleDeleteUser(): Promise<void> {
        if (!selectedUser) return;
        try {
            await userService.deleteUser(selectedUser.uuid);
            setData(prevData =>
                prevData.filter(u => u.uuid !== selectedUser.uuid)
            );
            setSelectedUser(null);
        } catch (error: unknown) {
            console.error("Error deleting the user!", error);
            alert("Failed to delete the user!");
        }
    }

    return { handleAddUser, handleUpdateUser, handleDeleteUser };
}

export default useUserCRUD;
