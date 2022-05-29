import React, {useState} from 'react';
import style from './profile.module.css';
import {Card} from '@consta/uikit/Card';
import {Grid, GridItem} from '@consta/uikit/Grid';
import {Text} from '@consta/uikit/Text';
import authServer from '../../serviceAuth/authServer';
import { ModelAddProjectData } from '../../modals/addProject/addProject';
import { Project } from '../../api/apiProject';
import { TableProject } from '../../shared/tables/Projects/tableProject';

interface Props {
}
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

function Datas() {
    return (
        <Card>
            <Text weight="black" view="primary" size="2xl">Мои данные</Text>
        </Card>)
}

export const Profile = () => {
    const [newProject, setNewProject] = useState<Project | null>();

    function createProject(project : Project){
        setNewProject(project);
    }

    function Projects() {
        return (
            <Card>
                <Text weight="black" view="primary" size="2xl">Мои проекты</Text>
                <TableProject hidden={true} newProject={newProject}></TableProject>
            </Card>)
    }
    return (
        <Grid gap="l" cols="5" className={style.grid}>
            <GridItem><Info></Info></GridItem>
            <GridItem rowStart="2"><ModelAddProjectData create={createProject}></ModelAddProjectData></GridItem>
            <GridItem colStart="2" col="2" row="4"><Projects></Projects></GridItem>
            <GridItem colStart="4" col="2" row="4"><Datas></Datas></GridItem>
        </Grid>
    )
}