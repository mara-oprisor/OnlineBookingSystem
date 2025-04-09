import DataTable, { TableColumn } from "react-data-table-component";
import ServiceItem from "../model/ServiceItem";

export interface ServiceItemTableProps {
    data: ServiceItem[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: ServiceItem[] }) => void;
}

function ServiceItemTable({ data, loading, isError, onRowSelected }: ServiceItemTableProps) {
    const columns: TableColumn<ServiceItem>[] = [
        { name: "ID", selector: (row: ServiceItem) => row.uuid, sortable: true },
        { name: "Name", selector: (row: ServiceItem) => row.name, sortable: true },
        { name: "Description", selector: (row: ServiceItem) => row.description ?? "", sortable: false },
        { name: "Price", selector: (row: ServiceItem) => row.price, sortable: true },
        { name: "Salon", selector: (row: ServiceItem) => row.salonName, sortable: true }
    ];

    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching the service items</p>
            ) : (
                <div className="table-container">
                    <DataTable
                        title="Service Items"
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

export default ServiceItemTable;
