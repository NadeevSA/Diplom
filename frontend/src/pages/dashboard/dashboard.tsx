import style from './dashboard.module.css';
import { Card } from '@consta/uikit/Card';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Text } from '@consta/uikit/Text';
import { Column } from '@consta/charts/Column'
import { useState } from 'react';
import { Combobox } from '@consta/uikit/Combobox';
import { Button } from '@consta/uikit/Button';
import ApiTimeProjectData, { TimeProjectData } from '../../api/ApiTimeProjectData';
import { Chart } from './chart';

export const dashboard = () => {

  const Filter = () => {
    return(
      <Card className={style.card}>
        <Text>Фильтр</Text>
        <Button view="secondary" label="Применить"/> 
      </Card>
    )
  }

    return (
      <Grid gap="xl" cols="4">
            <GridItem><Filter></Filter></GridItem>
            <GridItem colStart="2" col="3" row="2"><Chart></Chart></GridItem>
      </Grid>
    )
}
