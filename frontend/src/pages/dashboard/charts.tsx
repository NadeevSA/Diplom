import style from './dashboard.module.css';
import { useState } from "react";
import { Button } from '@consta/uikit/Button';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Chart } from './chart';
import { Card } from '@consta/uikit/Card';

export function Charts() {  
    const [value, setValue] = useState<number[]>([1]);

    const Filter = () => {
      return (
        <div>
            <Button className={style.button} view="secondary" label="Добавить график" onClick={() => {
                setValue(old => [...old, value.length + 1])}}/>
            <Button className={style.button} view="secondary" label="Удалить график" onClick={() => {
                setValue(value.filter(id => id !== value.length))}}/>     
        </div>
      )
    }
  
    return (
        <Grid gap="xl" cols="4">
            <GridItem colStart="1" col="4" row="1"><Filter></Filter></GridItem>
            {
                value.map(id => <GridItem className={style.grid} colStart="1" col="4" row={`${id + 1}`}><Chart></Chart></GridItem>)
            }
        </Grid>
    )
  }