import React, { useState, useRef } from 'react';
import style from './header.module.css'
import { Header, HeaderButton, HeaderLogin, HeaderLogo, HeaderModule, HeaderSearchBar } from '@consta/uikit/Header';
import { Button } from '@consta/uikit/Button';
import { User } from '@consta/uikit/User';
import { ContextMenu } from '@consta/uikit/ContextMenuCanary';
import { profile } from '../../pages/profile/profile'
import { Switch, Route } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Sidebar } from '@consta/uikit/Sidebar';
import { Text } from '@consta/uikit/Text';

interface Props {}

function RouteForMenu(value: string | number | void){
  if (value == 'Личный кабинет') {
      <Route exact path="/profile"></Route>
  }
}

type ContextMenuItemDefault = {
  label: string | number;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

function func(){
  console.log("Мы здесь");
  <Route exact path="/profile"></Route>
}

function CollapseExampleHover() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const ref = useRef(null);
  return (
    <div>
      <User
          name="Nadeev Sergey"
          size="l"
          view ="ghost"
          ref={ref}
          onClick={() => setIsSidebarOpen(true)}/>
      <Sidebar
        isOpen={isSidebarOpen}
        size="m"
        onClickOutside={() => setIsSidebarOpen(false)}
        onEsc={() => setIsSidebarOpen(false)}>
        <Sidebar.Content className={style.sideBar}>
          <HeaderLogo>
            <img width={300} height={100} src="./logoAppRunner2.png" alt="Логотип" />
          </HeaderLogo>
          <Button
            size="l"
            label="Личный кабинет"
            view="secondary"
            width="full"
            className={style.button}
            onClick={() => setIsSidebarOpen(false)}
          />
          <Button
            size="l"
            view="secondary"
            label="Графики"
            width="full"
            className={style.button}
            disabled={true}
            onClick={() => setIsSidebarOpen(false)}
          />
          <Button
            size="l"
            view="secondary"
            label="Выход"
            width="full"
            className={style.button}
            onClick={() => setIsSidebarOpen(false)}
          />
        </Sidebar.Content>
      </Sidebar>
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
        <img width={150} height={50} src="./logoAppRunner2.png" alt="Логотип"/>
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
        <Link to="/">
          <Button
            size="s"
            view="secondary"
            label="Главная"
            width="default"
          />
        </Link>
      </HeaderModule>
      <HeaderModule indent="s">
        <Button
          size="s"
          view="secondary"
          label="Запуск"
          width="default"
        />
      </HeaderModule>
        <HeaderModule indent="s" className={style.user}>
        <CollapseExampleHover></CollapseExampleHover>
      </HeaderModule>
    </>
  }
/>
  )
}