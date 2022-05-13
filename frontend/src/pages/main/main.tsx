import './main.module.css';
import { Table, TableColumn } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { GetProject, Project} from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'
import axios, { AxiosInstance } from 'axios';

interface Props {}

export const rows = [
  { id: "2", Name: 'Проект1', UserId: 1, Description: "Description"},
];

export const columns: TableColumn<typeof rows[number]>[] = [
  {
    title: '№',
    accessor: 'id',
    align: 'center',
  },
  {
    title: 'Название',
    accessor: 'Name',
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

const instance = axios.create({
  baseURL: "http://localhost:8084"
});

function MyTable() {
  const projects = GetProject();
  instance.get(
    'project',
    {headers: {Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTIzNjc0NDUuODE3NzM0LCJpYXQiOjE2NTIyODEwNDUuODE3NzM0LCJ1c2VybmFtZSI6Ildlc3QxIn0.S0mN5EgR11_MnbvO7n0DDzEMGVleYPgUzkbhAehfDDQ"}},
  ).then(response => {
    console.log("response1", response);
    console.log("Description1", response.data);
    return response.data;
  }).then(value => 
    value.map((d: Project) => rows.push(d)));
  return (
    <Table rows={rows} columns={columns} 
    borderBetweenColumns 
    stickyHeader
    isResizable
    zebraStriped="even"
    emptyRowsPlaceholder={<Text>Пусто</Text>}
    lazyLoad={{ maxVisibleRows: 210, scrollableEl: window }} />)
}

export const main = (props: Props) => {
  return MyTable();
}
