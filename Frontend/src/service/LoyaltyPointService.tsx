import axios from "axios";
import {LOYALTY_POINT_ENDPOINT} from "../constants/api.ts";

function LoyaltyPointService() {
    const uuid = sessionStorage.getItem('uuid');

    async function getLoyaltyPointsForUser() {
        try {
            const response = await axios.get<number>(`${LOYALTY_POINT_ENDPOINT}/${uuid}`);

            return response.data;
        } catch (error: unknown) {
            let errorMessage: string = "Failed to fetch the loyalty points for the user!";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            }

            throw new Error(errorMessage);
        }
    }

    return {getLoyaltyPointsForUser};
}

export default LoyaltyPointService;