import DataTable, { TableColumn } from "react-data-table-component";
import Salon from "../model/Salon";

interface SalonTableProps {
    data: Salon[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Salon[] }) => void;
}

function SalonTable({ data, loading, isError, onRowSelected }: SalonTableProps) {
    const columns: TableColumn<Salon>[] = [
        { name: "ID", selector: (row: Salon) => row.uuid, sortable: true },
        { name: "Name", selector: (row: Salon) => row.name, sortable: true },
        { name: "Phone Number", selector: (row: Salon) => row.phoneNumber, sortable: false },
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
                        title="Salons"
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

export default SalonTable;