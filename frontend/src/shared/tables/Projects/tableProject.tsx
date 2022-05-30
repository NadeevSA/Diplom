import { Button } from "@consta/uikit/Button";
import { Table, TableColumn } from "@consta/uikit/Table";
import { useEffect, useState } from "react";
import authServer from "../../../serviceAuth/authServer";
import { Text } from '@consta/uikit/Text';
import ApiProject, { Project } from "../../../api/apiProject";
import { ProjectPage } from "../../../modals/projectConfig/project";

export function TableProject (props: {hidden: boolean, newProject: Project | null | undefined}) {
  const columns: TableColumn<typeof rowProjects[number]>[] = [
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
      renderCell: (row) => <ProjectPage name={row.Name} id={row.ID} onDelete={setDeleteId}/>
    },
  ];
  
  const [data, setData] = useState<typeof rowProjects>([]);
  const [col, setCol] = useState<TableColumn<typeof rowProjects[number]>[]>(columns);
  const [deleteId, setDeleteId] = useState<number>(0);

  useEffect(() => {
    if(deleteId != 0) {
      setData(data.filter(d => d.ID !== deleteId));
    } 
  }, [deleteId]);
  
  function onDelete(id: number) {
    debugger
    setData(data.filter(d => d.ID !== id));
    console.log(data);
  }
  
  useEffect(() => {
    if(props.newProject != null) {
      setData(old => [...old, props.newProject!]);
    } 
  }, [props.newProject]);

  useEffect(() => {
    columns.map(v => {
      if(v.title == "Автор") {
        v.hidden = props.hidden;
      }
      if(v.title == "Действие") v.hidden = !props.hidden;
    });
    setCol(columns);
    if (!props.hidden) {
      ApiProject.GetAllProject().then(res => {
        setData(res.data);
      })
    } 
    else {
      authServer.getUserName().then(res => {
        ApiProject.GetProjectByUserId(res.data.ID).then(res => {
          setData(res.data);
        })
      })
    }
  }, []);

  let rowProjects: {
    id: string;
    ID: number;
    Name: string;
    UserId: number;
    Author: string;
    Description: string;
    Action?: typeof Button;
    Download?: typeof Button;
  }[]

  return (
      <Table rows={data} columns={col}
      borderBetweenColumns
      stickyHeader
      isResizable
      zebraStriped="even"
      emptyRowsPlaceholder={<Text>Нет проектов</Text>}/>
  )
}