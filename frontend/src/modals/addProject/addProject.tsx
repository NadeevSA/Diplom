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
import ApiData from '../../api/apiData';
import ApiProjectConfigData from '../../api/apiProjectConfigData';
import ApiProject, { Project } from '../../api/apiProject';
import { ProjectConfig } from '../../pages/run/paneContainer/appPane/types';
import { api } from '../../pages/run/paneContainer/appPane/api';

export function ModelAddProjectData(props : {create : (Project: Project) => void}) {
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
    const [selectedProjectConfig, setSelectedProjectConfig] = useState<ProjectConfig[] | null | undefined>()

    const [newProject, setNewProject] = useState<Project>();
    
    const getProjectConfigs = () => {
      api<ProjectConfig[]>(`${"http://localhost:8084/project_config"}`)
          .then(projectsConfigs => {               
              setDataProjectConfigs(projectsConfigs)
          })
    }
    
    useLayoutEffect(() => {
      getProjectConfigs()
  }, [])

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
          onClickOutside={() => setIsModalOpen(false)}
          onEsc={() => setIsModalOpen(false)}>
        <Layout direction="column">
          <Layout flex={1}>
            <Text className={style.title} weight="black" view="primary" size="2xl">Загрузить проект</Text>
          </Layout>
          <Layout flex={1}>
          <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Название проекта" />;
          </Layout>
          <Layout flex={1}>
          <TextField
            className={style.form}
            type="textarea"
            rows={7}
            cols={50}
            onChange={handleChangeDesc} 
            placeholder = "Описание проекта"
            value={desc}/>
          </Layout>
          <Layout flex={2}>
              <Button view="secondary" label="Добавить" className={style.buttonModel} onClick={() => {
                authServer.getUserName().then(res => {
                  ApiProject.PostProject(res.data.ID, value, desc).then(res => {
                    setNewProject(res.data);
                    props.create(res.data);
                  });
                })
                setIsModalOpen(false);
              }}/>
          </Layout>
        </Layout>
        </Modal>

        <Modal
          isOpen={isModalOpenData}
          hasOverlay
          onClickOutside={() => setIsModalOpenData(false)}
          onEsc={() => setIsModalOpenData(false)}>
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
          <Layout flex={2} className={style.form}>
                <Combobox
                  items={dataProjectConfigs}
                  value={selectedProjectConfig}
                  getItemLabel={(item) => item.Name}
                  getItemKey={(item) => item.ID}
                  onChange={({ value }) => setSelectedProjectConfig(value)}
                  placeholder="Поиск проекта"
                  multiple
                />
          </Layout>
          <Layout flex={1} className={style.form}>
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
                <Text>Выберите файл</Text>}
          </Layout>
          <Layout flex={2}>
              <Button view="secondary" label="Добавить" className={style.buttonModel} onClick={() => {
                ApiData.postData(fileData, descData).then(res => {
                  selectedProjectConfig?.map(p => {
                    ApiProjectConfigData.PostProjectConfigData(res.data.ID, p.ID).then(res =>{
                        if (res.status === 200){
                            //setNewProject(res.data);
                            //setIsModalOpenData(false)
                            //GetTable({isHidden: false});
                            //window.location.reload()
                        }
                    });
                  })
                });
            }}/> 
          </Layout>
        </Layout>
        </Modal>
      </Card>
    );
}