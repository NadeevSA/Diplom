import { useEffect, useState } from 'react';
import style from './header.module.css'
import { Button } from '@consta/uikit/Button';
import { Sidebar } from '@consta/uikit/Sidebar';
import { Text } from '@consta/uikit/Text';
import authServer from '../../serviceAuth/authServer';
import { IconHamburger } from '@consta/uikit/IconHamburger';
import { IconUser } from '@consta/uikit/IconUser';
import { IconExit } from '@consta/uikit/IconExit';
import { IconHome } from '@consta/uikit/IconHome';
import { IconPlay } from '@consta/uikit/IconPlay';
import { IconTest } from '@consta/uikit/IconTest';
import { IconSettings } from '@consta/uikit/IconSettings';
import { IconMail } from '@consta/uikit/IconMail';
import { IconProcessing } from '@consta/uikit/IconProcessing';
import { Link } from 'react-router-dom';

export function SideBar(props: {userName: string, isLogin: (login: string) => void}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function disableButton() {
        return props.userName == "";
    } 

    useEffect(() => {
      disableButton();
    },[props.userName])

    return (
      <div>
        <Button 
          size="l" 
          view='clear' 
          iconLeft={IconHamburger}
          className={style.buttonSideBar} 
          onlyIcon
          onClick={() => setIsSidebarOpen(true)} />
        <Sidebar
          isOpen={isSidebarOpen}
          size="m"
          position="left"
          onClickOutside={() => setIsSidebarOpen(false)}
          onEsc={() => setIsSidebarOpen(false)}>
          <Sidebar.Content>
              <Text size="l" weight="black">AppRunner</Text>
              <Button
                  size="m"
                  label="Главная"
                  view="clear"
                  width="full"
                  onClick={() => {
                    setIsSidebarOpen(false)
                    window.location.href = "/"
                  }}
                  iconLeft={IconHome} 
                />
              <Button
                  size="m"
                  label="Запустить"
                  view="clear"
                  width="full"
                  onClick={() => {
                    setIsSidebarOpen(false)
                    window.location.href = "/run"
                  }}
                  iconLeft={IconPlay} 
                />
            <Button
                size="m"
                label="Личный кабинет"
                view="clear"
                width="full"
                iconLeft={IconUser}
                disabled={disableButton()}
                onClick={() => {
                  setIsSidebarOpen(false)
                  window.location.href = "/profile"
                }}
              />
              <Button
                  size="m"
                  label="Графики"
                  view="clear"
                  width="full"
                  iconLeft={IconTest}
                  onClick={() => {
                    setIsSidebarOpen(false)
                    window.location.href = "/dashboard"
                  }}
                />
                <Button
                  size="m"
                  label="Проекты"
                  view="clear"
                  width="full"
                  iconLeft={IconSettings}
                  onClick={() => {
                    setIsSidebarOpen(false)
                    window.location.href = "/projects"
                  }}
                />
                <Button
                  size="m"
                  label="Данные"
                  view="clear"
                  width="full"
                  iconLeft={IconMail}
                  onClick={() => {
                    setIsSidebarOpen(false)
                    window.location.href = "/datas"
                  }}
                />
                <Button
                  size="m"
                  label="Конфигурации приложения"
                  view="clear"
                  width="full"
                  iconLeft={IconProcessing}
                  onClick={() => {
                    setIsSidebarOpen(false)
                    window.location.href = "/projectConfigs"
                  }}
                />
                <Button
                  size="m"
                  view="clear"
                  label="Выход"
                  iconLeft={IconExit} 
                  width="full"
                  disabled={disableButton()}
                  onClick={() => {
                    authServer.logout();
                    setIsSidebarOpen(false);
                    props.isLogin("");
                    debugger
                    if (window.location.href == "http://localhost:3000/profile" ||
                    window.location.href == "http://localhost:3000/run"){
                      window.location.href = "/";
                    }
                  }}
                  />
          </Sidebar.Content>
        </Sidebar>
      </div>
    )
  }