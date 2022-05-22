import React, {useState} from 'react';
import style from './profile.module.css';
import {Card} from '@consta/uikit/Card';

import {Grid, GridItem} from '@consta/uikit/Grid';
import {Text} from '@consta/uikit/Text';

import {MyTable, MyData} from '../main/main'

import {ModelAddProjectData} from '../addProject/addProject';
import {Combobox} from '@consta/uikit/Combobox';
import authServer from '../../ServiceAuth/authServer';

interface Props {
}
function Info() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [value, setValue] = useState<string | null>(null);
    const handleChange = ({value}: { value: string | null }) => setValue(value);
    const [desc, setDesc] = useState<string | null>(null);
    const handleChangeDesc = ({value}: { value: string | null }) => setDesc(value);
    const [userName, setUserName] = useState<string | null>("");
    const [userEmail, setUserEmail] = useState<string | null>("");
    authServer.getUserName().then(res => {
        setUserName(res.data.Name);
        setUserEmail(res.data.Email);
    })
    return (
        <Card>
            <Text truncate view="primary" size="2xl">{userName}</Text>
            <Text truncate view="secondary" size="l">{userEmail}</Text>
        </Card>
    )
}

type Item = {
    label: string;
    id: number;
};

const items: Item[] = [
    {
        label: 'Первый',
        id: 1,
    },
    {
        label: 'Первыйппп',
        id: 2,
    },
    {
        label: 'Перррр',
        id: 3,
    },
];

export function ComboboxExampleItems() {
    const [value, setValue] = useState<Item | null>();
    return (
        <Card>
            <Combobox
                items={items}
                value={value}
                onChange={({value}) => setValue(value)}
                placeholder="Поиск проекта"/>
        </Card>
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
        <Grid gap="l" cols="5" className={style.grid}>
            <GridItem><Info></Info></GridItem>
            <GridItem rowStart="2"><ModelAddProjectData></ModelAddProjectData></GridItem>
            <GridItem colStart="2" col="2" row="4"><Projects></Projects></GridItem>
            <GridItem colStart="4" col="2" row="4"><Datas></Datas></GridItem>
        </Grid>
    )
}