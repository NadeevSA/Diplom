import style from './main.module.css';
import { Text } from '@consta/uikit/Text';
import { Button } from '@consta/uikit/Button';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Card } from '@consta/uikit/Card';
import { IconStorage } from '@consta/uikit/IconStorage';
import { IconTest } from '@consta/uikit/IconTest';
import { Link } from 'react-router-dom';
import { IsMobile } from '../../App';

export const main = () => {
  return(
    <Grid gap="l" cols={IsMobile() ? "1" : "4"} rowGap="5xl" className={IsMobile() ? style.grid : ''}>
            <GridItem colStart={IsMobile() ? "1" : "2"} col="2" rowStart="2">
              <Text weight="bold" size="3xl">Система для сборки, хранения и запуска консольных приложений</Text>
            </GridItem>
            <GridItem colStart={IsMobile() ? "1" : "2"} rowStart="3">
              <Card className={IsMobile() ? style.card : ''}>
              <Button
                onlyIcon
                iconLeft={IconStorage}
                view="clear"
              />
              <Text weight="bold" size="l">Справочники</Text>
              <Link to="/projects">
                <Button
                  size="m"
                  label="Проекты"
                  view="clear"
                  width="full"
                />
              </Link>
              <Link to="/datas">
                <Button
                  size="m"
                  label="Данные"
                  view="clear"
                  width="full"
                />  
              </Link>
              <Link to="/projectConfigs">
                <Button
                  size="m"
                  label="Конфигурации"
                  view="clear"
                  width="full"
                /> 
              </Link>
              </Card>
            </GridItem>
            <GridItem colStart={IsMobile() ? "1" : "3"} rowStart={IsMobile() ? "4" : "3"}>
              <Card className={IsMobile() ? style.card : ''}>
              <Button
                onlyIcon
                iconLeft={IconTest}
                view="clear"
              />
              <Text weight="bold" size="l">Функции</Text>
              <Link to="/run">
                <Button
                  size="m"
                  label="Запуск"
                  view="clear"
                  width="full"
                />
              </Link>
              <Link to="/dashboard">
                <Button
                  size="m"
                  label="Графики"
                  view="clear"
                  width="full"
                />
              </Link>
              </Card>
            </GridItem>
            <GridItem colStart="4">
              <Card>
              </Card>
            </GridItem>
    </Grid>
  )
}
