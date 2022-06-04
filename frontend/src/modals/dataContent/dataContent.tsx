import { Button } from "@consta/uikit/Button";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { Modal } from "@consta/uikit/Modal";
import { useEffect, useState } from "react";
import style from './dataContent.module.css'
import { TextField } from "@consta/uikit/TextField";
import ApiData from "../../api/apiData";
import { Text } from '@consta/uikit/Text';

export function DataContent(props: {
    id: number
    name: string
  }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState<string>("");
  
    useEffect(() => {
      ApiData.getDataContentById(props.id).then(res => {
        setContent(res.data);
      })
    }, []);

    return (
      <div>
          <Button
            size="s"
            view="secondary"
            label="Содержимое"
            className={style.button}
            onClick={() => setIsModalOpen(true)}
          />
        <Modal
            isOpen={isModalOpen}
            hasOverlay
            className={style.form}
            onClickOutside={() => setIsModalOpen(false)}
            onEsc={() => setIsModalOpen(false)} >
            <Grid gap="m">
              <GridItem rowStart="1" colStart="1" col="1">
                  <Text view="primary" className={style.form} weight="bold" size="l">Содержимое файла: {props.name}</Text>
              </GridItem>
              <GridItem rowStart="2" colStart="1" col="1">
                  <TextField className={style.form}  type="textarea" value={content}></TextField>
              </GridItem>
              <GridItem rowStart="3" colStart="1" col="1">
                  <Button 
                    className={style.form}
                    view="secondary"
                    width="full"
                    label={"Закрыть"}
                    onClick={() => setIsModalOpen(false)}
                  />
              </GridItem>
            </Grid>
        </Modal>
      </div>
    )
  }