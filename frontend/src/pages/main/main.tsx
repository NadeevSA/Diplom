import style from './main.module.css';
import { Table, TableColumn, TableFilters } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { Data, GetProject, Project} from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'
import axios, { AxiosInstance } from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { setOriginalNode } from 'typescript';
import { Loader } from '@consta/uikit/Loader';
import { Button } from '@consta/uikit/Button';
import { ProjectPage } from '../ProjectConfig/project';
import authServer from '../../ServiceAuth/authServer';

interface Props {}

 export let rows: {
    id: string;
    ID: string;
    Name: string;
    UserId: number;
    Author: string;
    Description: string;
    Action?: typeof Button;
}[]

export const columns: TableColumn<typeof rows[number]>[] = [
  {
    title: '№',
    accessor: 'id',
    align: 'center',
    hidden: true,
  },
  {
    title: 'Название',
    accessor: 'Name',
    align: 'center',
  },
  {
    title: 'Avtor',
    accessor: 'UserId',
    align: 'center',
    hidden: true,
  },
  {
    title: 'Автор',
    accessor: 'Author',
    align: 'center',
    hidden: true,
  },
  {
    title: 'Описание',
    accessor: 'Description',
    align: 'center',
  },
  {
    title: 'Действие',
    accessor: "Action",
    align: 'center',
    renderCell: (row) => <ProjectPage name={row.Name} id={row.ID}/>
  },
];

export let rowsData: {
  ID: string,
  id: string;
  FileName: string;
  Label: string;
  Delete?: typeof Button;
}[]

export const columnsData: TableColumn<typeof rowsData[number]>[] = [
{
  title: '№',
  accessor: 'id',
  align: 'center',
  hidden: true,
},
{
  title: 'Имя файла',
  accessor: 'FileName',
  align: 'center',
},
{
  title: 'Описание',
  accessor: 'Label',
  align: 'center',
},
{
  title: 'Действие',
  accessor: 'Delete',
  align: 'center',
  renderCell: (row) => <Button 
  view="secondary"
  width="full"
  label={"Удалить"}
  onClick={() => DeleteData(row.ID)}/>
}
];

function DeleteData(id: string) {
  instance.delete(
    'data',
    //{ ID: id},
  );
}

const instance = axios.create({
  baseURL: "http://localhost:8084"
});

export function MyTable(props: { isHidden: boolean }) {
  columns.map(v => {
    if(v.title == "Автор") v.hidden = props.isHidden;
    if(v.title == "Действие") v.hidden = !props.isHidden;
  });
  const [data, setData] = useState<typeof rows>([]);
  useEffect(() => {
    authServer.getUserName().then(res => { 
      debugger
      instance.get( `project/filter?field=User_id&val=${res.data.ID}`,
      {headers: {
        Authorization : `Bearer ${authServer.getToken()}`
      }},
    ).then(response => {
      setData(response.data);
    });
    })
  }, [useDispatch()]);
  return (
    <Table rows={data} columns={columns} 
    borderBetweenColumns
    className={style.table}
    stickyHeader
    isResizable
    zebraStriped="even"
    emptyRowsPlaceholder={<Text>Нет проектов</Text>}/>)
}

export function MyData() {
  const [data, setData] = useState<typeof rowsData>([]);
  useEffect(() => {
    authServer.getUserName().then(res => {
      debugger
        instance.get( `data/filter?field=author&val=${res.data.Email}`,
        {headers: {
          Authorization : `Bearer ${authServer.getToken()}`
        }},
      ).then(response => {
        setData(response.data);
      });
    })
  }, [useDispatch()]);
  return (
    <Table rows={data} columns={columnsData} 
    borderBetweenColumns 
    stickyHeader
    className={style.table}
    isResizable
    zebraStriped="even"
    emptyRowsPlaceholder={<Text>Нет данных</Text>}/>)
}

export const main = (props: Props) => {
  return <MyTable isHidden={false}></MyTable>
}
