import React, { useState } from 'react';
import style from './profile.module.css';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { Grid, GridItem } from '@consta/uikit/Grid';
import { Text } from '@consta/uikit/Text';
import { Table } from '@consta/uikit/Table';
import { rows, columns, MyTable, MyData } from '../main/main'
import { CheckboxGroup } from '@consta/uikit/CheckboxGroup';
import { ModelAddProjectData } from '../../pages/addProject/addProject';
import { Modal } from '@consta/uikit/Modal';
import { Layout } from '@consta/uikit/LayoutCanary';
import { TextField } from '@consta/uikit/TextField';
import { PostProject } from '../exampleRudexAxios/createSlice';

interface Props {}

function Info() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({ value }: { value: string | null }) => setValue(value);
    const [desc, setDesc] = useState<string | null>(null);
    const handleChangeDesc = ({ value }: { value: string | null }) => setDesc(value);
    return (
        <Card>
            <Text truncate view="primary" size="2xl">Nadeev Sergey</Text>
            <Text truncate view="secondary" size="l">nadeevSA@mail.ru</Text>
            <Text view="secondary" size="l">Студент группы ПРО-421</Text>
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
        <Text weight="black" view="primary" size="2xl">Мои проекты</Text>
        <MyTable isHidden={true}></MyTable>
    </Card>)
}

function Datas() {
    return (
    <Card>
        <Text weight="black" view="primary" size="2xl">Мои данные</Text>
        <MyData></MyData>
    </Card>)
}

export const profile = (props: Props) => {
    return (
        <Grid gap="xl" cols="5" className={style.grid}>
            <GridItem><Info></Info></GridItem>
            <GridItem rowStart="2"><ModelAddProjectData></ModelAddProjectData></GridItem>
            <GridItem colStart="2" col="2" row="2"><Projects></Projects></GridItem>
            <GridItem colStart="4" col="2" row="2"><Datas></Datas></GridItem>
        </Grid>
    )
}