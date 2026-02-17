import {
  getBooleanColumn,
  getDateColumn,
  getTextColumn,
} from "@/shared/components/data-table/column/columns";
import { ACTION_COLUMN_PROPERTIES } from "@/shared/constants/columns";
import { type StringPropertyKeys } from "@/shared/types/common";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import TableActionDropdown, {
  type TTableActionDropdown,
} from "@/shared/components/data-table/ui/action-dropdown";

export interface Client {
  id: string;
  name: string;
  description: string;
  location: string;
  createdDate: string;
  isActive: boolean;
  globalSearch?: string;
  expand: boolean;
  children: Client[];
}

type IGetClientTableColumns = () => ColumnDef<Client>[];

function createColumn(
  key: StringPropertyKeys<Client>,
  title: string,
  enableColumnFilter: boolean
) {
  return getTextColumn<Client>({
    key,
    title,
    enableColumnFilter,
  });
}

const getClientTableColumns: IGetClientTableColumns = () => {
  const descriptionCol = createColumn("description", "Description", true);
  const locationCol = createColumn("location", "Location", true);
  const activeCol = getBooleanColumn<Client>({
    key: "isActive",
    enableColumnFilter: true,
    title: "Is Active",
  });

  const createdDateCol = getDateColumn<Client>({
    key: "createdDate",
    enableColumnFilter: true,
    title: "Created On",
    size: 40,
  });

  return [
    descriptionCol,
    locationCol,
    activeCol,
    createdDateCol,
    {
      id: "actions",
      cell: ({ row }) => {
        let id: string | undefined = row.original.id;
        let parent: Row<Client> | undefined = row;
        const ids: string[] = [];

        while (id) {
          ids.push(id);
          parent = parent?.getParentRow();
          id = parent?.original.id;
        }

        const dropdownList: TTableActionDropdown["items"] = [];

        return <TableActionDropdown items={dropdownList} />;
      },
      ...ACTION_COLUMN_PROPERTIES,
    },
  ];
};

export default getClientTableColumns;
