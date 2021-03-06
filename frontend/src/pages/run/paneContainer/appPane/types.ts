/* eslint-disable */
export interface IPane {
    fileContentUrl: string
    projectConfigUrl: string
    buildUrl: string
    runUrl: string
    isRunningUrl: string
    attachUrl: string
    attachUrlFileUrl: string
    dataFileUrl: string
    statusCheckUrl: string
}

export enum Status {
    Default,
    Build,
}

export enum ConfigurationType {
    Go,
}

export interface AttachIntentInput {
    Name: string
    Input: string
}

export interface RunIntent {
    id: string
    container_name: string
}

export interface AttachIntentFile {
    Name: string
    Data_id: string
}

export interface ProjectConfig {
    ID: number
    BuildCommand: string
    Name: string
    RunFile: string
    PathToEntry: string
    ProjectFile: string
    File: string
    Author: string
    ProjectId: string;
    Status: Status
    ConfigurationType: ConfigurationType
}