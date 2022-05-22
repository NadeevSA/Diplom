import {Button} from '@consta/uikit/Button';
import {Modal} from '@consta/uikit/Modal';
import {TextField} from '@consta/uikit/TextField';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import style from './project.module.css';
import {DragNDropField} from "@consta/uikit/DragNDropField";
import {Attachment} from "@consta/uikit/Attachment";
import {Text} from "@consta/uikit/Text";
import {
    AddProjectConfig,
    GetConfigurationFiltered,
    GetDockerConfigs,
    IConfiguration,
    IDockerConfiguration, PutProjectConfig
} from "./queries";
import {Combobox} from "@consta/uikit/Combobox";

export function ProjectPage(props: { name: string, id: string }) {
    const [selectedDockerConfig, setSelectedDockerConfig] = useState<IDockerConfiguration|null>()
    const [dockerConfigs, setDockerConfigs] = useState<IDockerConfiguration[]>([])
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [currentConfig, setCurrentConfig] = useState<IConfiguration | null>(null)

    const [projectName, setProjectName] = useState<string | null>(null);
    const handleProjectName = ({value}: { value: string | null }) => setProjectName(value);

    const [projectCommandBuild, setProjectCommandBuild] = useState<string | null>(null);
    const handleProjectCommandBuild = ({value}: { value: string | null }) => setProjectCommandBuild(value);

    const [runFile, setRunFile] = useState<string | null>(null);
    const handleRunFile = ({value}: { value: string | null }) => setRunFile(value);

    const [projectPathToEntry, setPathToEntry] = useState<string | null>(null);
    const handlePathToEntry = ({value}: { value: string | null }) => setPathToEntry(value);

    const [file, setFile] = useState<File>()

    useLayoutEffect(() => {
        GetDockerConfigs().then(dockerConfigs => {
            if (dockerConfigs){
                setDockerConfigs(dockerConfigs)
                GetConfigurationFiltered(`field=project_id&val=${props.id}`).then(configuration => {
                    if (configuration && configuration.length > 0) {
                        const currentConfig = configuration[0]
                        setCurrentConfig(currentConfig)
                    }
                })
            }
        })

    },[])

    useEffect(() => {
        if (isModalOpen && currentConfig){
            setProjectName(currentConfig.Name)
            setRunFile(currentConfig.ProjectFile)
            setProjectCommandBuild(currentConfig.BuildCommand)
            setPathToEntry(currentConfig.PathToEntry)
            setSelectedDockerConfig(dockerConfigs.find(conf => conf.ID === currentConfig.DockerConfigId) || null)
        }
    }, [isModalOpen])

    const onBtnClick = () => {
        if (currentConfig && projectName && projectPathToEntry && projectCommandBuild && runFile && selectedDockerConfig){
            PutProjectConfig(currentConfig?.ID,props.id, selectedDockerConfig.ID, projectName, projectCommandBuild, runFile, projectPathToEntry, file)
            return
        }
        if (projectName && projectPathToEntry && projectCommandBuild && runFile && file && selectedDockerConfig) {
            AddProjectConfig(props.id, selectedDockerConfig.ID, projectName, projectCommandBuild, runFile, projectPathToEntry, file)
        }
    }

    return (
        <div>
            <Button
                size="s"
                view="secondary"
                label="Конфигурация"
                onClick={() => setIsModalOpen(true)}
            />
            <Modal
                isOpen={isModalOpen}
                hasOverlay
                onClickOutside={() => setIsModalOpen(false)}
                onEsc={() => setIsModalOpen(false)}>
                <div className={style.model_form}>
                    <div className={style.label}>Конфигурация</div>
                    <TextField width='full' className={style.input_field} onChange={handleProjectName}
                               value={projectName}
                               type="text" placeholder="Имя приложения"/>
                    <TextField width='full' className={style.input_field} onChange={handleProjectCommandBuild}
                               value={projectCommandBuild}
                               type="text" placeholder="Команда сборки"/>
                    <TextField width='full' className={style.input_field} onChange={handleRunFile} value={runFile}
                               type="text" placeholder="Имя исполняемого файла"/>
                    <TextField width='full' className={style.input_field} onChange={handlePathToEntry}
                               value={projectPathToEntry}
                               type="text" placeholder="Путь к проекту в папке"/>
                    <Combobox
                        className={style.input_field}
                        placeholder="Выберите конфигурацию"
                        items={dockerConfigs}
                        value={selectedDockerConfig}
                        onChange={({ value }) => setSelectedDockerConfig(value)}
                        getItemKey={(item) => item.ID}
                        getItemLabel={(item) => item.Description}
                    />
                    <div className={style.input_field}>
                        <DragNDropField multiple={false} onDropFiles={(files) => setFile(files[0])}/>
                    </div>
                    {file ?
                        <Attachment
                            key={file?.name}
                            fileName={file?.name}
                            fileExtension={file.name.match(/\.(?!.*\.)(\w*)/)?.[1] || ""}
                            fileDescription={file?.type}/>
                        :
                        <Text>Выберите файл</Text>}
                    <Button label={'Прикрепить'} onClick={onBtnClick}/>
                </div>
            </Modal>
        </div>
    );
}
