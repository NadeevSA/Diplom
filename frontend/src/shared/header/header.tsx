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

interface Props {}

function RouteForMenu(value: string | number | void){
  if (value == 'Личный кабинет') {
      <Route exact path="/profile"></Route>
  }
}

type ContextMenuItemDefault = {
  label: string | number;
  onClick?: void;
};

function CollapseExampleHover() {
  const [isOpen, setIsOpen] = useState <boolean>(false);
  const items: ContextMenuItemDefault[] = [
    {
      label: 'Личный кабинет',
    }];
  const ref = useRef(null);
  return (
    <div>
      <User
          name="Nadeev Sergey"
          size="l"
          view ="ghost"
          ref={ref}
          onClick={() => setIsOpen(!isOpen)}
          withArrow={true}/>
      <ContextMenu size="s" isOpen={isOpen} items={items} getItemLabel={(item) => item.label} anchorRef={ref} />
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