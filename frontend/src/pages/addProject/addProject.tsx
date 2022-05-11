import React, { useState } from 'react';
import style from './addProject.module.css';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/LayoutCanary';
import { DragNDropField } from '@consta/uikit/DragNDropField';
import { TextField } from '@consta/uikit/TextField';
import { Select } from '@consta/uikit/Select';
import { Modal } from '@consta/uikit/Modal';
import { Text } from '@consta/uikit/Text';
import { getUsers, PostProject } from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'

interface Props {}

const onClick = async (name: string | null, desc: string | null) => {
  console.log("onClick");
  PostProject(name, desc);
  //getUsers();
};

export function ModalExampleCenter() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({ value }: { value: string | null }) => setValue(value);
    const [desc, setDesc] = useState<string | null>(null);
    const handleChangeDesc = ({ value }: { value: string | null }) => setDesc(value);
    return (
      <div>
        <Button
          size="s"
          view="secondary"
          label="Загрузить проект"
          width="default"
          onClick={() => setIsModalOpen(true)}
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
            value={desc}/>
          </Layout>
          <Layout flex={2}>
              <Button view="secondary" label="Добавить" className={style.button} onClick={() => onClick(value, desc)}/> 
          </Layout>
        </Layout>
        </Modal>
      </div>
    );
}