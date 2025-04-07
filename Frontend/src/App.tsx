import { useEffect, useState } from "react";
import User from "./model/User";
import Salon from "./model/Salon";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

import useUserCRUD from "./hooks/useUserCRUD.ts";
import UserService from "./service/UserService.tsx";
import UserTable from "./components/UserTable.tsx";
import UserModal  from "./components/UserModal.tsx";
import useUserModal from "./hooks/useUserModal.ts";

import useSalonCRUD from "./hooks/useSalonCRUD.ts";
import SalonService from "./service/SalonService.tsx";
import SalonTable from "./components/SalonTable.tsx";
import SalonModal from "./components/SalonModal.tsx";
import useSalonModal from "./hooks/useSalonModal.ts";

function App() {
    const [userData, setUserData] = useState<User[]>([]);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [userIsError, setUserIsError] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [salonData, setSalonData] = useState<Salon[]>([]);
    const [salonLoading, setSalonLoading] = useState<boolean>(true);
    const [salonIsError, setSalonIsError] = useState<boolean>(false);
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

    const userService = UserService();
    const salonService = SalonService();

    useEffect(() => {
        fetchUserData();
        fetchSalonData();
    }, []);

    const { handleAddUser, handleUpdateUser, handleDeleteUser } = useUserCRUD({
        setData: setUserData,
        setSelectedUser,
        selectedUser,
    });
    const { isModalOpen, isUpdateMode, newUser, openModal, closeModal } = useUserModal({ selectedUser });

    const { handleAddSalon, handleUpdateSalon, handleDeleteSalon } = useSalonCRUD({
        setData: setSalonData,
        setSelectedSalon,
        selectedSalon,
    });
    const { isModalOpen: isSalonModalOpen, isUpdateMode: isSalonUpdateMode, newSalon, openModal: openSalonModal, closeModal: closeSalonModal } = useSalonModal({ selectedSalon });

    async function fetchUserData() {
        setUserLoading(true);
        setUserIsError(false);
        try {
            const users = await userService.getUsers();
            setUserData(users);
        } catch (error) {
            console.error("Error fetching user data: ", error);
            setUserIsError(true);
        } finally {
            setUserLoading(false);
        }
    }

    async function fetchSalonData() {
        setSalonLoading(true);
        setSalonIsError(false);
        try {
            const salons = await salonService.getSalons();
            setSalonData(salons);
        } catch (error) {
            console.error("Error fetching salon data: ", error);
            setSalonIsError(true);
        } finally {
            setSalonLoading(false);
        }
    }

    function handleUserRowSelected(state: { selectedRows: User[] }): void {
        setSelectedUser(state.selectedRows[0] || null);
    }

    function handleSalonRowSelected(state: { selectedRows: Salon[] }): void {
        setSelectedSalon(state.selectedRows[0] || null);
    }

    return (
        <div className="app-container">
            <h1>User Management</h1>
            <div className="button-group">
                <button className="btn btn-secondary" onClick={() => openModal()}>Add User</button>
                <button className="btn btn-secondary" onClick={() => openModal(true)} disabled={!selectedUser}>
                    Update User
                </button>
                <button className="btn btn-secondary" onClick={handleDeleteUser} disabled={!selectedUser}>
                    Delete User
                </button>
            </div>
            <UserTable data={userData} loading={userLoading} isError={userIsError} onRowSelected={handleUserRowSelected} />
            <UserModal
                isOpen={isModalOpen}
                isUpdateMode={isUpdateMode}
                initialUser={newUser}
                onClose={closeModal}
                onAdd={handleAddUser}
                onUpdate={handleUpdateUser}
            />

            <h1>Salon Management</h1>
            <div className="button-group">
                <button className="btn btn-secondary" onClick={() => openSalonModal()}>Add Salon</button>
                <button className="btn btn-secondary" onClick={() => openSalonModal(true)} disabled={!selectedSalon}>
                    Update Salon
                </button>
                <button className="btn btn-secondary" onClick={handleDeleteSalon} disabled={!selectedSalon}>
                    Delete Salon
                </button>
            </div>
            <SalonTable data={salonData} loading={salonLoading} isError={salonIsError} onRowSelected={handleSalonRowSelected} />
            <SalonModal
                isOpen={isSalonModalOpen}
                isUpdateMode={isSalonUpdateMode}
                initialSalon={newSalon}
                onClose={closeSalonModal}
                onAdd={handleAddSalon}
                onUpdate={handleUpdateSalon}
            />
        </div>
    );
}

export default App;
