import React, { useState } from "react";
import UserFilter from "../model/UserFilter";

export interface FilterUserFormProps {
    onSubmit: (filter: UserFilter) => void;
}

export function FilterUserForm({ onSubmit }: FilterUserFormProps) {
    const [filter, setFilter] = useState<UserFilter>({});

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
                <label className="form-label">Username</label>
                <input
                    type="text"
                    name="username"
                    className="form-control form-control-sm"
                    value={filter.username || ""}
                    onChange={handleChange}
                    placeholder="Filter by username"
                />
            </div>
            <div className="col-auto">
                <label className="form-label">Email</label>
                <input
                    type="text"
                    name="email"
                    className="form-control form-control-sm"
                    value={filter.email || ""}
                    onChange={handleChange}
                    placeholder="Filter by email"
                />
            </div>
            <div className="col-auto">
                <label className="form-label">User Type</label>
                <select
                    name="userType"
                    className="form-select form-select-sm"
                    value={filter.userType || ""}
                    onChange={handleChange}
                >
                    <option value="">-- All --</option>
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>
            <div className="col-auto pt-4">
                <button type="submit" className="btn btn-secondary btn-sm">
                    Apply Filter
                </button>
            </div>
        </form>
    );
}

export default FilterUserForm;
