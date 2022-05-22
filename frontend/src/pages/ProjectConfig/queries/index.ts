import axios from "axios";

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
        {headers: {Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTIzNjc0NDUuODE3NzM0LCJpYXQiOjE2NTIyODEwNDUuODE3NzM0LCJ1c2VybmFtZSI6Ildlc3QxIn0.S0mN5EgR11_MnbvO7n0DDzEMGVleYPgUzkbhAehfDDQ"}},
    );
    console.log("Get", data);
    return data;
}

export async function GetConfigurationFiltered(filter: string) {
    const { data } = await instance.get<IConfiguration[]>(
        `project_config/filter?${filter}`,
        {headers: {Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTIzNjc0NDUuODE3NzM0LCJpYXQiOjE2NTIyODEwNDUuODE3NzM0LCJ1c2VybmFtZSI6Ildlc3QxIn0.S0mN5EgR11_MnbvO7n0DDzEMGVleYPgUzkbhAehfDDQ"}},
    );
    console.log("Get", data);
    return data;
}

export async function AddProjectConfig(projectId: string,
                                       dockerConfigId: string,
                                       projectName: string,
                                       projectCommandBuild: string,
                                       runFile: string,
                                       projectPathToEntry: string,
                                       file: File) {
    await instance.post(
        'project_config',
        {
            ProjectId: projectId,
            DockerConfigId: dockerConfigId,
            BuildCommand: projectCommandBuild,
            RunFile: runFile,
            PathToEntry: projectPathToEntry,
            ProjectName: projectName,
            File: file
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: '*/*',
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTI2MDc5NjAuMDY1OTY5LCJpYXQiOjE2NTI1MjE1NjAuMDY1OTY5LCJ1c2VybmFtZSI6Ildlc3QifQ.QmhkeAO2-a2iKmA4lhQlRN4_eJkph5xCC2VqsVXE8zc",
            },
        },
    );
}


export async function PutProjectConfig(
                                       id:string,
                                       projectId: string,
                                       dockerConfigId: string,
                                       projectName: string,
                                       projectCommandBuild: string,
                                       runFile: string,
                                       projectPathToEntry: string,
                                       file?: File) {
    await instance.put(
        'project_config',
        {
            ID: id,
            ProjectId: projectId,
            DockerConfigId: dockerConfigId,
            BuildCommand: projectCommandBuild,
            RunFile: runFile,
            PathToEntry: projectPathToEntry,
            ProjectName: projectName,
            File: file
        },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: '*/*',
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTI2MDc5NjAuMDY1OTY5LCJpYXQiOjE2NTI1MjE1NjAuMDY1OTY5LCJ1c2VybmFtZSI6Ildlc3QifQ.QmhkeAO2-a2iKmA4lhQlRN4_eJkph5xCC2VqsVXE8zc",
            },
        },
    );
}