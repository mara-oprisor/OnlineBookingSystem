import {SERVICE_ENDPOINT, SERVICES_ENDPOINT} from "../constants/api";
import ServiceItem from "../model/ServiceItem";
import axios from "axios";

function ServiceItemService() {

    async function getServices(): Promise<ServiceItem[]> {
        try {
            const response = await axios.get<ServiceItem[]>(SERVICES_ENDPOINT);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch the services from the database!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function getServicesBySalon(salonUuid: string): Promise<ServiceItem> {
        try {
            const response = await axios.get<ServiceItem>(`${SERVICES_ENDPOINT}/${salonUuid}`);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch the service items for the salon!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function addService(service: Omit<ServiceItem, 'uuid'>): Promise<ServiceItem> {
        try {
            const response = await axios.post<ServiceItem>(SERVICE_ENDPOINT, service, {
                headers: { "Content-Type": "application/json" },
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to add service!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function updateService(service: ServiceItem): Promise<ServiceItem> {
        try {
            const response = await axios.put<ServiceItem>(`${SERVICE_ENDPOINT}/${service.uuid}`, service, {
                headers: { "Content-Type": "application/json" },
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to update service!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    async function deleteService(id: string): Promise<void> {
        try {
            await axios.delete(`${SERVICE_ENDPOINT}/${id}`);
        } catch (error: unknown) {
            let errorMessage: string = "Failed to delete the service!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    return {
        getServices,
        getServicesBySalon,
        addService,
        updateService,
        deleteService
    };
}

export default ServiceItemService;
