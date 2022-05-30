import { Column } from "@consta/charts/Column";
import { Button } from "@consta/uikit/Button";
import { Card } from "@consta/uikit/Card";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { useEffect, useState } from "react";
import ApiData, { Data } from "../../api/apiData";
import { Combobox } from '@consta/uikit/Combobox';
import ApiProject, { Project } from "../../api/apiProject";
import { Text } from '@consta/uikit/Text';
import style from './dashboard.module.css'
import { Informer } from '@consta/uikit/Informer';
import ApiTimeProjectData, {TimeProjectData} from "../../api/apiTimeProjectData";

export function Chart() {
    const [value, setValue] = useState<TimeProjectData[]>([]);

    const [Projects, setProjects] = useState<Project[]>([])
    const [selectProject, setSelectProject] = useState<Project[] | null>()
    const [ProjectId, setProjectId] = useState<number[]>([])

    const [Datas, setDatas] = useState<Data[]>([])
    const [selectData, setSelectData] = useState<Data[] | null>()
    const [DataId, setDataId] = useState<number[]>([])

    useEffect(() => {
      debugger;
      getProjects();
      getDatas();
    }, [])

    useEffect(() => {
      setValue([]);
      getDataForChart();
    }, [ProjectId, DataId])

    function getProjects() {
        ApiProject.GetAllProject().then(res => setProjects(res.data));
    }

    function getDatas() {
      ApiData.getAllData().then(res => setDatas(res.data));
    }

    function getDataForChart() {
        if(ProjectId.length != 0 && selectProject) {
          ProjectId.map(id => {
            ApiTimeProjectData.getAllDataByProjectId(id).then(res => {
                res.data.map(dataId => {
                      ApiData.getDataById(dataId.DataId).then(resData => {
                          resData.data.map(file => {
                              dataId.DataName = file.FileName;
                          });
                          ApiProject.GetProjectById(id).then(resProject => {
                            dataId.ViewId = resProject.data[0].Name;
                            setValue(old => [...old, dataId]);
                          }) 
                    }) 
                })
            })
          });
        }
        if(DataId != null && selectData){
          DataId.map(id => {
              ApiTimeProjectData.getAllProjectByDataId(id).then(res => {
                res.data.map(projectId => {
                  ApiProject.GetProjectById(projectId.ProjectId).then(resProject => {
                      projectId.DataName = resProject.data[0].Name;
                      ApiData.getDataById(id).then(resData => {
                          projectId.ViewId = resData.data[0].FileName;
                          setValue(old => [...old, projectId]);
                      })
                    }) 
                })
              })
          });
        }
    }

    function Filter() {
        return(
          <div>
            <Text view='secondary'>Выберите проект</Text>
            <Combobox
              placeholder="Выберите проект"
              items={Projects}
              value={selectProject}
              disabled={DataId.length != 0}
              multiple
              onChange={(item) =>{ 
              if (item.value) {
                setProjectId([]);
                setSelectProject(item.value)
                item.value.map(id => {
                  setProjectId(old => [...old, id.ID])
                })
              }}}
              getItemKey={(item) => item.ID}
              getItemLabel={(item) => item.Name}
            />
            <Text view='secondary'>Выберите данные</Text>
            <Combobox
              placeholder="Выберите данные"
              items={Datas}
              value={selectData}
              disabled={ProjectId.length != 0}
              multiple
              onChange={(item) =>{ 
              if (item.value) {
                setDataId([]);
                setSelectData(item.value)
                item.value.map(id => {
                  setDataId(old => [...old, id.ID])
                })
              }}}
              getItemKey={(item) => item.ID}
              getItemLabel={(item) => item.FileName}
            />
          </div>
        )
    }

    function OutChart() {
      return (
        <Card>
          <Grid gap="xl" cols="4">
            <GridItem colStart="1" col="1" row="1">
              <Filter></Filter>
              <Button 
                className={style.clearButton}
                label="Сбросить"
                view="secondary"
                onClick={() => {
                  setProjectId([]);
                  setSelectProject(null);
                  setDataId([]);
                  setSelectData(null);
                }}
              />
              <Informer 
                status="system" 
                view="bordered" 
                label="По оси X расположены названия проектов\данных, взависимости от вашего выбора.
                По оси Y время работы программы в секундах." />
            </GridItem>
            <GridItem colStart="2" col="4" row="1">
              <Column
                data={value}
                xField="DataName"
                yField="Duration"
                seriesField="ViewId"
                isGroup/>
            </GridItem>
          </Grid>
        </Card>
      )
    }
    return OutChart();
}