import { useState, useEffect } from "react";
import LoyaltyPointService from "../service/LoyaltyPointService";

function useLoyaltyPoints() {
    const [points, setPoints] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const service = LoyaltyPointService();

    useEffect(() => {
        async function fetchPoints() {
            setLoading(true);
            try {
                const pts = await service.getLoyaltyPointsForUser();
                setPoints(pts);
            } catch (e: unknown) {
                setError((e as Error).message || "Failed to load points");
            } finally {
                setLoading(false);
            }
        }
        fetchPoints();
    }, [service]);

    return { points, loading, error };
}

export default useLoyaltyPoints;
