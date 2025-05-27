import React, { useState } from "react";
import UserFilter from "../model/UserFilter";
import {useTranslation} from "react-i18next";

export interface FilterUserFormProps {
    onSubmit: (filter: UserFilter) => void;
}

export function FilterUserForm({ onSubmit }: FilterUserFormProps) {
    const [filter, setFilter] = useState<UserFilter>({});
    const { t } = useTranslation();

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(filter);
    }

    return (
        <form onSubmit={handleSubmit} className="row g-2 mb-4 justify-content-center align-items-end">
            <div className="col-auto">
                <label className="form-label">{t("userFilter.username")}</label>
                <input
                    type="text"
                    name="username"
                    className="form-control form-control-sm"
                    value={filter.username || ""}
                    onChange={handleChange}
                    placeholder={t("userFilter.placeholderUsername")}
                />
            </div>
            <div className="col-auto">
                <label className="form-label">{t("userFilter.email")}</label>
                <input
                    type="text"
                    name="email"
                    className="form-control form-control-sm"
                    value={filter.email || ""}
                    onChange={handleChange}
                    placeholder={t("userFilter.placeholderEmail")}
                />
            </div>
            <div className="col-auto">
                <label className="form-label">{t("userFilter.userType")}</label>
                <select
                    name="userType"
                    className="form-select form-select-sm"
                    value={filter.userType || ""}
                    onChange={handleChange}
                >
                    <option value="">{t("userFilter.all")}</option>
                    <option value="CLIENT">{t("userFilter.client")}</option>
                    <option value="ADMIN">{t("userFilter.admin")}</option>
                </select>
            </div>
            <div className="col-auto pt-4">
                <button type="submit" className="btn btn-secondary btn-sm">
                    {t("userFilter.btnApply")}
                </button>
            </div>
        </form>
    );
}

export default FilterUserForm;
