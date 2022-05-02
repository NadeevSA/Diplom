import React, { useState } from 'react';
import style from './addProject.module.css';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/LayoutCanary';
import { DragNDropField } from '@consta/uikit/DragNDropField';
import { TextField } from '@consta/uikit/TextField';
import { Select } from '@consta/uikit/Select';
import { Modal } from '@consta/uikit/Modal';
import { Text } from '@consta/uikit/Text';

interface Props {}

type Item = {
  label: string;
  id: number;
};

const items: Item[] = [
  {
    label: 'Первый',
    id: 1,
  },
  {
    label: 'Второй',
    id: 2,
  },
  {
    label: 'Третий',
    id: 3,
  },
];

function SelectExampleItems() {
    const [value, setValue] = useState<Item | null>();
    return <Select placeholder='Выбрать конфигурацию' className={style.form} items={items} value={value} onChange={({ value }) => setValue(value)} />;
}

const TextFieldExampleTypeText = () => {
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({ value }: { value: string | null }) => setValue(value);
    return <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Название проекта" />;
};

export function ModalExampleCenter() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
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
            <TextFieldExampleTypeText></TextFieldExampleTypeText>
          </Layout>
          <Layout flex={1}>
              <SelectExampleItems></SelectExampleItems>
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