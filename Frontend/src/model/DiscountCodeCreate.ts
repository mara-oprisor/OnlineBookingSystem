interface DiscountCodeCreate {
    uuid?: string;
    code: string;
    discount: number;
    dateTime: string;
}

export default DiscountCodeCreate;
