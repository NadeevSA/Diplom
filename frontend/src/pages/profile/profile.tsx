import React, {useEffect, useState} from 'react';
import style from './profile.module.css';
import {Card} from '@consta/uikit/Card';
import {Grid, GridItem} from '@consta/uikit/Grid';
import {Text} from '@consta/uikit/Text';
import authServer from '../../serviceAuth/authServer';
import { ModelAddProjectData } from '../../modals/addProject/addProject';
import { Project } from '../../api/apiProject';
import { TableData } from '../../shared/tables/datas/tableData';
import { Data } from '../../api/apiData';
import {TableProject} from "../../shared/tables/Projects/tableProject";
import { IsMobile } from '../../App';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';

function Info() {
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

export const Profile = () => {
    type Item = string;
    const items: Item[] = ['Функции', 'Проекты', 'Данные'];

    const [newProject, setNewProject] = useState<Project | null>();
    const [newData, setNewData] = useState<Data | null>();
    const [value, setValue] = useState<Item | null>(items[0]);

    function createData(data : Data){
        setNewData(data);
    }

    function createProject(project : Project){
        setNewProject(project);
    }

    function Datas() {
        return (
            <Card>
                <Text weight="black" view="primary" size="2xl">Мои данные</Text>
                <TableData hidden={true} newData={newData}/>
            </Card>)
    }

    
    function Projects() {
        return (
            <Card>
                <Text weight="black" view="primary" size="2xl">Мои проекты</Text>
                <TableProject hidden={true} newProject={newProject}/>
            </Card>)
    }

    return (
        IsMobile() ?
        <div>
            <ChoiceGroup
                value={value}
                onChange={({ value }) => setValue(value)}
                items={items}
                getLabel={(item) => item}
                multiple={false}
                size="l"
                view="secondary"
                name="Choice"
                truncate
            />
            {
            value === "Функции" ?
            <div>
                    <Info></Info>
                    <ModelAddProjectData createProject={createProject} createData={createData}/>
            </div>
            :
            value === "Проекты" ?
                <div>
                    <Projects/>
                </div>
                :
                <div>
                    {
                        value === "Данные" ?
                        <div>
                            <Datas></Datas>
                        </div>
                        :
                        <div>

                        </div>
                    }
                </div>
            }
        </div>
        :
        <Grid gap="l" cols="5" className={style.grid}>
            <GridItem><Info/></GridItem>
            <GridItem rowStart="2"><ModelAddProjectData createProject={createProject} createData={createData}/></GridItem>
            <GridItem colStart="2" col="2" row="4"><Projects/></GridItem>
            <GridItem colStart="4" col="2" row="4"><Datas/></GridItem>
        </Grid>
    )
}