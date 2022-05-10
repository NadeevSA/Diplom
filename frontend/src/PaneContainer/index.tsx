import React, {useLayoutEffect, useState} from "react";
import {ProjectConfig} from "./AppPane/types";
import {AppPane} from "./AppPane";
import {api} from "./AppPane/api";
import {Button} from "@consta/uikit/Button";
import {Loader} from "@consta/uikit/Loader";
import './index.css';

export const AppContent = () => {

    const [config, setConfig] = useState<ProjectConfig>()
    const [isPaneOpened, setOpenPane] = useState(false)
    const buildUrl ='http://localhost:8084/builder/build'
    const dataFileUrl = "http://localhost:8084/data"
    const runUrl = 'http://localhost:8084/builder/run'
    const attachUrl = "http://localhost:8084/builder/attach"
    const statusCheckUrl = "http://localhost:8084/builder/attach/data"
    const fileContentUrl = "http://localhost:8084/data/content"
    const isRunningUrl = "http://localhost:8084/builder/is_running"
    const getProjectDocStatus = () => {
        api<ProjectConfig[]>("http://localhost:8084/project_config/filter?field=id&val=1")
            .then(projectsConfigs => {
                setConfig(projectsConfigs[0])
            })
    }

    useLayoutEffect(()=>{
        getProjectDocStatus()
    },[])


    if (config) {
        const name = config.Name
        let projectContainerReplicaName : string
        let defaultOutput: string = ""
        let replicaUuid :string
        if (!sessionStorage.getItem(`${name}`)){
            replicaUuid = crypto.randomUUID();
            sessionStorage.setItem(name,replicaUuid)
            projectContainerReplicaName = `${name}_${replicaUuid}`
        } else {
            replicaUuid = sessionStorage.getItem(name) || ""
            defaultOutput = sessionStorage.getItem(`${name}_${replicaUuid}_data`) || ""
            projectContainerReplicaName = `${name}_${replicaUuid}`
        }

        const onOpen = () => setOpenPane(true)
        const onClose = () => {
            setOpenPane(false)
        }

        return (
                <div>
                    <div className={"buttons_open_close"}>
                        <Button label={"open"} size={"xs"} onClick={onOpen}/>
                        <Button label={"close"} size={"xs"} onClick={onClose}/>
                    </div>
                    {isPaneOpened && <AppPane buildUrl={buildUrl}
                                              defaultOutput={defaultOutput || ""}
                                              dataFileUrl={dataFileUrl}
                                              runUrl={runUrl}
                                              attachUrl={attachUrl}
                                              attachUrlFileUrl={attachUrl}
                                              statusCheckUrl={statusCheckUrl}
                                              fileContentUrl={fileContentUrl}
                                              isRunningUrl={isRunningUrl}
                                              projectId={config.ID.toString()}
                                              projectContainerReplicaName={projectContainerReplicaName}
                                              currentStatus={config.Status}
                    />}
                </div>
        )
    } else {
        return <Loader className={"loader"}/>
    }
};