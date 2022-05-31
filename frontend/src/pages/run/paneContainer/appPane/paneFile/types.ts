import {Status} from "../types";

export interface IPanelFile {
    status: Status
    output: string
    dataFile: IDataFile | null | undefined
    attachFileUrl: string
    fileContentUrl: string
}


export interface IDataFile {
    ID: number
    Label: string
    FileName: string
    File: string
}

export interface IProjectConfig {
    ID: number
    Name: string
}
