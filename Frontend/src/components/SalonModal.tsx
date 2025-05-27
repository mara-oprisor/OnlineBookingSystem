import React, { useEffect, useState } from "react";
import Salon from "../model/Salon";
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation();

    useEffect(() => {
        if(isOpen) {
            setSalon(initialSalon);
        }
    }, [isOpen, initialSalon]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setSalon((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit() {
        try {
            if (isUpdateMode) {
                await onUpdate(salon);
            } else {
                await onAdd(salon);
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
                        <div className="modal-header">
                            <h5 className="modal-title">{isUpdateMode ? t("salonModal.titleUpdate") : t("salonModal.titleAdd")}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            {isUpdateMode && (
                                <div className="mb-3">
                                    <label>{t("salonModal.labelId")}</label>
                                    <input type="text" className="form-control" name="id" value={salon.uuid} disabled />
                                </div>
                            )}

                            <div className="mb-3">
                                <label>{t("salonModal.labelName")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={salon.name}
                                    onChange={handleInputChange}
                                />

                                <div className="mb-3">
                                    <label>{t("salonModal.labelPhoneNumber")}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        value={salon.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                {isUpdateMode ? t("salonModal.btnUpdate") : t("salonModal.btnAdd")}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                {t("salonModal.btnCancel")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SalonModal;