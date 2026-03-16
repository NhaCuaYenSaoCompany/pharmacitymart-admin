import { Table, Tag, Transfer, type TableColumnsType } from "antd";
import type { GetProp } from "antd/es/_util/type";
import type { TableProps } from "antd/es/table/InternalTable";
import type { TransferProps } from "antd/es/transfer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Permission } from "~/apis/AuthApi/dto/res-login";

type TransferItem = GetProp<TransferProps, "dataSource">[number];
type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: Permission[];
  leftColumns: TableColumnsType<Permission>;
  rightColumns: TableColumnsType<Permission>;
  rowKey?: (record: Permission) => string | number;
  loading: boolean;
}

function TableTransfer(props: TableTransferProps) {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer style={{ width: "100%" }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, "replace");
          },
          selectedRowKeys: listSelectedKeys,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            loading={props.loading}
            style={{ pointerEvents: listDisabled ? "none" : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
}

interface PermissionListProps {
  data: Permission[];
  initSelected: Permission[];
  targetKeys: TransferProps["targetKeys"];
  setTargetKeys: (keys: TransferProps["targetKeys"]) => void;
  loading: boolean;
}

export default function PermissionList({
  data,
  initSelected,
  targetKeys,
  loading,
  setTargetKeys,
}: PermissionListProps) {
  const { t } = useTranslation();
  // Initialize targetKeys with the selected permissions
  useEffect(() => {
    const selectedIds = initSelected.map((permission) => permission.id);
    setTargetKeys(selectedIds);
  }, [initSelected, setTargetKeys]);

  const columns: TableColumnsType<Permission> = [
    {
      title: t("permissionManagement.fields.name"),
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Tag>
          {t(`permissions.${name}`)} <b>({name})</b>
        </Tag>
      ),
    },
    {
      title: t("permissionManagement.fields.groupName"),
      dataIndex: "groupName",
      key: "groupName",
      render: (groupName) => (
        <Tag color="blue">{t(`groupPermissions.${groupName}`)}</Tag>
      ),
    },
  ];

  const filterOption = (input: string, item: Permission) =>
    item.name?.toUpperCase().includes(input.toUpperCase()) ||
    item.desc?.toUpperCase().includes(input.toUpperCase()) ||
    item.groupName?.toUpperCase().includes(input.toUpperCase());

  const onChange: TableTransferProps["onChange"] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <>
      <TableTransfer
        loading={loading}
        dataSource={data}
        targetKeys={targetKeys}
        showSearch
        showSelectAll={false}
        onChange={onChange}
        filterOption={filterOption}
        leftColumns={columns}
        rightColumns={columns}
        rowKey={(record) => record.id}
      />
    </>
  );
}
