import './main.module.css';
import { Table, TableColumn } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';

interface Props {}

export const rows = [
  { id: "1", name: 'Проект1', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "2", name: 'Проект2', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "3", name: 'Проект3', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "4", name: 'Проект4', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "5", name: 'Проект5', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "1", name: 'Проект1', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "2", name: 'Проект2', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "3", name: 'Проект3', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "4", name: 'Проект4', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
  { id: "5", name: 'Проект5', author: 'Антон', createData: "13.04.2022",  conf: "Java", status: "В работе"},
];

export const columns: TableColumn<typeof rows[number]>[] = [
  {
    title: '№',
    accessor: 'id',
    align: 'center',
  },
  {
    title: 'Название',
    accessor: 'name',
    align: 'center',
  },
  {
    title: 'Автор',
    accessor: 'author',
    align: 'center',
  },
  {
    title: 'Дата создания',
    accessor: 'createData',
    align: 'center',
  },
  {
    title: 'Конфигурация',
    accessor: 'conf',
    align: 'center',
  },
  {
    title: 'Статус',
    accessor: 'status',
    align: 'center',
  },
];

export const main = (props: Props) => {
  return (
  <Table rows={rows} columns={columns} 
  borderBetweenColumns 
  stickyHeader 
  isResizable
  zebraStriped="even"
  emptyRowsPlaceholder={<Text>Пусто</Text>}
  lazyLoad={{ maxVisibleRows: 210, scrollableEl: window }} />)
}