import React, { useLayoutEffect, useState } from 'react';
import style from './addProject.module.css';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/LayoutCanary';
import { DragNDropField } from '@consta/uikit/DragNDropField';
import { TextField } from '@consta/uikit/TextField';
import { Modal } from '@consta/uikit/Modal';
import { Text } from '@consta/uikit/Text';
import { Card } from '@consta/uikit/Card';
import { Attachment } from '@consta/uikit/Attachment';
import authServer from '../../serviceAuth/authServer';
import { Combobox } from '@consta/uikit/Combobox';
import ApiData, { Data } from '../../api/apiData';
import ApiProjectConfigData from '../../api/apiProjectConfigData';
import ApiProject, { Project } from '../../api/apiProject';
import { ProjectConfig } from '../../pages/run/paneContainer/appPane/types';
import { api } from '../../pages/run/paneContainer/appPane/api';
import { Informer } from '@consta/uikit/Informer';

export function ModelAddProjectData(props : {createProject : (Project: Project) => void ,
createData : (Data: Data) => void}) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({ value }: { value: string | null }) => setValue(value);
    const [desc, setDesc] = useState<string | null>(null);
    const handleChangeDesc = ({ value }: { value: string | null }) => setDesc(value);

    const [isModalOpenData, setIsModalOpenData] = React.useState(false);
    const [descData, setDescData] = useState<string | null>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const handleChangeDescData = ({ value }: { value: string | null }) => setDescData(value);

    const [dataProjectConfigs, setDataProjectConfigs] = useState<ProjectConfig[]>([])
    const [selectedProjectConfig, setSelectedProjectConfig] = useState<ProjectConfig[] | null | undefined>(null)
    
    const [info, setInfo] = useState<{status: boolean, msg: string}>({status: true, msg: "Введите название и описание проекта"})
    const [infoData, setInfoData] = useState<{status: boolean, msg: string}>({status: true, msg: "Выберите файл"})

    const getProjectConfigs = () => {
      api<ProjectConfig[]>(`${"http://localhost:8084/project_config"}`)
          .then(projectsConfigs => {               
              setDataProjectConfigs(projectsConfigs)
          })
    }
    
    useLayoutEffect(() => {
      getProjectConfigs()
    }, [])

  const checkIsValid = (str : string) => !/[A-Z !@#\$%\^\&*\)\(+=._-]+./.test(str)

    return (
      <Card>
        <Button
          size="l"
          view="secondary"
          label="Загрузить проект"
          className={style.button}
          onClick={() => setIsModalOpen(true)}
        />
        <Button
          size="l"
          view="secondary"
          label="Загрузить данные"
          className={style.button}
          onClick={() => setIsModalOpenData(true)}
        />
        <Modal
          isOpen={isModalOpen}
          hasOverlay
          onClickOutside={() => {
            setInfo({status: true, msg: "Введите название и описание проекта"})
            setIsModalOpen(false)
          }}
          onEsc={() => {
            setInfo({status: true, msg: "Введите название и описание проекта"})
            setIsModalOpen(false)
          }}>
        <Layout direction="column">
          <Layout flex={1}>
            <Text className={style.title} weight="black" view="primary" size="2xl">Загрузить проект</Text>
          </Layout>
          <Layout flex={1}>
          <TextField required  label="Название проекта" width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Название проекта" />
          </Layout>
          <Layout flex={1}>
          <TextField
            className={style.form}
            label="Описание"
            type="textarea"
            rows={7}
            cols={50} 
            onChange={handleChangeDesc} 
            placeholder = "Описание проекта"
            value={desc}/>
          </Layout>
          <Layout flex={1}>
            <Informer
                  className={style.info}
                  status={info.status ? "success" : "alert"}
                  view="bordered"
                  label={info.msg}
                />
          </Layout>
          <Layout flex={2}>
              <Button view="secondary" label="Добавить" className={style.buttonModel} onClick={() => {
                debugger
                if(value != null && checkIsValid(value!)) {
                  authServer.getUserName().then(res => {
                    ApiProject.PostProject(res.data.ID, value, desc).then(res => {
                      props.createProject(res.data);
                      setIsModalOpen(false);
                      setInfo({status: true, msg: "Введите название и описание проекта"})
                    }).catch(err => { 
                        if (err.response.data == `ERROR: duplicate key value violates unique constraint "idx_projects_name" (SQLSTATE 23505)`) {
                          setInfo({status: false, msg: "Такое название проекта у нас уже есть"})
                        }
                        else{
                          setInfo({status: false, msg: "Уппс, что-то пошло не так"})
                        }
                    });
                  })
                }
                else{
                  setInfo({status: false, msg: "Ой, такое имя нельзя"})
                }}}
                />
          </Layout>
        </Layout>
        </Modal>

        <Modal
          isOpen={isModalOpenData}
          hasOverlay
          onClickOutside={() => {
            setInfoData({status: true, msg: "Выберите файл"})
            setIsModalOpenData(false)
          }}
          onEsc={() => {
            setInfoData({status: true, msg: "Выберите файл"})
            setIsModalOpenData(false)}}
          >
        <Layout direction="column">
          <Layout flex={1}>
            <Text className={style.title} weight="black" view="primary" size="2xl">Загрузить данные</Text>
          </Layout>
          <Layout flex={1}>
          <TextField
            className={style.form}
            type="textarea"
            rows={7}
            cols={45}
            onChange={handleChangeDescData} 
            placeholder = "Описание для данных"
            value={descData}/>
          </Layout>
          <Layout flex={2} className={style.selector}>
                <Combobox
                  items={dataProjectConfigs}
                  value={selectedProjectConfig}
                  getItemLabel={(item) => item.Name}
                  getItemKey={(item) => item.ID}
                  onChange={({ value }) => setSelectedProjectConfig(value)}
                  placeholder="Привязать проекты"
                  multiple
                />
          </Layout>
          <Layout flex={1} className={style.field}>
            <DragNDropField onDropFiles={function (files: File[]): void {
                setFileData(files[0]);
              } }></DragNDropField>
          </Layout>
          <Layout flex={1} className={style.form}>
            {fileData?  
              <Attachment
                key={fileData?.name}
                fileName={fileData?.name}
                fileExtension={fileData?.name.match(/\.(?!.*\.)(\w*)/)?.[1]}
                fileDescription={fileData?.type}/>
                :
                <Text>Не выбран файл</Text>}
          </Layout>
          <Layout flex={1}>
            <Informer
                  className={style.info}
                  status={infoData.status ? "success" : "alert"}
                  view="bordered"
                  label={infoData.msg}
                />
          </Layout>
          <Layout flex={2}>
              <Button view="secondary" label="Добавить" className={style.buttonModel} onClick={() => {
                debugger
                if(fileData && selectedProjectConfig) {
                  ApiData.postData(fileData, descData).then(res => {
                    props.createData(res.data);
                    setIsModalOpenData(false);
                    setInfoData({status: true, msg: "Выберите файл"})
                    selectedProjectConfig?.map(p => {
                      ApiProjectConfigData.PostProjectConfigData(res.data.ID, p.ID).then(res =>{
                      }).catch(err => {
                        setInfoData({status: false, msg: "Уппс, что-то пошло не так"})
                      });
                    })
                  }).catch(err => {
                    setInfoData({status: false, msg: "Уппс, что-то пошло не так"})
                  })
                }
                else{
                    setInfoData({status: false, msg: "Вы не выбрали файл или не привязали проекты"})
                };
            }}/> 
          </Layout>
        </Layout>
        </Modal>
      </Card>
    );
}