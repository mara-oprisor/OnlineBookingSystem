import React, { useEffect, useState } from "react";
import User from "../model/User";

interface UserModalProps {
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
        setUser(initialUser);
    }, [initialUser]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: name === "age" ? (value === "" ? null : parseInt(value)) : value
        }));
    }

    useEffect(() => {
        if (user.type === "ADMIN") {
            setUser((prev) => ({ ...prev, age: null }));
        }
    }, [user.type]);

    async function handleSubmit() {
        if (isUpdateMode) {
            await onUpdate(user);
        } else {
            await onAdd(user);
        }
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isUpdateMode ? "Update User" : "Add User"}</h2>
                {isUpdateMode && (
                    <div>
                        <label>ID</label>
                        <input type="text" name="id" value={user.uuid} disabled />
                    </div>
                )}
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="text" name="password" value={user.password} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={user.email} onChange={handleInputChange} />
                </div>
                {!isUpdateMode ? (
                    <div>
                        <label>User Type</label>
                        <select name="userType" value={user.type || ""} onChange={handleInputChange}>
                            <option value="ADMIN">Admin</option>
                            <option value="CLIENT">Client</option>
                        </select>
                    </div>
                ) : (
                    <div>
                        <label>User Type</label>
                        <input type="text" name="userType" value={user.type} disabled />
                    </div>
                )}
                {user.type === "CLIENT" && (
                    <>
                        <div>
                            <label>Name</label>
                            <input type="text" name="name" value={user.name || ""} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Age</label>
                            <input type="text" name="age" value={user.age || ""} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Gender</label>
                            <select name="gender" value={user.gender || ""} onChange={handleInputChange}>
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                    </>
                )}
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>{isUpdateMode ? "Update" : "Add"}</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default UserModal;