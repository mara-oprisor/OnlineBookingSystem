import { useState } from "react";
import User from "../model/User";

interface UseUserModalProps {
    selectedUser: User | null;
}

function useUserModal({ selectedUser }: UseUserModalProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<User>({
        uuid: "",
        username: "",
        password: "",
        email: "",
        type: "CLIENT",
        name: "",
        age: null,
        gender: null
    });

    function openModal(update: boolean = false): void {
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
                type: "CLIENT",
                name: "",
                age: null,
                gender: null
            });
        }
    }

    function closeModal(): void {
        setIsModalOpen(false);
        setNewUser({
            uuid: "",
            username: "",
            password: "",
            email: "",
            type: "CLIENT",
            name: "",
            age: null,
            gender: null
        });
        setIsUpdateMode(false);
    }

    return {
        isModalOpen,
        isUpdateMode,
        newUser,
        openModal,
        closeModal,
        setNewUser
    };
}

export default useUserModal;