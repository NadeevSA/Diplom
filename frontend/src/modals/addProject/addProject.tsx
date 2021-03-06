import React, { useEffect, useRef, useState } from 'react';
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
    
    const [info, setInfo] = useState<{status: boolean, msg: string}>({status: true, msg: "?????????????? ???????????????? ?? ???????????????? ??????????????"})
    const [infoData, setInfoData] = useState<{status: boolean, msg: string}>({status: true, msg: "???????????????? ????????"})

    const getProjectConfigs = () => {
      api<ProjectConfig[]>(`${"http://localhost:8084/project_config"}`)
          .then(projectsConfigs => {               
              setDataProjectConfigs(projectsConfigs)
          })
    }
    
    useEffect(() => {
      debugger
      getProjectConfigs()
    }, [isModalOpenData])

  const checkIsValid = (str : string) => !/[A-Z !@#\$%\^\&*\)\(+=.-]+./.test(str)

    return (
      <Card>
        <Button
          size="l"
          view="secondary"
          label="?????????????????? ????????????"
          className={style.button}
          onClick={() => setIsModalOpen(true)}
        />
        <Button
          size="l"
          view="secondary"
          label="?????????????????? ????????????"
          className={style.button}
          onClick={() => setIsModalOpenData(true)}
        />
        <Modal
          isOpen={isModalOpen}
          hasOverlay
          onClickOutside={() => {
            setInfo({status: true, msg: "?????????????? ???????????????? ?? ???????????????? ??????????????"})
            setIsModalOpen(false)
          }}
          onEsc={() => {
            setInfo({status: true, msg: "?????????????? ???????????????? ?? ???????????????? ??????????????"})
            setIsModalOpen(false)
          }}>
        <Layout direction="column">
          <Layout flex={1}>
            <Text className={style.title} weight="black" view="primary" size="2xl">?????????????????? ????????????</Text>
          </Layout>
          <Layout flex={1}>
            <TextField required label="???????????????? ??????????????" width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="???????????????? ??????????????"/>
          </Layout>
          <Layout flex={1}>
          <TextField
            className={style.form}
            label="????????????????"
            type="textarea"
            rows={7}
            cols={50} 
            onChange={handleChangeDesc} 
            placeholder = "???????????????? ??????????????"
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
              <Button view="secondary" label="????????????????" className={style.buttonModel} onClick={() => {
                debugger
                if(value != null && checkIsValid(value!)) {
                  authServer.getUserName().then(res => {
                    ApiProject.PostProject(res.data.ID, value, desc).then(res => {
                      props.createProject(res.data);
                      setIsModalOpen(false);
                      setInfo({status: true, msg: "?????????????? ???????????????? ?? ???????????????? ??????????????"})
                    }).catch(err => { 
                        if (err.response.data == `ERROR: duplicate key value violates unique constraint "idx_projects_name" (SQLSTATE 23505)`) {
                          setInfo({status: false, msg: "?????????? ???????????????? ?????????????? ?? ?????? ?????? ????????"})
                        }
                        else{
                          setInfo({status: false, msg: "????????, ??????-???? ?????????? ???? ??????"})
                        }
                    });
                  })
                }
                else{
                  setInfo({status: false, msg: "????, ?????????? ?????? ????????????"})
                }}}
                />
          </Layout>
        </Layout>
        </Modal>

        <Modal
          isOpen={isModalOpenData}
          hasOverlay
          onClickOutside={() => {
            setInfoData({status: true, msg: "???????????????? ????????"})
            setIsModalOpenData(false)
          }}
          onEsc={() => {
            setInfoData({status: true, msg: "???????????????? ????????"})
            setIsModalOpenData(false)}}
          >
        <Layout direction="column">
          <Layout flex={1}>
            <Text className={style.title} weight="black" view="primary" size="2xl">?????????????????? ????????????</Text>
          </Layout>
          <Layout flex={1}>
          <TextField
            className={style.form}
            type="textarea"
            rows={7}
            cols={45}
            onChange={handleChangeDescData} 
            placeholder = "???????????????? ?????? ????????????"
            value={descData}/>
          </Layout>
          <Layout flex={2} className={style.selector}>
                <Combobox
                  items={dataProjectConfigs}
                  value={selectedProjectConfig}
                  getItemLabel={(item) => item.Name}
                  getItemKey={(item) => item.ID}
                  onChange={({ value }) => setSelectedProjectConfig(value)}
                  placeholder="?????????????????? ??????????????"
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
                <Text>???? ???????????? ????????</Text>}
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
              <Button view="secondary" label="????????????????" className={style.buttonModel} onClick={() => {
                debugger
                if(fileData && selectedProjectConfig) {
                  ApiData.postData(fileData, descData).then(res => {
                    props.createData(res.data);
                    setIsModalOpenData(false);
                    setInfoData({status: true, msg: "???????????????? ????????"})
                    selectedProjectConfig?.map(p => {
                      ApiProjectConfigData.PostProjectConfigData(res.data.ID, p.ID).then(res =>{
                      }).catch(err => {
                        setInfoData({status: false, msg: "????????, ??????-???? ?????????? ???? ??????"})
                      });
                    })
                  }).catch(err => {
                    setInfoData({status: false, msg: "????????, ??????-???? ?????????? ???? ??????"})
                  })
                }
                else{
                    setInfoData({status: false, msg: "???? ???? ?????????????? ???????? ?????? ???? ?????????????????? ??????????????"})
                };
            }}/> 
          </Layout>
        </Layout>
        </Modal>
      </Card>
    );
}