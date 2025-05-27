import DataTable, { TableColumn } from "react-data-table-component";
import User from "../model/User";
import {useTranslation} from "react-i18next";

export interface UserTableProps {
    data: User[];
    loading: boolean;
    isError: boolean;
    onRowSelected: (state: { selectedRows: User[] }) => void;
}

function UserTable({ data, loading, isError, onRowSelected }: UserTableProps) {
    const { t } = useTranslation();
    const columns: TableColumn<User>[] = [
        { name: t("userTable.colId"), selector: r => r.uuid, sortable: true },
        { name: t("userTable.colUsername"), selector: r => r.username, sortable: true },
        { name: t("userTable.colEmail"), selector: r => r.email, sortable: true },
        { name: t("userTable.colUserType"), selector: r => r.userType, sortable: true },
        { name: t("userTable.colName"), selector: r => r.name, sortable: true },
        { name: t("userTable.colAge"), selector: r => r.age ?? "", sortable: true }
    ];

    if (loading) return <p>{t("userTable.loading")}</p>;
    if (isError) return <p>{t("userTable.error")}</p>;

    return (
        <div className="table-container">
            <DataTable
                title={t("userTable.title")}
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

export default UserTable;
