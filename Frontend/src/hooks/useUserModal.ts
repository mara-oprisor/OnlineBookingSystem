import { useState } from "react";
import User from "../model/User";

export interface UseUserModalProps {
    selectedUser: User | null;
}

function useUserModal({ selectedUser }: UseUserModalProps) {
    const [isModalUserOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateModeUser, setIsUpdateMode] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<User>({
        uuid: "",
        username: "",
        password: "",
        email: "",
        userType: "CLIENT",
        name: "",
        age: null
    });

    function openModalUser(update: boolean = false): void {
        setIsModalOpen(true);
        setIsUpdateMode(update);
        if (update && selectedUser) {
            setNewUser({ ...selectedUser });
        } else {
            setNewUser({
                uuid: "",
                username: "",
                password: "",
                email: "",
                userType: "CLIENT",
                name: "",
                age: null
            });
        }
    }

    function closeModalUser(): void {
        setIsModalOpen(false);
        setNewUser({
            uuid: "",
            username: "",
            password: "",
            email: "",
            userType: "CLIENT",
            name: "",
            age: null
        });
        setIsUpdateMode(false);
    }

    return {
        isModalUserOpen,
        isUpdateModeUser,
        newUser,
        openModalUser,
        closeModalUser,
        setNewUser
    };
}

export default useUserModal;
