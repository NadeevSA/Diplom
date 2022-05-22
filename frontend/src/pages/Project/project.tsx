import { Button } from '@consta/uikit/Button';
import { Card } from '@consta/uikit/Card';
import { Layout } from '@consta/uikit/LayoutCanary';
import { Modal } from '@consta/uikit/Modal';
import { TextField } from '@consta/uikit/TextField';
import React, { useState } from 'react';
import style from './project.module.css';

export function ProjectPage(props: { name: string }) {
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
          label="Конфигурация"
          onClick={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          hasOverlay
          onClickOutside={() => setIsModalOpen(false)}
          onEsc={() => setIsModalOpen(false)}>
            <div>
                <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Имя приложения" />
                <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Команда сборки" />
                <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Имя исполняемого файла" />
                <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Путь к проекту в папке" />
                <TextField width='full' className={style.form} onChange={handleChange} value={value} type="text" placeholder="Команда сборки" />
            </div>

        </Modal>
      </div>
  );
}
