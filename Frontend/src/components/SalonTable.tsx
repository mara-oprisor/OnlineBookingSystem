import DataTable, { TableColumn } from "react-data-table-component";
import Salon from "../model/Salon";
import {useTranslation} from "react-i18next";

interface SalonTableProps {
    data: Salon[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: Salon[] }) => void;
}

function SalonTable({ data, loading, isError, onRowSelected }: SalonTableProps) {
    const { t } = useTranslation();
    const columns: TableColumn<Salon>[] = [
        {
            name: t("salonTable.colId"),
            selector: (row) => row.uuid,
            sortable: true,
        },
        {
            name: t("salonTable.colName"),
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: t("salonTable.colPhoneNumber"),
            selector: (row) => row.phoneNumber,
            sortable: false,
        }
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