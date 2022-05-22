import axios from "axios";
import authServer from "../../../ServiceAuth/authServer";

const instance = axios.create({
    baseURL: "http://localhost:8084"
});

export interface IConfiguration {
    ID: string
    BuildCommand: string
    Name: string
    RunFile: string
    PathToEntry: string
    ProjectFile: string
    File: File

    ProjectId: string
    DockerConfigId: string
}

export enum ConfigurationType {
    Go,
    Cpp,
}

export interface IDockerConfiguration {
    ID: string
    Config: ConfigurationType
    Description: string
}
export async function GetDockerConfigs() {
    const { data } = await instance.get<IDockerConfiguration[]>(
        'docker_config/all',
        {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
    );
    console.log("Get", data);
    return data;
}

export async function GetConfigurationFiltered(filter: string) {
    const { data } = await instance.get<IConfiguration[]>(
        `project_config/filter?${filter}`,
        {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
    );
    console.log("Get", data);
    return data;
}

export async function AddProjectConfig(projectId: string,
                                       dockerConfigId: string,
                                       projectCommandBuild: string,
                                       runFile: string,
                                       projectPathToEntry: string,
                                       file: File) {
    return instance.post(
        'project_config',
        {
            ProjectId: projectId,
            DockerConfigId: dockerConfigId,
            BuildCommand: projectCommandBuild,
            RunFile: runFile,
            PathToEntry: projectPathToEntry,
            File: file
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: '*/*',
                Authorization: `Bearer ${authServer.getToken()}`
            },
        },
    );
}


export async function PutProjectConfig(
           id:string,
           projectId: string,
           dockerConfigId: string,
           projectCommandBuild: string,
           runFile: string,
           projectPathToEntry: string,
           file?: File) {
    return instance.put(
        'project_config',
        {
            ID: id,
            ProjectId: projectId,
            DockerConfigId: dockerConfigId,
            BuildCommand: projectCommandBuild,
            RunFile: runFile,
            PathToEntry: projectPathToEntry,
            File: file
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: '*/*',
                Authorization: `Bearer ${authServer.getToken()}`
            },
        },
    );
}


export async function DeleteProjectConfig(
    projectId: string) {
    return instance.delete(
        'project',
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                Authorization: `Bearer ${authServer.getToken()}`,
            },
            data: {
                Ids: [projectId]
            },
        },
    );
}