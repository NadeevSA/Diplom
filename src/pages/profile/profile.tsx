import React from 'react';
import style from './profile.module.css';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Text } from '@consta/uikit/Text';
import { Table } from '@consta/uikit/Table';
import { rows, columns } from '../main/main'
import { CheckboxGroup } from '@consta/uikit/CheckboxGroup';

interface Props {}

function Info() {
    return (
        <Card>
            <Text truncate view="primary">Имя фамилия</Text>
            <Text view="secondary">Дополнительная информация, которая очень длинная, чтобы уместиться на одной строчке</Text>
            <Button
            className={style.button}
            size="s"
            view="secondary"
            label="Изменить"/>
        </Card>
    )
}

function Filter() {
    return (
        <Card>
            <Text truncate view="primary">Фильтр</Text>
            <CheckboxGroupExampleRow></CheckboxGroupExampleRow>
            <Button
            className={style.button}
            size="s"
            view="secondary"
            label="Применить"/>
        </Card>
    )
}

type Item = {
    name: string;
};
 
const items: Item[] = [
    { name: 'Проекты' },
    { name: 'Данные' },
    { name: 'Результаты' },
];

function CheckboxGroupExampleRow() {
    const [value, setValue] = React.useState<Item[] | null>(null);
    return (
      <CheckboxGroup
        className = {style.checkbox}
        value={value}
        items={items}
        getLabel={(item) => item.name}
        onChange={({ value }) => setValue(value)}
        direction="column"
        size="l"
      />
    );
} 

function Projects() {
    return (
    <Card>
        <Text weight="black" view="primary" size="2xl">Тут надо придумать название</Text>
        <Table rows={rows} columns={columns} 
        borderBetweenColumns
        zebraStriped="even"/>
    </Card>)
}

export const profile = (props: Props) => {
    return (
        <Grid gap="xl" cols="4">
            <GridItem><Info></Info></GridItem>
            <GridItem rowStart="2"><Filter></Filter></GridItem>
            <GridItem colStart="2" col="3" row="2"><Projects></Projects></GridItem>
        </Grid>
    )
}