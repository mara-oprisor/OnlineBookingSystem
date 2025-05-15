import { useEffect, useState } from "react";
import User  from "../model/User";
import axios, {AxiosError} from "axios";
import {USERS_ENDPOINT} from "../constants/api.ts";

export function useClients() {
    const [clients, setClients] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchClients() {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<User[]>(USERS_ENDPOINT);
                if (!isMounted) return;
                setClients(response.data.filter((u) => u.userType === "CLIENT"));
            } catch (unknownErr) {
                if (!isMounted) return;
                let message = "Failed to load clients";
                if (axios.isAxiosError(unknownErr)) {
                    const axiosErr = unknownErr as AxiosError<{ error?: string }>;
                    message = axiosErr.response?.data.error
                        ?? axiosErr.message;
                } else if (unknownErr instanceof Error) {
                    message = unknownErr.message;
                }
                console.error("Error fetching clients:", unknownErr);
                setError(message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchClients();
        return () => {
            isMounted = false;
        };
    }, []);

    return { clients, loading, error };
}

export default useClients;
