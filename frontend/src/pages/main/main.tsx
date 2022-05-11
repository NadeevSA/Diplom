import './main.module.css';
import { Table, TableColumn } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { GetProject, Project} from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'

interface Props {}

export const rows = [
  { id: "2", name: 'Проект1', UserId: 1, Description: "Description"},
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
    accessor: 'UserId',
    align: 'center',
  },
  {
    title: 'Описание',
    accessor: 'Description',
    align: 'center',
  },
];

function MyTable() {
  const projects = useSelector(GetProject);
  console.log("projects", projects);
  projects.then(response => {
    console.log("project", response);
    rows.push(response)
  })
  return rows;
}

export const main = (props: Props) => {
  const newRows = MyTable();
  console.log("row", newRows)
  return (
  <Table rows={newRows} columns={columns} 
  borderBetweenColumns 
  stickyHeader 
  isResizable
  zebraStriped="even"
  emptyRowsPlaceholder={<Text>Пусто</Text>}
  lazyLoad={{ maxVisibleRows: 210, scrollableEl: window }} />)
}