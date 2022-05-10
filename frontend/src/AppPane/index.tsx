import React, {FC, useLayoutEffect, useState} from 'react';
import {AttachIntentFile, AttachIntentInput, IPane, RunIntent, Status} from './types';
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
                                       isRunningUrl,
                                       projectId,
                                       currentStatus,
                                       projectName,
                                       fileContentUrl
                                   }) => {

    const [isUseFile, setIsUseFile] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [status, setStatus] = useState(currentStatus);
    const [isWaiting, setWaiting] = useState(false);
    const [input, setInput] = useState<string | null>(null);
    const [output, setOutput] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<IDataFile | null | undefined>()
    const [dataFiles, setDataFiles] = useState<IDataFile[]>([])
    let projectContainerReplicaName : string

    if (!sessionStorage.getItem(`${projectName}`)){
        const myuuid:string = crypto.randomUUID();
        sessionStorage.setItem(projectName,myuuid)
        projectContainerReplicaName = `${projectName}_${myuuid}`
    } else {
        projectContainerReplicaName = sessionStorage.getItem(projectName) || ""
    }

    useLayoutEffect(()=>{
        getProjectData()
        getIsRunning()
    },[])

    const getProjectData = () => {
        api<IDataFile[]>(dataFileUrl)
            .then(dataFiles => {
                setDataFiles(dataFiles)
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
        const intent: RunIntent = {
            id: projectId,
            container_name:projectContainerReplicaName
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
                    console.log(t)
                    getIsRunning()
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
                    getIsRunning()
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
                    getIsRunning()
                })
            });
    }

    const getIsRunning = () => {
        fetch(`${isRunningUrl}?container_name=${projectContainerReplicaName}`, {})
            .then((response) => {

                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                console.log(response)
                response.text().then(text => {
                    if (text == "true"){
                        setIsRunning(true)
                    } else {
                        setIsRunning(false)
                        sessionStorage.removeItem(projectName)
                    }
                })
            });
    }

    const setChecked = () => {
        setIsUseFile(!isUseFile)
    }

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
                        isRunning={isRunning}/>
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
                            disabled={status == Status.Default}
                            className={"button_action"}/>
                        <Button
                            size='s'
                            label={'Attach'}
                            onClick={isUseFile ? attachFile : attachInput}
                            disabled={!isRunning}
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
