import './main.module.css';
import { Table, TableColumn } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { GetProject, Project} from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'
import axios, { AxiosInstance } from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { setOriginalNode } from 'typescript';

interface Props {}

 export let rows: {
    id: string;
    Name: string;
    UserId: number;
    Avtor?: string;
    Description: string;
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
    title: 'Автор',
    accessor: 'UserId',
    align: 'center',
    hidden: true,
  },
  {
    title: 'Автор',
    accessor: 'Avtor',
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

function GetNameAvtor(val: number) {
  let name = null;
  return instance.get( `user/filter?field=id&val=${val}`,
    {headers: {
      Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTI2MDc5NjAuMDY1OTY5LCJpYXQiOjE2NTI1MjE1NjAuMDY1OTY5LCJ1c2VybmFtZSI6Ildlc3QifQ.QmhkeAO2-a2iKmA4lhQlRN4_eJkph5xCC2VqsVXE8zc"
    }},
  ).then(response => {
    name = response.data.map((d: Project) => d.Name)[0];
    console.log("nmae1", name);
    return name;
  });
}

function MyTable() {
  const [data, setData] = useState<typeof rows>([]);
  useEffect(() => {
    instance.get( 'project',
      {headers: {
        Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTI2MDc5NjAuMDY1OTY5LCJpYXQiOjE2NTI1MjE1NjAuMDY1OTY5LCJ1c2VybmFtZSI6Ildlc3QifQ.QmhkeAO2-a2iKmA4lhQlRN4_eJkph5xCC2VqsVXE8zc"
      }},
    ).then(response => {
      let id = response.data.map((d: Project) => d.UserId)[0];
      console.log("id", id);
      let name;
      GetNameAvtor(id).then((value : string) =>{
        (response.data as (typeof rows)).map(a => a.Avtor = value);
      });
      setData(response.data);
    });
  }, [useDispatch()]);
  return (
    <Table rows={data} columns={columns} 
    borderBetweenColumns 
    stickyHeader
    isResizable
    zebraStriped="even"
    emptyRowsPlaceholder={<Text>Нет проектов</Text>}/>)
}

export const main = (props: Props) => {
  return MyTable();
}
