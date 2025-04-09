import {ADD_SERVICE_ENDPOINT, DELETE_SERVICE_ENDPOINT, EDIT_SERVICE_ENDPOINT, SERVICE_ENDPOINT} from "../constants/api.ts";
import ServiceItem from "../model/ServiceItem.ts";

function ServiceItemService() {

    async function getServices(): Promise<ServiceItem[]> {
        const response = await fetch(SERVICE_ENDPOINT);

        if(!response.ok) {
            throw new Error("Failed to fetch the services from the database!");
        }

        return response.json();
    }

    async function getServicesBySalon(salonUuid: string): Promise<ServiceItem> {
        const response = await fetch(`${SERVICE_ENDPOINT}/${salonUuid}`);

        if (!response.ok) {
            throw new Error("Failed to fetch the service items for the salon!");
        }

        return response.json();
    }

    async function addService(service: Omit<ServiceItem, 'uuid'>): Promise<ServiceItem> {
        const response = await fetch(ADD_SERVICE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(service)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function updateService(service: ServiceItem): Promise<ServiceItem> {
        const response = await fetch(`${EDIT_SERVICE_ENDPOINT}/${service.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(service)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    }

    async function deleteService(id: string) {
        const response = await fetch(`${DELETE_SERVICE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error("Failed to delete the service!");
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