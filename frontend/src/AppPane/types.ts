/* eslint-disable */
export interface IPane {
    buildUrl: string
    runUrl: string
    attachUrl: string
    statusCheckUrl: string
    projectId: string
    projectName: string
    currentStatus: Status
}

export enum Status {
    Default,
    Build,
    Running,
}

export enum ConfigurationType{
    Go,
}

export interface AttachIntent{
    Name:  string
    Input: string
}

export interface ProjectConfig {
    ID:                number
    BuildCommand:      string
    Name:              string
    RunFile:           string
    PathToEntry:       string
    ProjectFile:       string
    File:              string
    Status:            Status
    ConfigurationType: ConfigurationType
}