import React, { useState, useRef } from 'react';
import style from './header.module.css'
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Header, HeaderButton, HeaderLogin, HeaderLogo, HeaderModule, HeaderSearchBar } from '@consta/uikit/Header';
import { Button } from '@consta/uikit/Button';
import { ModalExampleCenter } from '../../pages/addProject/addProject';
import { ModalAddInputData } from '../../pages/addInputData/addInputData';
import { User } from '@consta/uikit/User';
import { Collapse } from '@consta/uikit/Collapse';
import { ContextMenu } from '@consta/uikit/ContextMenuCanary';
import { Select } from '@consta/uikit/Select';

interface Props {}

function CollapseExampleHover() {
  const [isOpen, setIsOpen] = useState <boolean>(false);
  const items: string[] = ['Личный кабинет', 'Тестирование', 'Графики', 'Выход'];
  const ref = useRef(null);
  return (
    <div>
      <User
          name="Nadeev.SA"
          info="ПРО-421"
          view ="ghost"
          ref={ref}
          onClick={() => setIsOpen(!isOpen)}
          withArrow={true}/>
      <ContextMenu size="s" isOpen={isOpen} items={items} getItemLabel={(item) => item} anchorRef={ref} />
    </div> 
  );
};

export const header = (props: Props) => {
  return (
    <Header
  leftSide={
    <>
    <HeaderModule>
      <HeaderLogo>
        <img width={100} height={50} src="./logo.png" alt="sadw" />
      </HeaderLogo>
    </HeaderModule>
      <HeaderModule indent="l">
        <HeaderSearchBar /> 
      </HeaderModule>
    </>
  }
  rightSide={
    <>
      <HeaderModule indent="s">
        <Button
          size="s"
          view="secondary"
          label="Главная"
          width="default"
        />
      </HeaderModule>
      <HeaderModule indent="s">
        <Button
          size="s"
          view="secondary"
          label="Запустить проект"
          width="default"
        />
      </HeaderModule>
      <HeaderModule indent="s">
        <ModalExampleCenter></ModalExampleCenter>
      </HeaderModule>
      <HeaderModule indent="s">
        <ModalAddInputData></ModalAddInputData>
      </HeaderModule>
      <HeaderModule indent="s" className={style.user}>
        <CollapseExampleHover></CollapseExampleHover>
      </HeaderModule>
    </>
  }
/>
  )
}