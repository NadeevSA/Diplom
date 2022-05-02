import React, { useState } from 'react';
import style from './addInputData.module.css';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/LayoutCanary';
import { DragNDropField } from '@consta/uikit/DragNDropField';
import { TextField } from '@consta/uikit/TextField';
import { Modal } from '@consta/uikit/Modal';
import { Text } from '@consta/uikit/Text';

interface Props {}

const TextFieldExampleTypeText = () => {
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({ value }: { value: string | null }) => setValue(value);
    return <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Название данных" />;
};

export function ModalAddInputData() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    return (
      <div>
        <Button
          size="s"
          view="secondary"
          label="Загрузить данные"
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
            <Text className={style.title} weight="black" view="primary" size="2xl">Загрузить данные</Text>
          </Layout>
          <Layout flex={1}>
            <TextFieldExampleTypeText></TextFieldExampleTypeText>
          </Layout>
            <div className={style.form}>
              <DragNDropField onDropFiles={(files) => console.log(files)}></DragNDropField>
            </div>
          <Layout flex={2}>
              <Button view="secondary" label="Добавить" className={style.button}/> 
          </Layout>
        </Layout>
        </Modal>
      </div>
    );
}