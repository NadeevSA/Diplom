import { Button } from "@consta/uikit/Button";
import { Table, TableColumn } from "@consta/uikit/Table";
import { useEffect, useMemo, useState } from "react";
import authServer from "../../../serviceAuth/authServer";
import { Text } from '@consta/uikit/Text';
import ApiData, { Data } from "../../../api/apiData";
import { DataContent } from "../../../modals/dataContent/dataContent";
import { HeaderSearchBar } from "@consta/uikit/Header";
import style from '../tables.module.css'
import { IsMobile } from "../../../App";
import { Card } from "@consta/uikit/Card";

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
          title: 'Автор',
          accessor: 'Author',
          align: 'center',
        },
        {
          title: 'Описание',
          accessor: 'Label',
          align: 'center',
        },
        {
          title: 'Содержимое',
          accessor: 'Content',
          align: 'center',
          renderCell: (row) => 
            <div className={style.buttons}>
              <DataContent id={row.ID} name={row.FileName}></DataContent>
            </div>
        },
        {
          title: 'Удалить',
          accessor: 'Delete',
          align: 'center',
          hidden: true,
          renderCell: (row) => 
            <div className={style.buttons}>
              <Button className={style.button} label="Удалить" size="s" view="secondary" onClick={() => {setDeleteId(row.ID)}}/>
            </div>
        }
        ];
      
      const [data, setData] = useState<typeof rowsData>([]);
      const [col, setCol] = useState<TableColumn<typeof rowsData[number]>[]>(columns);
      const [deleteId, setDeleteId] = useState<number>(0);
      const [search, setSearch] = useState<string | null>(null);

      useEffect(() => {
        if(deleteId != 0) {
          ApiData.deleteData(deleteId).then(_ => {
              setData(data.filter(d => d.ID !== deleteId));
          })
        } 
      }, [deleteId]);

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
          if(v.title == "Удалить") {
            v.hidden = !props.hidden;
          }
        });
        setCol(columns);
        if (!props.hidden) {
          ApiData.getAllData().then(res => {
            setData(res.data);
          })
        } 
        else {
          authServer.getUserName().then(res => {
            ApiData.getDataByUserEmail(res.data.Email).then(res => {
              setData(res.data);
            })
          })
        }
      }, []);
    
      let rowsData: {
        ID: number;
        id: string;
        FileName: string;
        Author: string,
        Label: string;
        Delete?: typeof Button;
        Content?: typeof Button;
      }[]
    
      const searchTable = useMemo(() =>{
        if(search != null) {
            return data.filter(d => d.FileName.toLowerCase().includes(search));
        }
        else{
          return null;
        }
      },[search])
    
      const handleChange = ({ value }: { value: string | null}) => setSearch(value);

      return (
        IsMobile() ? 
        <div>
          <HeaderSearchBar
            placeholder="я ищу"
            label="поиск"
            value={search}
            className={style.searchBar}
            onChange={handleChange}
          />
          {
        searchTable ?
        searchTable.map((item, index) => (
            <div key={index}>
             <Card className={style.cardsForMobile}>
                <Text weight="bold" className={style.cardForMobile}>Имя файла: {item.FileName}</Text>
                <Text className={style.cardForMobile}>Автор: {item.Author}</Text>
                <Text className={style.cardForMobile}>Описание: {item.Label}</Text>
                <DataContent id={item.ID} name={item.FileName}></DataContent>
              </Card>
            </div>
        ))
        :
        data.map((item, index) => (
            <div key={index}>
            <Card className={style.cardsForMobile}>
                <Text weight="bold" className={style.cardForMobile}>Имя файла: {item.FileName}</Text>
                <Text className={style.cardForMobile}>Автор: {item.Author}</Text>
                <Text className={style.cardForMobile}>Описание: {item.Label}</Text>
                <DataContent id={item.ID} name={item.FileName}></DataContent>
              </Card>
            </div>
        ))
        } 
        </div>
        :
        <div>
          <HeaderSearchBar
            placeholder="я ищу"
            label="поиск"
            value={search}
            className={style.searchBar}
            onChange={handleChange}
          />
          <Table rows={searchTable ?? data} columns={col}
            borderBetweenColumns
            stickyHeader
            isResizable
            zebraStriped="even"
            emptyRowsPlaceholder={<Text>Нет данных</Text>}/>
        </div>
      )
}