import { useEffect, useState, useMemo } from "react";
import UserService from "../service/UserService";
import User  from "../model/User";

export function useClients() {
    const [clients, setClients] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userService = useMemo(() => UserService(), []);

    useEffect(() => {
        async function fetchClients() {
            try {
                setLoading(true);
                const users = await userService.getUsers();
                const clientList = users.filter((user: User) => user.userType === 'CLIENT');
                setClients(clientList);
            } catch (err) {
                console.error("Error fetching clients:", err);
                setError("Failed to load clients");
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, [userService]);

    return { clients, loading, error };
}

export default useClients;
