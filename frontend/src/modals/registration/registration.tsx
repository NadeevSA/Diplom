import { Button } from "@consta/uikit/Button";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { Modal } from "@consta/uikit/Modal";
import { useState } from "react";
import { Text } from '@consta/uikit/Text';
import { TextField } from "@consta/uikit/TextField";
import authServer from "../../serviceAuth/authServer";
import { Informer } from "@consta/uikit/Informer";
import style from './registration.module.css'

export function ModalRegistration() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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