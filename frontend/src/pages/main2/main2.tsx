import style from './main2.module.css';
import { Table, TableColumn, TableFilters } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { Data, GetProject, Project} from '../exampleRudexAxios/createSlice';
import { useSelector, useDispatch } from 'react-redux'
import axios, { AxiosInstance } from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { setOriginalNode } from 'typescript';
import { Loader } from '@consta/uikit/Loader';
import { Button } from '@consta/uikit/Button';
import { ProjectPage } from '../ProjectConfig/project';
import authServer from '../../ServiceAuth/authServer';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Card } from '@consta/uikit/Card';
import { Icon } from '@consta/uikit/__internal__/src/icons/Icon/Icon';
import { IconStorage } from '@consta/uikit/IconStorage';
import { IconTest } from '@consta/uikit/IconTest';
import { IconPlay } from '@consta/uikit/IconPlay';
import { IconUser } from '@consta/uikit/IconUser';
import { IconExit } from '@consta/uikit/IconExit';

interface Props {}

export const main2 = () => {
  return(
    <Grid gap="l" cols="5" rowGap="5xl" className={style.grid}>
            <GridItem colStart="2" col="3" row="1">
              <Text weight="bold" size="3xl">Система для сборки, хранения и запуска консольных приложений</Text>
            </GridItem>
            <GridItem colStart="2" row="3">
              <Card>
              <Button
                onlyIcon
                iconLeft={IconStorage}
                view="clear"
              />
              <Text weight="bold" size="l">Справочник</Text>
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
              <Text weight="bold" size="l">Аналитика</Text>
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
              <Button
                size="m"
                label="Запуск"
                view="clear"
                width="full"
                iconLeft={IconPlay}
              />
              <Button
                size="m"
                label="Личный кабинет"
                view="clear"
                width="full"
                disabled={authServer.getToken() == ""}
                iconLeft={IconUser}
              />
              <Button
                size="m"
                label="Выйти"
                view="clear"
                width="full"
                disabled={authServer.getToken() == ""}
                iconLeft={IconExit}
              />
              </Card>
            </GridItem>
    </Grid>
  )
}
