import React, { useState, useEffect } from "react";
import User from "../model/User";

export interface UserModalProps {
    isOpen: boolean;
    isUpdateMode: boolean;
    initialUser: User;
    onClose: () => void;
    onAdd: (user: User) => Promise<void>;
    onUpdate: (user: User) => Promise<void>;
}

function UserModal({ isOpen, isUpdateMode, initialUser, onClose, onAdd, onUpdate }: UserModalProps) {
    const [user, setUser] = useState<User>(initialUser);

    useEffect(() => {
        if (isOpen) {
            setUser(initialUser);
        }
    }, [isOpen, initialUser]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: name === "age" ? (value === "" ? null : parseInt(value)) : value
        }));
    }

    async function handleSubmit() {
        try {
            if (isUpdateMode) {
                await onUpdate(user);
            } else {
                await onAdd(user);
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
                            <h5 className="modal-title">{isUpdateMode ? "Update User" : "Add User"}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            {isUpdateMode && (
                                <div className="mb-3">
                                    <label>ID</label>
                                    <input type="text" className="form-control" name="id" value={user.uuid} disabled />
                                </div>
                            )}
                            <div className="mb-3">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label hidden={isUpdateMode}>Password</label>
                                {isUpdateMode ? (
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="password"
                                        value={user.password}
                                        onChange={handleInputChange}
                                        hidden
                                    />
                                ) : (
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={user.password}
                                        onChange={handleInputChange}
                                    />
                                )}

                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>User Type</label>
                                {isUpdateMode ? (
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userType"
                                        value={user.userType}
                                        disabled
                                    />
                                ) : (
                                    <select
                                        className="form-select"
                                        name="userType"
                                        value={user.userType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="CLIENT">Client</option>
                                    </select>
                                )}
                            </div>
                            {user.userType === "CLIENT" && (
                                <>
                                    <div className="mb-3">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={user.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="age"
                                            value={user.age ?? ""}
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

export default UserModal;
