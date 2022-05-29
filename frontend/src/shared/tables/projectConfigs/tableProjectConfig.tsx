import { Button } from "@consta/uikit/Button";
import { Table, TableColumn } from "@consta/uikit/Table";
import { useEffect, useState } from "react";
import { Text } from '@consta/uikit/Text';
import ApiProjectConfig from "../../../api/apiProjectConfig";

export const TableProjectConfigs = () => {
    const columns: TableColumn<typeof rowsProjectConfig[number]>[] = [
        {
          title: '№',
          accessor: 'id',
          align: 'center',
          hidden: true,
        },
        {
          title: 'Команда для сборки',
          accessor: 'BuildCommand',
          align: 'center',
        },
        {
          title: 'Название проекта',
          accessor: 'Name',
          align: 'center',
        },
        {
          title: 'Запускаемый файл',
          accessor: 'RunFile',
          align: 'center',
        },
        {
          title: 'Название архива с проектом',
          accessor: 'ProjectFile',
          align: 'center',
        }
        ];
      
      const [data, setData] = useState<typeof rowsProjectConfig>([]);
    
      useEffect(() => {
        ApiProjectConfig.getAllProjectConfigs().then(res => {
            setData(res.data);
          })
      }, []);
    
      let rowsProjectConfig: {
        ID: number;
        id: string,
        BuildCommand: string
        Name: string
        RunFile: string
        ProjectFile: string
      }[]
    
      return (
          <Table rows={data} columns={columns}
          borderBetweenColumns
          stickyHeader
          isResizable
          zebraStriped="even"
          emptyRowsPlaceholder={<Text>Нет данных</Text>}/>
      )
}