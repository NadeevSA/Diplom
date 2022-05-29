import style from './main.module.css';
import { Text } from '@consta/uikit/Text';
import { Button } from '@consta/uikit/Button';
import authServer from '../../serviceAuth/authServer';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Card } from '@consta/uikit/Card';
import { IconStorage } from '@consta/uikit/IconStorage';
import { IconTest } from '@consta/uikit/IconTest';

export const main = () => {
  return(
    <Grid gap="l" cols="4" rowGap="5xl" className={style.grid}>
            <GridItem colStart="2" col="2" row="1">
              <Text weight="bold" size="3xl">Система для сборки, хранения и запуска консольных приложений</Text>
            </GridItem>
            <GridItem colStart="2" row="3">
              <Card>
              <Button
                onlyIcon
                iconLeft={IconStorage}
                view="clear"
              />
              <Text weight="bold" size="l">Справочники</Text>
              <Button
                size="m"
                label="Проекты"
                view="clear"
                width="full"
              />
              <Button
                size="m"
                label="Данные"
                view="clear"
                width="full"
              />  
              <Button
                size="m"
                label="Конфигурации"
                view="clear"
                width="full"
              />
              </Card>
            </GridItem>
            <GridItem colStart="3">
              <Card>
              <Button
                onlyIcon
                iconLeft={IconTest}
                view="clear"
              />
              <Text weight="bold" size="l">Функции</Text>
              <Button
                size="m"
                label="Запуск"
                view="clear"
                width="full"
              />
              <Button
                size="m"
                label="Графики"
                view="clear"
                width="full"
              />
              </Card>
            </GridItem>
            <GridItem colStart="4">
              <Card>
              </Card>
            </GridItem>
    </Grid>
  )
}
