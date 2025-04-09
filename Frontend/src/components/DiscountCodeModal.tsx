import React, { useEffect } from "react";
import DiscountCodeCreate from "../model/DiscountCodeCreate";
import DiscountCode from "../model/DiscountCode.ts";

export interface DiscountCodeModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialDiscount: DiscountCode | DiscountCodeCreate;
    onClose: () => void;
    onAdd: (discount: DiscountCodeCreate) => Promise<void>;
    onUpdate: (discount: DiscountCode) => Promise<void>;
}

function DiscountCodeModal({
                               isOpen,
                               isUpdateMode,
                               initialDiscount,
                               onClose,
                               onAdd,
                               onUpdate,
                           }: DiscountCodeModalProps) {
    const [discount, setDiscount] = React.useState<DiscountCode | DiscountCodeCreate>(initialDiscount);

    useEffect(() => {
        if (isOpen) {
            setDiscount(initialDiscount);
        }
    }, [isOpen, initialDiscount]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        if (isUpdateMode && name !== "expirationDate") {
            return;
        }
        setDiscount((prev) => ({
            ...prev,
            [name]: name === "discount" ? parseInt(value) || 0 : value,
        }));
    }

    async function handleSubmit() {
        try {
            if (isUpdateMode) {
                await onUpdate(discount as DiscountCode);
            } else {
                await onAdd(discount as DiscountCodeCreate);
            }
            onClose();
        } catch (error) {
            console.error("Submission failed:", error);
        }
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div
                className="modal fade show"
                tabIndex={-1}
                style={{ display: "block" }}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {isUpdateMode ? "Update Discount Code" : "Add Discount Code"}
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            {isUpdateMode && (
                                <div className="mb-3">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={(discount as DiscountCode).uuid}
                                        disabled
                                    />
                                </div>
                            )}
                            {isUpdateMode ? (
                                <>
                                    <div className="mb-3">
                                        <label>Discount Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="discountCode"
                                            value={(discount as DiscountCode).discountCode}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Expiration Date</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="expirationDate"
                                            value={(discount as DiscountCode).expirationDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <label>Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="code"
                                            value={(discount as DiscountCodeCreate).code}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Discount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="discount"
                                            value={(discount as DiscountCodeCreate).discount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Expiration Date</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="dateTime"
                                            value={(discount as DiscountCodeCreate).dateTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                {isUpdateMode ? "Update" : "Add"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DiscountCodeModal;
