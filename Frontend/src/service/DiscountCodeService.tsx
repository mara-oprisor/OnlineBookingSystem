import {DISCOUNT_CODE, DISCOUNT_CODES} from "../constants/api";
import DiscountCode from "../model/DiscountCode";
import DiscountCodeCreate from "../model/DiscountCodeCreate";

function DiscountCodeService() {

    async function getDiscountCodes(): Promise<DiscountCode[]> {
        const response = await fetch(DISCOUNT_CODES);
        if (!response.ok) {
            throw new Error("Failed to fetch discount codes from the database!");
        }
        return response.json();
    }

    async function addDiscountCode(discount: DiscountCodeCreate): Promise<DiscountCode> {
        const response = await fetch(DISCOUNT_CODE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discount)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        return response.json();
    }

    async function updateDiscountCode(discount: DiscountCode): Promise<DiscountCode> {
        const response = await fetch(`${DISCOUNT_CODE}/${discount.uuid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discount)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        return response.json();
    }

    async function deleteDiscountCode(id: string): Promise<void> {
        const response = await fetch(`${DISCOUNT_CODE}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete discount code!");
        }
    }

    return {
        getDiscountCodes,
        addDiscountCode,
        updateDiscountCode,
        deleteDiscountCode
    };
}

export default DiscountCodeService;
