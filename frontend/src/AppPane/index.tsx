import React, {FC, useLayoutEffect, useState} from 'react';
import {AttachIntentFile, AttachIntentInput, IPane, Status} from './types';
import {Button} from '@consta/uikit/Button';
import './index.css';
import {Loader} from "@consta/uikit/Loader";
import {Switch} from "@consta/uikit/Switch";
import {PanelHand} from "./PaneHand";
import {PanelFile} from "./PaneFile";
import {IDataFile} from "./PaneFile/types";
import {api} from "./api";




export const AppPane: FC<IPane> = ({
                                       attachUrlFileUrl,
                                       dataFileUrl,
                                       runUrl,
                                       buildUrl,
                                       attachUrl,
                                       projectId,
                                       currentStatus,
                                       projectName,
                                       statusCheckUrl,
                                       fileContentUrl
                                   }) => {
    const [isUseFile, setIsUseFile] = useState(false)
    const [status, setStatus] = useState(currentStatus);
    const [isWaiting, setWaiting] = useState(false);
    const [input, setInput] = useState<string | null>(null);
    const [output, setOutput] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<IDataFile | null | undefined>()
    const [dataFiles, setDataFiles] = useState<IDataFile[]>([])

    const getProjectData = () => {
        api<IDataFile[]>(dataFileUrl)
            .then(dataFiles => {
                setDataFiles(dataFiles)
            })
    }

    const onSelectDataFile = (dataFile: IDataFile) => {setSelectedFile(dataFile)}

    const handleChange = ({value}: { value: string | null }) => setInput(value);

    const setOutPutClear = () => {
        setOutput("")
    }

    const buildProject = () => {
        setWaiting(true);
        fetch(buildUrl, {
            method: 'POST',
            headers: {
                'id': projectId,
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
        setWaiting(true);
        fetch(runUrl, {
            method: 'POST',
            headers: {
                'id': projectId,
            }
        })
            .then((response) => {
                setWaiting(false);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                setStatus(Status.Running);
                setOutput("")
            });
    };

    const attachInput = () => {
        if (!input) return
        const intent: AttachIntentInput = {
            Name: projectName,
            Input: input
        }
        fetch(attachUrl, {
            method: 'POST',
            body: JSON.stringify(intent)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                response.text().then(text => {
                    setOutput(text)
                    getStatus()
                    setInput("")
                })
            });
    }

    const attachFile = () => {
        if (!selectedFile) return
        const intent: AttachIntentFile = {
            Name: projectName,
            Data_id: selectedFile.ID.toString()
        }
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
                    getStatus()
                })
            });
    }

    const getStatus = () => {

        fetch(`${statusCheckUrl}?field=id&val=${projectId}`, {})
            .then((response) => {

                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                console.log(response)
                response.text().then(text => {
                    setStatus(Number(text))
                })
            });
    }

    const setChecked = () => {
        setIsUseFile(!isUseFile)
    }


    useLayoutEffect(()=> {
        getProjectData()
    },[])

    const content = () => {
        return (
            <div>
                <Switch
                    className={"switcher"}
                    label={!isUseFile ? "Ручной ввод" : "Использовать данные"}
                    view={'primary'}
                    size={'s'}
                    checked={isUseFile}
                    onClick={setChecked}/>

                {!isUseFile ?
                    <PanelHand
                        handleChange={handleChange}
                        input={input || ""}
                        output={output || ""}
                        status={status}/>
                    :
                    <PanelFile
                        fileContentUrl={fileContentUrl}
                        dataFile={selectedFile}
                        dataFiles={dataFiles}
                        onSetDataFile={onSelectDataFile}
                        output={output || ""}
                        attachFileUrl={attachUrlFileUrl}
                        status={status}/>
                }
                <div className={"button_pane"}>
                    <div className={"button_pane_left"}>
                        <Button
                            size='s'
                            label={'Build'}
                            onClick={buildProject}
                            className={"button_action"}/>
                        <Button
                            size='s'
                            label={'Run'}
                            onClick={runProject}
                            disabled={status === Status.Default}
                            className={"button_action"}/>
                        <Button
                            size='s'
                            label={'Attach'}
                            onClick={isUseFile ? attachFile : attachInput}
                            disabled={status !== Status.Running}
                            className={"button_action"}/>
                    </div>
                    <div className={"button_pane_right"}>
                        <Button
                            label={"Clear"}
                            size={'s'}
                            onClick={setOutPutClear}
                            className={"button_action_right"}/>
                    </div>
                </div>
            </div>
        );
    };

    const waiting = () => {
        return (<Loader className={"loader"}/>);
    };
    return isWaiting ? waiting() : content();
};



/* Использовать так
*
*
* const [config, setConfig] = useState<ProjectConfig>()

    const getProjectDocStatus = () => {
        api<ProjectConfig[]>("http://localhost:8084/project_config/filter?field=id&val=4")
            .then(projectsConfigs => {
                setConfig(projectsConfigs[0])
            })
    }

    useLayoutEffect(()=>{
        getProjectDocStatus()
    },[])


    if (config) {
        return (
            <Theme preset={presetGpnDefault}>
                <AppPane buildUrl={'http://localhost:8084/project_config/build'}
                         dataFileUrl={"http://localhost:8084/data"}
                         runUrl={'http://localhost:8084/project_config/run'}
                         attachUrl={"http://localhost:8084/project_config/attach"}
                         attachUrlFileUrl={"http://localhost:8084/project_config/attach/data"}
                         statusCheckUrl={"http://localhost:8084/project_config/status"}
                         fileContentUrl={"http://localhost:8084/data/content"}
                         projectId={config.ID.toString()}
                         projectName={config.Name}
                         currentStatus={config.Status}
                 />
            </Theme>
        )
    } else {
        return <div>Load</div>
    }
    *
    *
    * */