import DataTable, { TableColumn } from "react-data-table-component";
import User from "../model/User";

export interface UserTableProps {
    data: User[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: User[] }) => void;
}

function UserTable({ data, loading, isError, onRowSelected }: UserTableProps) {
    const columns: TableColumn<User>[] = [
        { name: "ID", selector: (row: User) => row.uuid, sortable: true },
        { name: "Username", selector: (row: User) => row.username, sortable: true },
        { name: "Email", selector: (row: User) => row.email, sortable: true },
        { name: "Password", selector: (row: User) => row.password, sortable: false },
        { name: "User Type", selector: (row: User) => row.userType, sortable: true },
        { name: "Name", selector: (row: User) => row.name, sortable: true },
        { name: "Age", selector: (row: User) => row.age ?? "", sortable: true }
    ];

    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching the data</p>
            ) : (
                <div className="table-container">
                    <DataTable
                        title="Users"
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        selectableRows
                        onSelectedRowsChange={onRowSelected}
                    />
                </div>
            )}
        </>
    );
}

export default UserTable;
