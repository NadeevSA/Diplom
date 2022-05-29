import { Button } from "@consta/uikit/Button";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { Modal } from "@consta/uikit/Modal";
import { Dispatch, SetStateAction, useState } from "react";
import style from './login.module.css'
import { Text } from '@consta/uikit/Text';
import { TextField } from "@consta/uikit/TextField";
import authServer from "../../serviceAuth/authServer";
import { ModalRegistration } from "../registration/registration";

export function ModalLogin(props: {
    userName: Dispatch<SetStateAction<string>>,
    userEmail: Dispatch<SetStateAction<string>>
  }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                <TextField autoFocus width='full' value={login} onChange={handleChangeLogin} type="text" placeholder="Электронная почта" />
              </GridItem>
              <GridItem className={style.form} rowStart="3" colStart="1" col="2">
                <Text weight="black" view="secondary" size="l">Пароль</Text>
                <TextField width='full' value={password} onChange={handleChangePassword} type="text" placeholder="Пароль" />
              </GridItem>
              <GridItem className={style.buttonLeft} rowStart="4" colStart="1" col="1">
                <Button view="secondary" size="l" label="Войти" onClick={() => {
                        authServer.login(login, password)?.then(res => {
                          authServer.getUserName().then(res => {
                            props.userName(res.data.Name);
                            props.userEmail(res.data.Email);
                            setIsModalOpen(false);
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