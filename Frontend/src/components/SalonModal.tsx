import React, { useEffect, useState } from "react";
import Salon from "../model/Salon";

interface SalonModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialSalon: Salon;
    onClose: () => void;
    onAdd: (salon: Salon) => Promise<void>;
    onUpdate: (salon: Salon) => Promise<void>;
}

function SalonModal({ isOpen, isUpdateMode, initialSalon, onClose, onAdd, onUpdate }: SalonModalProps) {
    const [salon, setSalon] = useState<Salon>(initialSalon);

    useEffect(() => {
        setSalon(initialSalon);
    }, [initialSalon]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setSalon((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit() {
        if (isUpdateMode) {
            await onUpdate(salon);
        } else {
            await onAdd(salon);
        }
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? "Update Salon" : "Add Salon"}</h2>
                {isUpdateMode && (
                    <div>
                        <label>ID</label>
                        <input type="text" name="id" value={salon.uuid} disabled />
                    </div>
                )}
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={salon.name} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="text" name="phoneNumber" value={salon.phoneNumber} onChange={handleInputChange} />
                </div>
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>{isUpdateMode ? "Update" : "Add"}</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default SalonModal;