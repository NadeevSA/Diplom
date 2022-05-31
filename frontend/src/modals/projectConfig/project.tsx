import {Button} from '@consta/uikit/Button';
import {Modal} from '@consta/uikit/Modal';
import {TextField} from '@consta/uikit/TextField';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import style from './project.module.css';
import {DragNDropField} from "@consta/uikit/DragNDropField";
import {Attachment} from "@consta/uikit/Attachment";
import {Text} from "@consta/uikit/Text";
import {
    AddProjectConfig, DeleteProjectConfig,
    GetConfigurationFiltered,
    GetDockerConfigs,
    IConfiguration,
    IDockerConfiguration,
    PutProjectConfig
} from "./queries";
import {Combobox} from "@consta/uikit/Combobox";
import ApiProjectConfig from '../../api/apiProjectConfig';
import { Informer } from '@consta/uikit/Informer';

export function ProjectPage(props: { name: string, id: number, onDelete: (id: number) => void}) {
    const [selectedDockerConfig, setSelectedDockerConfig] = useState<IDockerConfiguration|null>()
    const [dockerConfigs, setDockerConfigs] = useState<IDockerConfiguration[]>([])
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [currentConfig, setCurrentConfig] = useState<IConfiguration | null>(null)

    const [projectCommandBuild, setProjectCommandBuild] = useState<string | null>(null);
    const handleProjectCommandBuild = ({value}: { value: string | null }) => setProjectCommandBuild(value);

    const [runFile, setRunFile] = useState<string | null>(null);
    const handleRunFile = ({value}: { value: string | null }) => setRunFile(value);

    const [projectPathToEntry, setPathToEntry] = useState<string | null>(null);
    const handlePathToEntry = ({value}: { value: string | null }) => setPathToEntry(value);

    const [file, setFile] = useState<File>()
    const [infoData, setInfoData] = useState<{status: boolean, msg: string}>({status: true, msg: "Введите параметры и выберите файл"})

    useLayoutEffect(() => {
        GetDockerConfigs().then(dockerConfigs => {
            if (dockerConfigs){
                setDockerConfigs(dockerConfigs)
            }
        })
    },[])

    useEffect(() => {
        if (isModalOpen && currentConfig){
            debugger;
            setRunFile(currentConfig.RunFile)
            setProjectCommandBuild(currentConfig.BuildCommand)
            setPathToEntry(currentConfig.PathToEntry)
            setFile(currentConfig.File)
            setSelectedDockerConfig(dockerConfigs.find(conf => conf.ID === currentConfig.DockerConfigId) || null)
        }

    }, [isModalOpen])

    const onBtnClick = () => {
        if (currentConfig  && projectPathToEntry && projectCommandBuild && runFile && selectedDockerConfig){
            PutProjectConfig(currentConfig?.ID, props.id.toString(), selectedDockerConfig.ID, projectCommandBuild, runFile, projectPathToEntry, file)
                .then((resp) => {
                    if (resp.status === 200){
                        setIsModalOpen(false)
                    }else {
                        alert(resp.statusText)
                    }
                }).catch(err => {
                    setInfoData({status: false, msg: "Уппс, что-то пошло не так"})
                })
            return
        }
        else {
            setInfoData({status: false, msg: "Вы не ввели все параметры"})
        }
        
        if (projectPathToEntry && projectCommandBuild && runFile && file && selectedDockerConfig) {
            AddProjectConfig(props.id.toString(), selectedDockerConfig.ID, projectCommandBuild, runFile, projectPathToEntry, file)
                .then((resp) => {
                    if (resp.status === 200){
                        setIsModalOpen(false)
                    } else {
                        alert(resp.statusText)
                    }
                }).catch(err => {
                    setInfoData({status: false, msg: "Уппс, что-то пошло не так"})
                })
        }
        else {
            setInfoData({status: false, msg: "Вы не ввели все параметры"})
        }
    }

    const onDeleteProject = () => {
        setIsModalOpen(false)
        debugger
        ApiProjectConfig.deleteProjectConfig(props.id)
            .then(resp => {
                if (resp.status == 200){
                    debugger
                    props.onDelete(props.id)
                }
            })
            .catch(err => alert(err))
    }
    
    const onSetModelOpen = () => {
        GetConfigurationFiltered(`field=project_id&val=${props.id}`).then(configuration => {
            if (configuration && configuration.length > 0) {
                const currentConfig = configuration[0]
                setCurrentConfig(currentConfig)
            }
            setInfoData({status: true, msg: "Введите параметры и выберите файл"})
            setIsModalOpen(true)
        })
    }

    return (
        <div>
            <div className={style.buttons}>
                
                <div className={style.button}>
                    <Button
                        size="s"
                        view="secondary"
                        label="Конфигурация"
                        onClick={() => onSetModelOpen()}/>
                </div>

                <div className={style.button}>
                    <Button
                        className={style.button}
                        size="s"
                        view="secondary"
                        label="Удалить"
                        onClick={() => onDeleteProject()}
                    />
                </div>

            </div>
            <Modal
                isOpen={isModalOpen}
                hasOverlay
                onClickOutside={() => {
                    setInfoData({status: true, msg: "Введите параметры и выберите файл"})
                    setIsModalOpen(false)}
                }
                onEsc={() => {
                    setInfoData({status: true, msg: "Введите параметры и выберите файл"})
                    setIsModalOpen(false)}}
                >
                <div className={style.model_form}>
                    <Text className={style.label} weight="black" view="primary" size="2xl">Конфигурация</Text>
                    <TextField width='full' className={style.input_field} onChange={handleProjectCommandBuild}
                               value={projectCommandBuild}
                               required
                               label={"Команда сборки"}
                               type="text" placeholder="Команда сборки"/>
                    <TextField width='full' className={style.input_field} onChange={handleRunFile} value={runFile}
                               label={"Имя исполняемого файла"}
                               required
                               type="text" placeholder="Имя исполняемого файла"/>
                    <TextField width='full' className={style.input_field} onChange={handlePathToEntry}
                               value={projectPathToEntry}
                               label={"Путь к папке проекта"}
                               required
                               type="text" placeholder="Путь к проекту в папке"/>
                    <Combobox
                        label={"Конфигурация приложения"}
                        className={style.input_field}
                        required
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
                    {file?.name ?
                        <Attachment
                            className={style.info}
                            key={file?.name}
                            fileName={file?.name}
                            fileExtension={file?.name?.match(/\.(?!.*\.)(\w*)/)?.[1] || ""}
                            fileDescription={file?.type}/>
                        :
                        <Text className={style.info}>{file ? "Файл выбран" : "Не выбран файл"}</Text>}
                        <Informer
                            className={style.info}
                            status={infoData.status ? "success" : "alert"}
                            view="bordered"
                            label={infoData.msg}
                        />
                    <Button label={'Прикрепить'} view="secondary" onClick={onBtnClick}/>
                </div>
            </Modal>
        </div>
    );
}
