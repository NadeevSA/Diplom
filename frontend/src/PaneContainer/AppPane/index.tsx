import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import {AttachIntentFile, AttachIntentInput, IPane, ProjectConfig, RunIntent, Status} from './types';
import {Button} from '@consta/uikit/Button';
import './index.css';
import {Loader} from "@consta/uikit/Loader";
import {Switch} from "@consta/uikit/Switch";
import {PanelHand} from "./PaneHand";
import {PanelFile} from "./PaneFile";
import {IDataFile, IProjectConfig} from "./PaneFile/types";
import {api, getIsRunning} from "./api";
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Card } from '@consta/uikit/Card';
import { Select } from '@consta/uikit/Select';
import { Text } from '@consta/uikit/Text';

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
    const [isRunning, setIsRunning] = useState(true)
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

    useLayoutEffect(() => {
        getProjectConfigStatus()
        getProjectConfigs()
        getIsRunningApp()
    }, [])

    useEffect(() => {
        if (!isRunning) {
            console.log("not_running")
            sessionStorage.removeItem(`${projectContainerReplicaName}_data`)
        }
    }, [isRunning])

    useEffect(() => {
        if(selectedProjectConfigId == null) return;
        api<IDataFile[]>(`${dataFileUrl}/filter/project_config?project_config_id=${selectedProjectConfigId}`)
            .then(dataFiles => {
                setDataFiles(dataFiles)
        })
    }, [selectedProjectConfigId])
    
    useEffect(() => {
        if (config == null) return;
        const name = config.Name
        let replicaUuid :string
        debugger
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
        api<ProjectConfig[]>(`${projectConfigUrl}/filter?field=id&val=${selectedProjectConfigId}`)
            .then(projectsConfigs => {
                setConfig(projectsConfigs[0])
            })
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
                'Authorization' : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTMyMjg5OTkuMjk5NTM4OSwiaWF0IjoxNjUzMTQyNTk5LjI5OTUzODksInVzZXJuYW1lIjoiU2VyZWdhIn0.8ykwPIpg2UpQp4_-xVy6BBKmG7-5JArh1XRFddOLwRQ",
            }
        })
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                setStatus(Status.Build);
                setOutput("")
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
                })
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
                })
            });
    }

    const attachFile = () => {
        if (!selectedFile) return
        const intent: AttachIntentFile = {
            Name: projectContainerReplicaName,
            Data_id: selectedFile.ID.toString()
        }
        setWaiting(true);
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
                })
                setWaiting(false);
            });
    }

    const getIsRunningApp = () => {
        if(projectContainerReplicaName == null) return;
        getIsRunning(isRunningUrl, projectContainerReplicaName)
            .then(res => setIsRunning(res))
    }

    const setChecked = () => {
        setIsUseFile(!isUseFile)
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
                    className={"button"}
                    label={!isUseFile ? "Ручной ввод" : "Использовать данные"}
                    view={'primary'}
                    size={'l'}
                    checked={isUseFile}
                    onClick={setChecked}/>
                <Button
                    size='l'
                    label={'Собрать'}
                    width="full"
                    view="secondary"
                    disabled={!selectedProjectConfigId}
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
            </Card>
        )
    };

    const waiting = () => {
        return (
            <Loader className={"loader"}></Loader>
            );
    };

    return (
        <Grid gap="xl" cols="4">
            <GridItem><Card>{panelButtons()}</Card></GridItem>
            <GridItem colStart="2" col="3">{isWaiting ? waiting() : <Card>{panelInfo()}</Card>}</GridItem>
        </Grid>
        );
};
