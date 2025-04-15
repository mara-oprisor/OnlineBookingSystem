import { DISCOUNT_CODE, DISCOUNT_CODES } from "../constants/api";
import DiscountCode from "../model/DiscountCode";
import DiscountCodeCreate from "../model/DiscountCodeCreate";
import axios from "axios";

function DiscountCodeService() {

    async function getDiscountCodes(): Promise<DiscountCode[]> {
        try {
            const response = await axios.get<DiscountCode[]>(DISCOUNT_CODES);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string;

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data
                    ? JSON.stringify(error.response.data)
                    : error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Unknown error occurred";
            }

            throw new Error(errorMessage);
        }
    }

    async function addDiscountCode(discount: DiscountCodeCreate): Promise<DiscountCode> {
        try {
            const response = await axios.post<DiscountCode>(DISCOUNT_CODE, discount, {
                headers: { "Content-Type": "application/json" },
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string;

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data
                    ? JSON.stringify(error.response.data)
                    : error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Unknown error occurred";
            }

            throw new Error(errorMessage);
        }
    }

    async function updateDiscountCode(discount: DiscountCode): Promise<DiscountCode> {
        try {
            const response = await axios.put<DiscountCode>(`${DISCOUNT_CODE}/${discount.uuid}`, discount, {
                headers: { "Content-Type": "application/json" },
            });

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string;

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data
                    ? JSON.stringify(error.response.data)
                    : error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Unknown error occurred";
            }

            throw new Error(errorMessage);
        }
    }

    async function deleteDiscountCode(id: string): Promise<void> {
        try {
            await axios.delete(`${DISCOUNT_CODE}/${id}`);
        } catch (error: unknown) {
            let errorMessage: string = "Failed to delete discount code!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data
                    ? JSON.stringify(error.response.data)
                    : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    return {
        getDiscountCodes,
        addDiscountCode,
        updateDiscountCode,
        deleteDiscountCode,
    };
}

export default DiscountCodeService;
