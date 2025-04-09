import React, { useEffect, useState } from "react";
import ServiceItem from "../model/ServiceItem";
import Salon from "../model/Salon";

export interface ServiceItemModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialItem: ServiceItem;
    onClose: () => void;
    onAdd: (item: ServiceItem) => Promise<void>;
    onUpdate: (item: ServiceItem) => Promise<void>;
    salons: Salon[];
}

function ServiceItemModal({
                              isOpen,
                              isUpdateMode,
                              initialItem,
                              onClose,
                              onAdd,
                              onUpdate,
                              salons,
                          }: ServiceItemModalProps) {
    const [item, setItem] = useState<ServiceItem>(initialItem);

    useEffect(() => {
        if (isOpen) {
            setItem(initialItem);
        }
    }, [isOpen, initialItem]);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: name === "price" ? parseInt(value) || 0 : value,
        }));
    }

    async function handleSubmit() {
        try {
            if (isUpdateMode) {
                await onUpdate(item);
            } else {
                await onAdd(item);
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
                                {isUpdateMode ? "Update Service Item" : "Add Service Item"}
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
                                        value={item.uuid}
                                        disabled
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={item.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="description"
                                    value={item.description || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={item.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Salon</label>
                                {isUpdateMode ? (
                                    <input type="text" className="form-control" name="salonName" value={item.salonName} disabled />
                                ) : (
                                    <select
                                        className="form-select"
                                        name="salonName"
                                        value={item.salonName}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">-- Select a Salon --</option>
                                        {salons.map((salon: Salon) => (
                                            <option key={salon.uuid} value={salon.name}>
                                                {salon.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                            >
                                {isUpdateMode ? "Update" : "Add"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceItemModal;
