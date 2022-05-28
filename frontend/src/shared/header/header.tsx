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
import { IconSettings } from '@consta/uikit/IconSettings';
import { IconMail } from '@consta/uikit/IconMail';
import { IconProcessing } from '@consta/uikit/IconProcessing';
import { Collapse } from '@consta/uikit/Collapse';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Informer } from '@consta/uikit/Informer';

interface Props {}

function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
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
            <Button
                size="m"
                label="Графики"
                view="clear"
                width="full"
                iconLeft={IconTest}
                onClick={() => setIsSidebarOpen(false)}
              />
              <Button
                size="m"
                label="Проекты"
                view="clear"
                width="full"
                iconLeft={IconSettings}
                onClick={() => setIsSidebarOpen(false)}
              />
              <Button
                size="m"
                label="Данные"
                view="clear"
                width="full"
                iconLeft={IconMail}
                onClick={() => setIsSidebarOpen(false)}
              />
              <Button
                size="m"
                label="Конфигурации приложения"
                view="clear"
                width="full"
                iconLeft={IconProcessing}
                onClick={() => setIsSidebarOpen(false)}
              />
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
  )
}

function CollapseExampleHover() {
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
    </div> 
  );
};

export const header = () => {
  return (
    <Header
  leftSide={
    <>
    <HeaderModule>
        {SideBar()}
    </HeaderModule>
    <HeaderModule indent="m">
      <HeaderLogo>
        <img width={150} height={50} src="./logoAppRunner.png" alt="Логотип"/>
      </HeaderLogo>
    </HeaderModule>
    </>
  }
  rightSide={
    <>
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
  const [info, setInfo] = useState<string>("");

  return(
    <div>
      <Button
          size="l"
          view="secondary"
          label="Регистрация"
          onClick={() => setIsModalOpen(true)}
        />
      <Modal
          isOpen={isModalOpen}
          hasOverlay
          onClickOutside={() => setIsModalOpen(false)}
          onEsc={() => setIsModalOpen(false)}>
            <Grid cols="2">
            <GridItem className={style.title} rowStart="1" colStart="1" col="2">
              <Text weight="black" view="primary" size="2xl">Регистрация</Text>
            </GridItem>
            <GridItem className={style.form} rowStart="2" colStart="1" col="2">
              <Text weight="black" view="secondary" size="l">Имя</Text>
              <TextField value={name} onChange={handleChangeName} width='full' type="text" placeholder="Имя" />
            </GridItem>
            <GridItem className={style.form} rowStart="3" colStart="1" col="2">
              <Text weight="black" view="secondary" size="l">Электронная почта</Text>
              <TextField value={login} onChange={handleChangeLogin} width='full' type="text" placeholder="Электронная почта" />
            </GridItem>
            <GridItem className={style.form} rowStart="4" colStart="1" col="2">
            <Text weight="black" view="secondary" size="l">Пароль</Text>
              <TextField value={password} onChange={handleChangePassword} width='full'  type="text" placeholder="Пароль" />
            </GridItem>
            <GridItem className={style.button} rowStart="5" colStart="1" col="2">
              <Button view="secondary" size="l"  label="Зарегистрироваться" onClick={() => {
                    authServer.register(login, password)?.then(res => {
                        authServer.registerUser(name, login)?.then(res =>{
                          setInfo("Вы успешно зарегистрировались. Спасибо.")
                        }).catch(err => {
                          setInfo("Уппс, что-то пошло не так")  
                      })
                    }).catch(err => {
                      setInfo("Уппс, что-то пошло не так")  
                    });
                  }}/>
            </GridItem>
            <GridItem rowStart="6" colStart="1" col="2">
                {
                  info != "" ?
                  <Informer
                    className={style.form}
                    view="bordered"
                    label={info}
                  /> : <div></div>
                }
            </GridItem>
          </Grid>
      </Modal>
    </div>
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
          <Grid cols="2">
            <GridItem className={style.title} rowStart="1" colStart="1" col="2">
              <Text weight="black" view="primary" size="2xl">Войти</Text>
            </GridItem>
            <GridItem className={style.form} rowStart="2" colStart="1" col="2">
              <Text weight="black" view="secondary" size="l">Электронная почта</Text>
              <TextField width='full' value={login} onChange={handleChangeLogin} type="text" placeholder="Электронная почта" />
            </GridItem>
            <GridItem className={style.form} rowStart="3" colStart="1" col="2">
              <Text weight="black" view="secondary" size="l">Пароль</Text>
              <TextField width='full' value={password} onChange={handleChangePassword} type="text" placeholder="Пароль" />
            </GridItem>
            <GridItem className={style.buttonLeft} rowStart="4" colStart="1" col="1">
              <Button view="secondary" size="l" label="Войти" onClick={() => {
                      authServer.logout();
                      authServer.login(login, password)?.then(res => {
                        authServer.getUserName().then(res => {
                          props.userName(res.data.Name);
                          props.userEmail(res.data.Email);
                          window.location.reload()
                        });
                    });
              }}/> 
            </GridItem>
            <GridItem className={style.buttonRight}  rowStart="4" colStart="2" col="1">
              <ModalRegistration></ModalRegistration>
            </GridItem>
          </Grid>
      </Modal>
    </div>
  )
}
