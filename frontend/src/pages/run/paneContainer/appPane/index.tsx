import {FC, useEffect, useLayoutEffect, useState} from 'react';
import {Button} from '@consta/uikit/Button';
import './index.css';
import {Loader} from "@consta/uikit/Loader";
import {Switch} from "@consta/uikit/Switch";
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Card } from '@consta/uikit/Card';
import { Select } from '@consta/uikit/Select';
import axios from 'axios';
import { Informer } from '@consta/uikit/Informer';
import { IDataFile } from './paneFile/types';
import { AttachIntentFile, AttachIntentInput, IPane, ProjectConfig, RunIntent, Status } from './types';
import { api, getIsRunning } from './api';
import ApiProject from '../../../../api/apiProject';
import authServer from '../../../../serviceAuth/authServer';
import { PanelHand } from './paneHand';
import { PanelFile } from './paneFile';
import { IsMobile } from '../../../../App';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';

export const AppPane: FC<IPane> = ({
                                       attachUrlFileUrl,
                                       dataFileUrl,
                                       runUrl,
                                       buildUrl,
                                       attachUrl,
                                       projectConfigUrl,
                                       isRunningUrl,
                                       fileContentUrl
                                   }) => {
    let defaultOutput: string = ""

    const [outPut, setOutput] = useState<string>(defaultOutput)
    const [isUseFile, setIsUseFile] = useState(false)
    const [isUseTimer, setIsUseTimer] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [status, setStatus] = useState(0);
    const [isWaiting, setWaiting] = useState(false);
    const [input, setInput] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<IDataFile | null | undefined>()
    const [dataFiles, setDataFiles] = useState<IDataFile[]>([])
    const [dataProjectConfigs, setDataProjectConfigs] = useState<ProjectConfig[]>([])
    const [selectedProjectConfig, setSelectedProjectConfig] = useState<ProjectConfig | null | undefined>()
    const [selectedProjectConfigId, setSelectedProjectConfigID] = useState<number>()
    const [config, setConfig] = useState<ProjectConfig>()
    const [projectContainerReplicaName, setProjectContainerReplicaName] = useState<string>("")
    const [labelInformer, setLabelInformer] = useState<string>("Выберите нужные параметры.");
    const [statusInformer, setStatusInformer] = useState<boolean>(true);
    const [author, setAuthor] = useState<string>("");                            
    const [accessBuild, setAccessBuild] = useState<boolean>(true);  
    type Item = string;
    const items: Item[] = ['Настройки', 'Область просмотра'];
    const [value, setValue] = useState<Item | null>(items[0]);

    useLayoutEffect(() => {
        getProjectConfigStatus()
        getProjectConfigs()
        getIsRunningApp()
    }, [])

    useEffect(() => {
        if (!isRunning) {
            console.log("not_running")
            setStatusInformer(true);
            sessionStorage.removeItem(`${projectContainerReplicaName}_data`)
        }
    }, [isRunning])
    
    useEffect(() => {
        if (config == null) return;
        const name = config.Name
        let replicaUuid :string
        if (!sessionStorage.getItem(`${name}`)){
            replicaUuid = crypto.randomUUID();
            sessionStorage.setItem(name,replicaUuid)
            setProjectContainerReplicaName(`${name}_${replicaUuid}`)
        } else {
            replicaUuid = sessionStorage.getItem(name) || ""
            defaultOutput = sessionStorage.getItem(`${name}_${replicaUuid}_data`) || ""
            setProjectContainerReplicaName(`${name}_${replicaUuid}`)
        }
    }, [config])

    useEffect(() => {
        if(selectedProjectConfigId == null) return;
        api<IDataFile[]>(`${dataFileUrl}/filter/project_config?project_config_id=${selectedProjectConfigId}`)
            .then(dataFiles => {
                setDataFiles(dataFiles)
            })
        api<ProjectConfig[]>(`${projectConfigUrl}/filter?field=id&val=${selectedProjectConfigId}`)
            .then(projectsConfigs => {
                setConfig(projectsConfigs[0])
                setStatus(projectsConfigs[0].Status)
                ApiProject.GetProjectById(projectsConfigs[0].ProjectId).then(res => {
                    setAuthor(res.data[0].Author); 
                    checkAuthor(res.data[0].Author);
                })
            })
        setSelectedFile(undefined)
    }, [selectedProjectConfigId])

    const getProjectConfigStatus = () => {
        if(selectedProjectConfigId == null) return;
        api<ProjectConfig[]>(`${projectConfigUrl}/filter?field=id&val=${selectedProjectConfigId}`)
            .then(projectsConfigs => {
                setStatus(projectsConfigs[0].Status)
            })
    }

    const getProjectConfigs = () => {
        api<ProjectConfig[]>(`${projectConfigUrl}`)
            .then(projectsConfigs => {               
                setDataProjectConfigs(projectsConfigs)
            })
    }

    const onSelectDataFile = (dataFile: IDataFile) => {
        setSelectedFile(dataFile)
    }

    const handleChange = ({value}: { value: string | null }) => setInput(value);

    const setOutPutClear = () => {
        setOutput("")
    }

    const buildProject = () => {
        if(selectedProjectConfigId == null) return;
        setWaiting(true);
        fetch(buildUrl, {
            method: 'POST',
            headers: {
                'projectConfigId': `${selectedProjectConfigId}`,
                'Authorization' : `Bearer ${authServer.getToken()}`,
            }
        })
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                if (response.status === 200){
                    setStatus(Status.Build);
                    setOutput("")
                    setLabelInformer("Вы успешно собрали проект")
                    setStatusInformer(true);
                }
            }).catch(err => {
                setOutput("")
                setLabelInformer("Упс, сборка не удалась")
                setStatusInformer(false);
            });
    };

    const runProject = () => {
        const intent: RunIntent = {
            id: `${selectedProjectConfigId}`,
            container_name: projectContainerReplicaName
        }
        setWaiting(true);
        fetch(runUrl, {
            method: 'POST',
            body: JSON.stringify(intent)
        })
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                response.text().then(t => {
                    setWaiting(false);
                    console.log(t)
                    getIsRunningApp()
                    setOutput("")
                    setLabelInformer("Проект запушен")
                    setStatusInformer(true);
                })
            }).catch(err => {
                setOutput("")
                setLabelInformer("Упс, запуск не удался")
                setStatusInformer(false);
            });
    };
      
    const attachInput = () => {
        if (!input) return
        const intent: AttachIntentInput = {
            Name: projectContainerReplicaName,
            Input: input
        }
        setWaiting(true);
        fetch(attachUrl, {
            method: 'POST',
            body: JSON.stringify(intent)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                response.text().then(text => {
                    setWaiting(false);
                    setOutput(text)
                    sessionStorage.setItem(`${projectContainerReplicaName}_data`, text)
                    getIsRunningApp()
                    setInput("")
                    setLabelInformer("Проект не запушен")
                })
            });
    }

    const instance = axios.create({
        baseURL: "http://localhost:8084"
    });

    const attachFile = () => {
        if (!selectedFile) return
        const intent: AttachIntentFile = {
            Name: projectContainerReplicaName,
            Data_id: selectedFile.ID.toString()
        }
        setWaiting(true);
        if(isUseTimer){
            instance.post (
                '/builder/attach/data/time',
                { name: projectContainerReplicaName, data_id: selectedFile.ID.toString(), project_id: selectedProjectConfig?.ProjectId?.toString()},
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    'Authorization' : `Bearer ${authServer.getToken()}`,
                  },
                },
            ).then(res => {
                setOutput(res.data)
                getIsRunningApp()
                setWaiting(false)
                setLabelInformer("Проект не запушен")
            });
        }
        else{
            fetch(attachUrlFileUrl, {
                method: 'POST',
                body: JSON.stringify(intent)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    response.text().then(text => {
                        setOutput(text)
                        getIsRunningApp()
                        setLabelInformer("Проект не запушен")
                    })
                    setWaiting(false);
                });
        }
    }

    const getIsRunningApp = () => {
        if(projectContainerReplicaName == null || projectContainerReplicaName == "") {
            setIsRunning(false)
            return
        }
        getIsRunning(isRunningUrl, projectContainerReplicaName)
            .then(res => setIsRunning(res))
    }

    const setChecked = () => {
        setIsUseFile(!isUseFile)
    }

    const setCheckedTimer = () => {
        setIsUseTimer(!isUseTimer)
    }

    function checkAuthor(author: string) {
        debugger
        authServer.getUserName().then(res => {
            debugger
            setAccessBuild(res.data.Email === author);
        }).catch(err => {
            setAccessBuild(false);
        })
    }

    const panelInfo = () => {
        return (
            <div>
                {!isUseFile ?
                    <PanelHand
                        handleChange={handleChange}
                        input={input || ""}
                        output={outPut || ""}
                        isRunning={isRunning}/>
                    :
                    <PanelFile
                        fileContentUrl={fileContentUrl}
                        dataFile={selectedFile}
                        output={outPut || ""}
                        attachFileUrl={attachUrlFileUrl}
                        status={status}/>
                }
            </div>
        );
    };
    
    const panelButtons = () => {
        return (
            <Card className={"card"}>
                <Select
                    items={dataProjectConfigs}
                    size={"l"}
                    placeholder="Выберите проект"
                    value={selectedProjectConfig}
                    onChange={(item) => {
                        if(item.value) {
                            setSelectedProjectConfig(item.value)
                            setSelectedProjectConfigID(item.value.ID)
                        }
                    }}
                    className={"button"}
                    getItemLabel={(item) => item.Name}
                    getItemKey={(item) => item.ID}
                />
                <Select
                    size={"l"}
                    className={"button"}
                    placeholder="Выберите данные"
                    items={dataFiles}
                    disabled={!isUseFile}
                    value={selectedFile}
                    onChange={(item) => {if(item.value) onSelectDataFile(item.value)}}
                    getItemLabel={(item) => item.FileName}
                    getItemKey={(item) => item.ID}
                />
                <Switch
                    className={"switcher"}
                    label={!isUseFile ? "Ручной ввод" : "Использовать данные"}
                    view={'primary'}
                    size={'l'}
                    checked={isUseFile}
                    onClick={setChecked}/>
                <Switch
                    className={"switcher"}
                    label={"Подсчет времени работы" }
                    view={'primary'}
                    size={'l'}
                    disabled={!isUseFile || authServer.getToken() === ""}
                    checked={isUseTimer}
                    onClick={setCheckedTimer}/>
                <Button
                    size='l'
                    label={'Собрать'}
                    width="full"
                    view="secondary"
                    disabled={!selectedProjectConfigId || !accessBuild}
                    onClick={buildProject}
                    className={"button"}/>
                <Button
                    size='l'
                    label='Запустить'
                    width="full"
                    view="secondary"
                    onClick={runProject}
                    disabled={status != Status.Build}
                    className={"button"}/>
                <Button
                    size='l'
                    label={'Выполнить'}
                    width="full"
                    view="secondary"
                    onClick={isUseFile ? attachFile : attachInput}
                    disabled={!isRunning}
                    className={"button"}/>
                <Button
                    label={"Очистить"}
                    size={'l'}
                    width="full"
                    view="secondary"
                    onClick={setOutPutClear}
                    disabled={outPut == ""}
                    className={"button"}/>
                <Informer 
                status={statusInformer ? "success" : "alert"}
                view="bordered" 
                label={labelInformer}/>
            </Card>
        )
    };

    const waiting = () => {
        return (
            <Loader className={"loader"}></Loader>
            );
    };

    return (
        IsMobile() ?
        <div>
            <ChoiceGroup
                value={value}
                onChange={({ value }) => setValue(value)}
                items={items}
                getLabel={(item) => item}
                multiple={false}
                size="l"
                name="Choice"
                view="secondary"
                truncate
            />
            {
                value === "Настройки" ?
                <div>
                    <Card>{panelButtons()}</Card>
                </div>
                :
                <div>
                    {isWaiting ? waiting() : <Card>{panelInfo()}</Card>}
                </div>
            }
        </div>
        :
        <Grid gap="xl" cols="4">
            <GridItem><Card>{panelButtons()}</Card></GridItem>
            <GridItem colStart="2" col="3">{isWaiting ? waiting() : <Card>{panelInfo()}</Card>}</GridItem>
        </Grid>
        );
};
