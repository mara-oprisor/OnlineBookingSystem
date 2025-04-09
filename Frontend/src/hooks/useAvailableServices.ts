import { useEffect, useState, useMemo } from "react";
import ServiceItemService from "../service/ServiceItemService";
import ServiceItem from "../model/ServiceItem";

export function useAvailableServices(salonId: string) {
    const [availableServices, setAvailableServices] = useState<ServiceItem[]>([]);
    const [loadingServices, setLoadingServices] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const serviceItemService = useMemo(() => ServiceItemService(), []);

    useEffect(() => {
        async function fetchServices() {
            try {
                setLoadingServices(true);
                const services = await serviceItemService.getServicesBySalon(salonId);
                setAvailableServices(Array.isArray(services) ? services : [services]);
            } catch (err) {
                console.error("Error fetching service items:", err);
                setError("Failed to load services");
            } finally {
                setLoadingServices(false);
            }
        }
        if (salonId) {
            fetchServices();
        }
    }, [salonId, serviceItemService]);

    return { availableServices, loadingServices, error };
}

export default useAvailableServices;
