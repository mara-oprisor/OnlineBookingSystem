import { useState, useEffect } from "react";
import Salon from "../model/Salon";
import SalonService from "../service/SalonService";

export function useSalons() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const salonService = SalonService();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const salonsData = await salonService.getSalons();
                setSalons(salonsData);
            } catch (err) {
                console.error("Error fetching salons:", err);
                setError("Failed to load salons");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { salons, loading, error };
}
