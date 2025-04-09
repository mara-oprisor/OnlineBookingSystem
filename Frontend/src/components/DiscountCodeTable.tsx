import DataTable, { TableColumn } from "react-data-table-component";
import DiscountCode from "../model/DiscountCode";

export interface DiscountCodeTableProps {
    data: DiscountCode[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: DiscountCode[] }) => void;
}

function DiscountCodeTable({ data, loading, isError, onRowSelected }: DiscountCodeTableProps) {
    const columns: TableColumn<DiscountCode>[] = [
        { name: "ID", selector: (row: DiscountCode) => row.uuid, sortable: true },
        { name: "Code", selector: (row: DiscountCode) => row.discountCode, sortable: true },
        { name: "Expiration Date", selector: (row: DiscountCode) => row.expirationDate, sortable: true },
    ];

    return (
        <>
            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : isError ? (
                <p className="error-text">An error occurred while fetching discount codes</p>
            ) : (
                <div className="table-container">
                    <DataTable
                        title="Discount Codes"
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

export default DiscountCodeTable;
