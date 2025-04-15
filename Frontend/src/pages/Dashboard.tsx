import { useEffect, useState } from "react";
import "../App.css";
import 'bootstrap/dist/css/bootstrap.css';
import User from "../model/User";
import UserService from "../service/UserService";
import useUserCRUD from "../hooks/useUserCRUD";
import useUserModal from "../hooks/useUserModal";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";
import Salon from "../model/Salon";
import SalonService from "../service/SalonService";
import useSalonCRUD from "../hooks/useSalonCRUD";
import useSalonModal from "../hooks/useSalonModal";
import SalonTable from "../components/SalonTable.tsx";
import SalonModal from "../components/SalonModal.tsx";
import ServiceItem from "../model/ServiceItem.ts";
import ServiceItemService from "../service/ServiceItemService.tsx";
import useServiceItemCRUD from "../hooks/useServiceItemCRUD.ts";
import useServiceItemModal from "../hooks/useServiceItemModal.ts";
import ServiceItemTable from "../components/ServiceItemTable.tsx";
import ServiceItemModal from "../components/ServiceItemModal.tsx";
import DiscountCodeService from "../service/DiscountCodeService.tsx";
import DiscountCode from "../model/DiscountCode.ts";
import useDiscountCodeCRUD from "../hooks/useDiscountCodeCRUD.ts";
import useDiscountCodeModal from "../hooks/useDiscountCodeModal.ts";
import DiscountCodeTable from "../components/DiscountCodeTable.tsx";
import DiscountCodeModal from "../components/DiscountCodeModal.tsx";
import FilterUserForm from "../components/FilterUserForm.tsx";
import UserFilter from "../model/UserFilter.ts";
import LogoutButton from "../components/LogoutButton.tsx";

function Dashboard() {
    const [userData, setUserData] = useState<User[]>([]);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [userIsError, setUserIsError] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [salonData, setSalonData] = useState<Salon[]>([]);
    const [salonLoading, setSalonLoading] = useState<boolean>(true);
    const [salonIsError, setSalonIsError] = useState<boolean>(false);
    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

    const [serviceItemData, setServiceItemData] = useState<ServiceItem[]>([]);
    const [serviceItemLoading, setServiceItemLoading] = useState<boolean>(true);
    const [serviceItemIsError, setServiceItemIsError] = useState<boolean>(false);
    const [selectedServiceItem, setSelectedServiceItem] = useState<ServiceItem | null>(null);

    const [discountData, setDiscountData] = useState<DiscountCode[]>([]);
    const [discountLoading, setDiscountLoading] = useState<boolean>(true);
    const [discountIsError, setDiscountIsError] = useState<boolean>(false);
    const [selectedDiscount, setSelectedDiscount] = useState<DiscountCode | null>(null);

    const userService = UserService();
    const salonService = SalonService();
    const serviceItemService = ServiceItemService();
    const discountService = DiscountCodeService();

    useEffect(() => {
        fetchUserData();
        fetchSalonData();
        fetchServiceItemData();
        fetchDiscountData();
    }, []);

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

    async function handleFilterSubmit(filter: UserFilter) {
        try {
            setUserLoading(true);
            const filteredUsers = await userService.filterUsers(filter);
            setUserData(filteredUsers);
        } catch (err) {
            console.error("Error filtering users:", err);
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

    async function fetchServiceItemData() {
        setServiceItemLoading(true);
        setServiceItemIsError(false);
        try {
            const items = await serviceItemService.getServices();
            setServiceItemData(items);
        } catch (error) {
            console.error("Error fetching service item data: ", error);
            setServiceItemIsError(true);
        } finally {
            setServiceItemLoading(false);
        }
    }

    async function fetchDiscountData() {
        setDiscountLoading(true);
        setDiscountIsError(false);
        try {
            const discounts = await discountService.getDiscountCodes();
            setDiscountData(discounts);
        } catch (error) {
            console.error("Error fetching discount codes:", error);
            setDiscountIsError(true);
        } finally {
            setDiscountLoading(false);
        }
    }

    const { handleAddUser, handleUpdateUser, handleDeleteUser } = useUserCRUD({
        setData: setUserData,
        setSelectedUser,
        selectedUser,
    });
    const { isModalUserOpen, isUpdateModeUser, newUser, openModalUser, closeModalUser } = useUserModal({ selectedUser });

    const { handleAddSalon, handleUpdateSalon, handleDeleteSalon } = useSalonCRUD({
        setData: setSalonData,
        setSelectedSalon,
        selectedSalon,
    });
    const { isModalSalonOpen, isUpdateModeSalon, newSalon, openModalSalon, closeModalSalon } = useSalonModal({ selectedSalon });

    const { handleAddServiceItem, handleUpdateServiceItem, handleDeleteServiceItem } = useServiceItemCRUD({
        setData: setServiceItemData,
        setSelectedItem: setSelectedServiceItem,
        selectedItem: selectedServiceItem,
    });
    const { isModalServiceItemOpen, isUpdateModeServiceItem, newItem, openModalServiceItem, closeModalServiceItem } = useServiceItemModal({ selectedItem: selectedServiceItem });

    const { handleAddDiscountCode, handleUpdateDiscountCode, handleDeleteDiscountCode } = useDiscountCodeCRUD({
        setData: setDiscountData,
        setSelectedDiscount,
        selectedDiscount,
    });
    const { isModalOpen, isUpdateMode, newDiscount, openModal, closeModal } = useDiscountCodeModal({ selectedDiscount });

    function handleUserRowSelected(state: { selectedRows: User[] }): void {
        setSelectedUser(state.selectedRows[0] || null);
    }
    function handleSalonRowSelected(state: { selectedRows: Salon[] }): void {
        setSelectedSalon(state.selectedRows[0] || null);
    }
    function handleServiceItemRowSelected(state: { selectedRows: ServiceItem[] }): void {
        setSelectedServiceItem(state.selectedRows[0] || null);
    }
    function handleDiscountRowSelected(state: { selectedRows: DiscountCode[] }): void {
        setSelectedDiscount(state.selectedRows[0] || null);
    }


    return (
        <>
            <div className="d-flex justify-content-end p-2">
                <LogoutButton/>
            </div>

            <h1>Dashboard</h1>
            <div className="app-container">
                <h2>User Management</h2>
                <div className="button-group">
                    <button className="btn btn-secondary" onClick={() => openModalUser()}>
                        Add User
                    </button>
                    <button className="btn btn-secondary" onClick={() => openModalUser(true)} disabled={!selectedUser}>
                        Update User
                    </button>
                    <button className="btn btn-secondary" onClick={handleDeleteUser} disabled={!selectedUser}>
                        Delete User
                    </button>
                    <FilterUserForm onSubmit={handleFilterSubmit} />
                </div>
                <UserTable
                    data={userData}
                    loading={userLoading}
                    isError={userIsError}
                    onRowSelected={handleUserRowSelected}
                />
                <UserModal
                    isOpen={isModalUserOpen}
                    isUpdateMode={isUpdateModeUser}
                    initialUser={newUser}
                    onClose={closeModalUser}
                    onAdd={handleAddUser}
                    onUpdate={handleUpdateUser}
                />

                <h2>Salon Management</h2>
                <div className="button-group">
                    <button className="btn btn-secondary" onClick={() => openModalSalon()}>
                        Add Salon
                    </button>
                    <button className="btn btn-secondary" onClick={() => openModalSalon(true)} disabled={!selectedSalon}>
                        Update Salon
                    </button>
                    <button className="btn btn-secondary" onClick={handleDeleteSalon} disabled={!selectedSalon}>
                        Delete Salon
                    </button>
                </div>
                <SalonTable
                    data={salonData}
                    loading={salonLoading}
                    isError={salonIsError}
                    onRowSelected={handleSalonRowSelected}
                />
                <SalonModal
                    isOpen={isModalSalonOpen}
                    isUpdateMode={isUpdateModeSalon}
                    initialSalon={newSalon}
                    onClose={closeModalSalon}
                    onAdd={handleAddSalon}
                    onUpdate={handleUpdateSalon}
                />

                <h2>Service Management</h2>
                <div className="button-group">
                    <button className="btn btn-secondary" onClick={() => openModalServiceItem()}>
                        Add Service Item
                    </button>
                    <button className="btn btn-secondary" onClick={() => openModalServiceItem(true)} disabled={!selectedServiceItem}>
                        Update Service Item
                    </button>
                    <button className="btn btn-secondary" onClick={handleDeleteServiceItem} disabled={!selectedServiceItem}>
                        Delete Service Item
                    </button>
                </div>
                <ServiceItemTable
                    data={serviceItemData}
                    loading={serviceItemLoading}
                    isError={serviceItemIsError}
                    onRowSelected={handleServiceItemRowSelected}
                />
                <ServiceItemModal
                    isOpen={isModalServiceItemOpen}
                    isUpdateMode={isUpdateModeServiceItem}
                    initialItem={newItem}
                    onClose={closeModalServiceItem}
                    onAdd={handleAddServiceItem}
                    onUpdate={handleUpdateServiceItem}
                    salons={salonData}
                />

                <h1>Discount Code Management</h1>
                <div className="button-group">
                    <button className="btn btn-secondary" onClick={() => openModal()}>
                        Add Discount Code
                    </button>
                    <button className="btn btn-secondary" onClick={() => openModal(true)} disabled={!selectedDiscount}>
                        Update Discount Code
                    </button>
                    <button className="btn btn-secondary" onClick={handleDeleteDiscountCode} disabled={!selectedDiscount}>
                        Delete Discount Code
                    </button>
                </div>
                <DiscountCodeTable
                    data={discountData}
                    loading={discountLoading}
                    isError={discountIsError}
                    onRowSelected={handleDiscountRowSelected}
                />
                <DiscountCodeModal
                    isOpen={isModalOpen}
                    isUpdateMode={isUpdateMode}
                    initialDiscount={newDiscount}
                    onClose={closeModal}
                    onAdd={handleAddDiscountCode}
                    onUpdate={handleUpdateDiscountCode}
                />
            </div>
        </>
    );
}

export default Dashboard;
