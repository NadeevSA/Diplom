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
        },
        {
          title: 'Скачать',
          accessor: "Download",
          align: 'center',
          renderCell: (row) => 
            <div>
              <Button label="Скачать" view="secondary" size="s" onClick={() => {download(row.ID)}}/>
            </div>
        },
      ];
      
      function download(id: number) {
        debugger;
        ApiProjectConfig.getProjectConfigById(id).then(res => {
          debugger;
          console.log(res.data[0].File);
          var x = base64ToArrayBuffer(res.data[0].File);
          saveByteArray(x, res.data[0].ProjectFile);
        })
      } 

      function base64ToArrayBuffer(base64 : string) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
           var ascii = binaryString.charCodeAt(i);
           bytes[i] = ascii;
        }
        return bytes;
      }

      function saveByteArray(byte: ArrayBuffer, name: string) {
        var blob = new Blob([byte], {type: "application/zip"});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${name}`);
        link.click();
      };

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
        Download?: typeof Button
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