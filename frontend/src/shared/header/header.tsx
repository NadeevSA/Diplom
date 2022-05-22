import React, { useState, useRef, Dispatch, SetStateAction, useEffect, useLayoutEffect } from 'react';
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

interface Props {}

function CollapseExampleHover() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [UserName, setUserName] = React.useState<string>(""); 
  let x = authServer.getToken();
  if(authServer.getToken() != ""){
    authServer.getUserName().then(res => {
      setUserName(res.data.Name)
    });
  }
  return (
    <div>
      {
        authServer.getToken() != "" ?
        <HeaderLogin
          personName={UserName}
          
          isLogged={true}
        /> :
        <ModalLogin userName={setUserName}></ModalLogin>
      }
      <Sidebar
        isOpen={isSidebarOpen}
        size="m"
        onClickOutside={() => setIsSidebarOpen(false)}
        onEsc={() => setIsSidebarOpen(false)}>
        <Sidebar.Content className={style.sideBar}>
          <HeaderLogo>
            <img width={300} height={100} src="./logoAppRunner.png" alt="Логотип" />
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
      <HeaderModule indent="s" className={style.user}>  
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
    <div>
      <Button
          size="s"
          view="secondary"
          label="Регистрация"
          className={style.button}
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
                <Button view="secondary" label="Зарегистрироваться" className={style.buttonModel} onClick={() => {
                  authServer.register(login, password);
                  authServer.registerUser(name, login);
                }}/> 
            </Layout>
          </Layout>
      </Modal>
    </div>
  )
}

function ModalLogin(props: {userName: Dispatch<SetStateAction<string>>}) {
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
                <Button view="secondary" label="Войти" className={style.buttonModel} onClick={() => {
                    authServer.logout();
                    authServer.login(login, password)?.then(res => {
                      authServer.getUserName().then(res => {
                        props.userName(res.data.Name)
                      });
                  });
                }}/> 
            </Layout>
            <Layout flex={1}>
              <ModalRegistration></ModalRegistration>
            </Layout>
          </Layout>
      </Modal>
    </div>
  )
}
