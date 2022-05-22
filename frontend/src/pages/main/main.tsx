import style from './main.module.css';
import { Table, TableColumn } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
  );
}

const instance = axios.create({
  baseURL: "http://localhost:8084"
});

export function MyTable(props: { isHidden: boolean }) {
  const onDelete = (id: string) => {setData(prevState => prevState.filter(d => d.ID !== id))}
  const columns = getColumns(onDelete)
  columns.map(v => {
    if(v.title == "Автор") v.hidden = props.isHidden;
    if(v.title == "Действие") v.hidden = !props.isHidden;
  });
  const [data, setData] = useState<typeof rows>([]);
  useEffect(() => {
    if (!props.isHidden){
      instance.get( `project`).then(response => {
        setData(response.data);
      });
    } else {
      authServer.getUserName().then(res => {
        instance.get( `project/filter?field=User_id&val=${res.data.ID}`,
            {headers: {
                Authorization : `Bearer ${authServer.getToken()}`
              }},
        ).then(response => {
          setData(response.data);
        });
      })
    }
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

export const getColumns = (onDelete: (id: string) => void) => {
  const columns: TableColumn<typeof rows[number]>[] = [
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
      renderCell: (row) => <ProjectPage name={row.Name} id={row.ID} onDelete={onDelete}/>
    },
  ];
  return columns
}

export function MyData() {
  const [data, setData] = useState<typeof rowsData>([]);

  const init = () => {
    authServer.getUserName().then(res => {
      instance.get( `data/filter?field=author&val=${res.data.Email}`,
          {headers: {
              Authorization : `Bearer ${authServer.getToken()}`
            }},
      ).then(response => {
        setData(response.data);
      });
    })
  }
  useEffect(() => {
    init()
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
