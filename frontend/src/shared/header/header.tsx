import React, { useState, useRef, Dispatch, SetStateAction, useEffect, useLayoutEffect, ReactElement } from 'react';
import style from './header.module.css'
import { Header, HeaderButton, HeaderLogin, HeaderLogo, HeaderModule, HeaderSearchBar } from '@consta/uikit/Header';
import { Button } from '@consta/uikit/Button';
import { Link, Redirect } from 'react-router-dom';
import { Sidebar } from '@consta/uikit/Sidebar';
import { Text } from '@consta/uikit/Text';
import authServer from '../../ServiceAuth/authServer';
import { Modal } from '@consta/uikit/Modal';
import { Layout } from '@consta/uikit/LayoutCanary';
import { TextField } from '@consta/uikit/TextField';
import { User } from '@consta/uikit/User';
import { IconHamburger } from '@consta/uikit/IconHamburger';
import { IconUser } from '@consta/uikit/IconUser';
import { IconExit } from '@consta/uikit/IconExit';
import { IconHome } from '@consta/uikit/IconHome';
import { IconPlay } from '@consta/uikit/IconPlay';
import { IconStorage } from '@consta/uikit/IconStorage';
import { IconTest } from '@consta/uikit/IconTest';
import { Collapse } from '@consta/uikit/Collapse';

interface Props {}

function CollapseExampleHover() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [UserName, setUserName] = React.useState<string>("");
  const [UserEmail, setUserEmail] = React.useState<string>("");
  if(authServer.getToken() != ""){
    authServer.getUserName().then(res => {
      setUserName(res.data.Name)
      setUserEmail(res.data.Email)
    });
  }
  return (
    <div>
      {
        authServer.getToken() != "" ?
        <User
          name={UserName}
          info={UserEmail}
          view="ghost"
          size="l"
        /> :
        <ModalLogin userName={setUserName} userEmail={setUserEmail}></ModalLogin>
      }
      <Button 
        size="l" 
        view='clear' 
        iconLeft={IconHamburger} 
        onlyIcon
        onClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        size="m"
        onClickOutside={() => setIsSidebarOpen(false)}
        onEsc={() => setIsSidebarOpen(false)}>
        <Sidebar.Content className={style.sideBar}>
            <Text size="l" weight="black">AppRunner</Text>
            <Button
              size="m"
              label="Главная"
              view="clear"
              width="full"
              iconLeft={IconHome} 
            />
            <Button
              size="m"
              label="Запустить"
              view="clear"
              width="full"
              iconLeft={IconPlay} 
            />
          <Button
              size="m"
              label="Личный кабинет"
              view="clear"
              width="full"
              iconLeft={IconUser} 
              onClick={() => setIsSidebarOpen(false)}
            />
           <Collapse
              label="Справочник"
              horizontalSpace="s"
              icon={IconStorage}
              isOpen={true}
              closeDirectionIcon={"up"}
              hoverEffect
            >
              <Button
                size="m"
                label="Проекты"
                view="clear"
                width="full"
                onClick={() => setIsSidebarOpen(false)}
              />
              <Button
                size="m"
                label="Данные"
                view="clear"
                width="full"
                onClick={() => setIsSidebarOpen(false)}
              />
              <Button
                size="m"
                label="Конфигурации приложения"
                view="clear"
                width="full"
                onClick={() => setIsSidebarOpen(false)}
              />
          </Collapse>
          <Collapse
              label="Аналитика"
              horizontalSpace="s"
              isOpen={true}
              closeDirectionIcon={"up"}
              icon={IconTest}
              hoverEffect
            >
              <Button
                size="m"
                label="Графики"
                view="clear"
                width="full"
                onClick={() => setIsSidebarOpen(false)}
              />
              <Button
                size="m"
                label="Тестирование"
                view="clear"
                width="full"
                onClick={() => setIsSidebarOpen(false)}
              />
          </Collapse>
          <Button
            size="m"
            view="clear"
            label="Выход"
            iconLeft={IconExit} 
            width="full"
            onClick={() => {
              authServer.logout();
              setIsSidebarOpen(false)}}
            />
        </Sidebar.Content>
      </Sidebar>
    </div> 
  );
};

export const header = () => {
  return (
    <Header
  leftSide={
    <>
    <HeaderModule>
      <HeaderLogo>
        <img width={150} height={50} src="./logoAppRunner.png" alt="Логотип"/>
      </HeaderLogo>
    </HeaderModule>
    </>
  }
  rightSide={
    <>
    <HeaderModule>
    </HeaderModule>
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
      <Link to="/run">
          <Button
            size="s"
            view="secondary"
            label="Запуск"
            width="default"
          />
        </Link>
      </HeaderModule>
        <HeaderModule indent="s">
          <CollapseExampleHover></CollapseExampleHover>
        </HeaderModule>
      <HeaderModule indent="s">  
      </HeaderModule>
    </>
  }
/>
  )
}

function ModalRegistration() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [login, setLogin] = useState<string | null>(null);
  const handleChangeLogin = ({ value }: { value: string | null }) => setLogin(value);
  const [password, setPassword] = useState<string | null>("");
  const handleChangePassword = ({ value }: { value: string | null }) => setPassword(value);
  const [name, setName] = useState<string | null>("");
  const handleChangeName = ({ value }: { value: string | null }) => setName(value);
  return(
    <Layout flex={2}>
      <Button
          size="l"
          view="secondary"
          label="Регистрация"
          className={style.buttonModel}
          onClick={() => setIsModalOpen(true)}
        />
      <Modal
          isOpen={isModalOpen}
          hasOverlay
          onClickOutside={() => setIsModalOpen(false)}
          onEsc={() => setIsModalOpen(false)}>
        <Layout direction="column">
            <Layout flex={1}>
              <Text className={style.title} weight="black" view="primary" size="2xl">Регистрация</Text>
            </Layout>
            <Layout flex={1}>
              <TextField value={name} onChange={handleChangeName} width='full' className={style.form} type="text" placeholder="Имя" />
            </Layout>
            <Layout flex={1}>
              <TextField value={login} onChange={handleChangeLogin} width='full' className={style.form} type="text" placeholder="Электронная почта" />
            </Layout>
            <Layout flex={1}>
              <TextField value={password} onChange={handleChangePassword} width='full' className={style.form} type="text" placeholder="Пароль" />
            </Layout>
            <Layout flex={2}>
                <Button view="secondary" size="l"  label="Зарегистрироваться" className={style.buttonModel} onClick={() => {
                  authServer.register(login, password);
                  authServer.registerUser(name, login);
                  setIsModalOpen(false)
                }}/> 
            </Layout>
          </Layout>
      </Modal>
    </Layout>
  )
}

function ModalLogin(props: {
  userName: Dispatch<SetStateAction<string>>,
  userEmail: Dispatch<SetStateAction<string>>
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [login, setLogin] = useState<string | null>(null);
  const handleChangeLogin = ({ value }: { value: string | null }) => setLogin(value);
  const [password, setPassword] = useState<string | null>("");
  const handleChangePassword = ({ value }: { value: string | null }) => setPassword(value);

  return (
    <div>
        <Button
          size="s"
          view="secondary"
          label="Войти/Регистрация"
          className={style.button}
          onClick={() => setIsModalOpen(true)}
        />
      <Modal
          isOpen={isModalOpen}
          hasOverlay
          onClickOutside={() => setIsModalOpen(false)}
          onEsc={() => setIsModalOpen(false)} >
          <Layout direction="column">
            <Layout flex={1}>
              <Text className={style.title} weight="black" view="primary" size="2xl">Войти</Text>
            </Layout>
            <Layout flex={1}>
              <TextField width='full' className={style.form} value={login} onChange={handleChangeLogin} type="text" placeholder="Электронная почта" />
            </Layout>
            <Layout flex={1}>
              <TextField width='full' className={style.form} value={password} onChange={handleChangePassword} type="text" placeholder="Пароль" />
            </Layout>
            <Layout flex={2}>
                <Button view="secondary" size="l" label="Войти" className={style.buttonModel} onClick={() => {
                    authServer.logout();
                    authServer.login(login, password)?.then(res => {
                      authServer.getUserName().then(res => {
                        props.userName(res.data.Name);
                        props.userEmail(res.data.Email);
                      });
                  });
                }}/> 
            </Layout>
            <ModalRegistration></ModalRegistration>
          </Layout>
      </Modal>
    </div>
  )
}
