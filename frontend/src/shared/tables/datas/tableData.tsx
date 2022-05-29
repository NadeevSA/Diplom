import { Button } from "@consta/uikit/Button";
import { Table, TableColumn } from "@consta/uikit/Table";
import { useEffect, useState } from "react";
import authServer from "../../../serviceAuth/authServer";
import { Text } from '@consta/uikit/Text';
import ApiData, { Data } from "../../../api/apiData";

export function TableData(props: {hidden: boolean, newData: Data | null | undefined}) {
    const columns: TableColumn<typeof rowsData[number]>[] = [
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
          hidden: true,
          /*
          renderCell: (row) => <Button 
          view="secondary"
          width="full"
          label={"Удалить"}
          onClick={() => DeleteData(row.ID)}/> */
        }
        ];
      
      const [data, setData] = useState<typeof rowsData>([]);
      const [col, setCol] = useState<TableColumn<typeof rowsData[number]>[]>(columns);
    
      useEffect(() => {
        if(props.newData != null) {
          setData(old => [...old, props.newData!]);
        } 
      }, [props.newData]);
    
      useEffect(() => {
        columns.map(v => {
          if(v.title == "Автор") {
            v.hidden = props.hidden;
          }
          if(v.title == "Действие") v.hidden = !props.hidden;
        });
        setCol(columns);
        if (!props.hidden) {
          ApiData.getAllData().then(res => {
            setData(res.data);
          })
        } 
        else {
          authServer.getUserName().then(res => {
            ApiData.getDataById(res.data.ID).then(res => {
              setData(res.data);
            })
          })
        }
      }, []);
    
      let rowsData: {
        ID: number;
        id: string;
        FileName: string;
        Label: string;
        Delete?: typeof Button;
      }[]
    
      return (
          <Table rows={data} columns={col}
          borderBetweenColumns
          stickyHeader
          isResizable
          zebraStriped="even"
          emptyRowsPlaceholder={<Text>Нет данных</Text>}/>
      )
}