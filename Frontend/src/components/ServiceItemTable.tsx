import DataTable, { TableColumn } from "react-data-table-component";
import ServiceItem from "../model/ServiceItem";
import {useTranslation} from "react-i18next";

export interface ServiceItemTableProps {
    data: ServiceItem[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: ServiceItem[] }) => void;
}

function ServiceItemTable({ data, loading, isError, onRowSelected }: ServiceItemTableProps) {
    const { t } = useTranslation();
    const columns: TableColumn<ServiceItem>[] = [
        { name: t("serviceItemTable.colId"), selector: r => r.uuid, sortable: true },
        { name: t("serviceItemTable.colName"), selector: r => r.name, sortable: true },
        { name: t("serviceItemTable.colDescription"), selector: r => r.description ?? "", sortable: false },
        { name: t("serviceItemTable.colPrice"), selector: r => r.price, sortable: true },
        { name: t("serviceItemTable.colSalon"), selector: r => r.salonName, sortable: true }
    ];

    if (loading) return <p>{t("serviceItemTable.loading")}</p>;
    if (isError) return <p>{t("serviceItemTable.error")}</p>;

    return (
        <div className="table-container">
            <DataTable
                title={t("serviceItemTable.title")}
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

export default ServiceItemTable;
