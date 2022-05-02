import style from './dashboard.module.css';
import { Card } from '@consta/uikit/Card';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Text } from '@consta/uikit/Text';
import { Column } from '@consta/charts/Column'
import { useState } from 'react';
import { Combobox } from '@consta/uikit/Combobox';
import { Button } from '@consta/uikit/Button';

interface Props {}

type Item = {
    name: string
    month: string
    value: number
  }
  
  const data: Item[] = [
    {
      name: '1алгоритм',
      month: '1НД',
      value: 30,
    },
  
    {
      name: '2алгоритм',
      month: '1НД',
      value: 35,
    },

    {
      name: '1алгоритм',
      month: '2НД',
      value: 25,
    },
    {
      name: '2алгоритм',
      month: '2НД',
      value: 28.8,
    },
    {
      name: '3алгоритм',
      month: '3НД',
      value: 25.3,
    },
    {
      name: '2алгоритм',
      month: '3НД',
      value: 40,
    },
    {
      name: '1алгоритм',
      month: '3НД',
      value: 33,
    },
]

const TextFieldExampleTypeText = () => {
  return(
  <Card>
      <Column
        data={data}
        xField="month"
        yField="value"
        seriesField="name"
        isGroup
        slider={{
          start: 0,
          end: 1,
        }}
        autoFit={false}
        label={{
          position: 'middle',
          layout: [
            { type: 'interval-adjust-position' },
            { type: 'interval-hide-overlap' },
            { type: 'adjust-color' },
          ],
        }}/>
  </Card>)
};

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
        <ComboboxExampleMultiple name="Выберите группу проектов"></ComboboxExampleMultiple>
        <ComboboxExampleMultiple name="Выберите конкретные проекты"></ComboboxExampleMultiple>
        <ComboboxExampleMultiple name="Выберите группу данных"></ComboboxExampleMultiple>
        <ComboboxExampleMultiple name="Выберите конкретные данные"></ComboboxExampleMultiple>
        <Button view="secondary" label="Применить"/> 
      </Card>
    )
}

export const dashboard = (props: Props) => {
    return (
      <Grid gap="xl" cols="4">
            <GridItem><Filter></Filter></GridItem>
            <GridItem colStart="2" col="3" row="2"><TextFieldExampleTypeText></TextFieldExampleTypeText></GridItem>
      </Grid>
    )
}
