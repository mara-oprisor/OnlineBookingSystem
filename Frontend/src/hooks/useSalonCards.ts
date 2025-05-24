import { useState, useEffect } from "react";
import Salon from "../model/Salon";
import SalonService from "../service/SalonService";

export function useSalonCards() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const salonService = SalonService();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const all  = await salonService.getSalons();
                const favs = await salonService.getFavoriteSalonsForUser(
                    sessionStorage.getItem("uuid")!);
                const withFavs = all.map(s =>
                    ({
                        ...s,
                        favoriteFor: favs.find(f => f.uuid === s.uuid)
                            ? [{ uuid: sessionStorage.getItem("uuid")! }]
                            : []
                    })
                );
                setSalons(withFavs);
            } catch (e) {
                console.error(e);
                setError("Failed to load salons");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { salons, loading, error };
}
