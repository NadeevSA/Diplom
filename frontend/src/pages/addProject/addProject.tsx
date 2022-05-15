import React, { useState } from 'react';
import style from './addProject.module.css';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/LayoutCanary';
import { DragNDropField } from '@consta/uikit/DragNDropField';
import { TextField } from '@consta/uikit/TextField';
import { Select } from '@consta/uikit/Select';
import { Modal } from '@consta/uikit/Modal';
import { Text } from '@consta/uikit/Text';
import { getUsers, PostData, PostProject } from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'
import { Card } from '@consta/uikit/Card';
import { File } from '@consta/uikit/File';
import { Attachment } from '@consta/uikit/Attachment';

interface Props {}

const onClick = async (name: string | null, desc: string | null) => {
  PostProject(name, desc);
};

export function ModelAddProjectData() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({ value }: { value: string | null }) => setValue(value);
    const [desc, setDesc] = useState<string | null>(null);
    const handleChangeDesc = ({ value }: { value: string | null }) => setDesc(value);

    const [isModalOpenData, setIsModalOpenData] = React.useState(false);
    const [descData, setDescData] = useState<string | null>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const handleChangeDescData = ({ value }: { value: string | null }) => setDescData(value);
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
              <Button view="secondary" label="Добавить" className={style.buttonModel} onClick={() => {PostProject(value, desc); setIsModalOpen(false); window.location.reload()}}/> 
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
              PostData(fileData, descData); setIsModalOpen(false);
              window.location.reload()}}/> 
          </Layout>
        </Layout>
        </Modal>
      </Card>
    );
}