import DataTable, { TableColumn } from "react-data-table-component";
import DiscountCode from "../model/DiscountCode";
import {useTranslation} from "react-i18next";

export interface DiscountCodeTableProps {
    data: DiscountCode[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: DiscountCode[] }) => void;
}

function DiscountCodeTable({ data, loading, isError, onRowSelected }: DiscountCodeTableProps) {
    const { t } = useTranslation();
    const columns: TableColumn<DiscountCode>[] = [
        {
            name: t("discountTable.colId"),
            selector: row => row.uuid,
            sortable: true,
        },
        {
            name: t("discountTable.colCode"),
            selector: row => row.discountCode,
            sortable: true,
        },
        {
            name: t("discountTable.colExpiration"),
            selector: row => row.expirationDate,
            sortable: true,
        }
    ];

    if (loading) return <p>{t("discountTable.loading")}</p>;
    if (isError) return <p>{t("discountTable.error")}</p>;

    return (
        <div className="table-container">
            <DataTable
                title={t("discountTable.title")}
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                selectableRows
                onSelectedRowsChange={onRowSelected}
            />
        </div>
    );
}

export default DiscountCodeTable;
