import style from './testing.module.css';
import { Card } from '@consta/uikit/Card';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Text } from '@consta/uikit/Text';
import { Pie } from '@consta/charts/Pie'
import { useState } from 'react';
import { Combobox } from '@consta/uikit/Combobox';
import { Button } from '@consta/uikit/Button';

interface Props {}

type Item1 = {
    label: string;
    id: number;
  };
  
  const items: Item1[] = [
    {
      label: 'Первый',
      id: 1,
    },
    {
      label: 'Второй',
      id: 2,
    },
    {
      label: 'Третий',
      id: 3,
    },
  ];

function ComboboxExampleMultiple(Props: { name: string | undefined; }) {
    const [value, setValue] = useState<Item1[] | null>();
    return (
      <Combobox
        className={style.combobox}
        placeholder={Props.name}
        items={items}
        value={value}
        onChange={({ value }) => setValue(value)}
        multiple
      />
    );
}
 
const Filter = () => {
    return(
      <Card className={style.card}>
        <Text>Фильтр</Text>
        <ComboboxExampleMultiple name="Выберите проект"></ComboboxExampleMultiple>
        <ComboboxExampleMultiple name="Выберите группу данных"></ComboboxExampleMultiple>
        <ComboboxExampleMultiple name="Выберите конкретные данные"></ComboboxExampleMultiple>
        <Button view="secondary" label="Применить"/> 
      </Card>
    )
}

type Item = {
    type: string;
    value: number;
};

const data: Item[] = [
    { type: 'Верно', value: 17 },
    { type: 'Неверно', value: 10 },
    { type: 'Нет данных', value: 3 },
]

const data1: Item[] = [
    { type: 'Уложился', value: 15 },
    { type: 'Не уложился', value: 10 },
    { type: 'Нет данных', value: 5 },
]

const PieForResults = () => {
    return(
        <Card className={style.card}>
            <Text>Статистика по результатам</Text>
            <Pie
                style={{
                    width: '100%',
                    height: '100%',
                }}
                label={{
                    type: 'inner',
                    offset: '-50%',
                    content: '{value}',
                    style: {
                      textAlign: 'center',
                      fontSize: 50,
                    },
                }}
                data={data}
                angleField="value"
                colorField="type"/>
        </Card>
    )
}

const PieForTime = () => {
    return(
        <Card className={style.card}>
            <Text>Статистика по времени</Text>
            <Pie
                style={{
                    width: '100%',
                    height: '100%',
                }}
                label={{
                    type: 'inner',
                    offset: '-50%',
                    content: '{value}',
                    style: {
                      textAlign: 'center',
                      fontSize: 50,
                    },
                }}
                data={data1}
                angleField="value"
                colorField="type"/>
        </Card>
    )
}

export const testing = (props: Props) => {
    return (
        <Grid gap="xl" cols="5">
            <GridItem><Filter></Filter></GridItem>
            <GridItem colStart="2" col="2"><PieForResults></PieForResults></GridItem>
            <GridItem colStart="4" col="2"><PieForTime></PieForTime></GridItem>
        </Grid>
    )
}