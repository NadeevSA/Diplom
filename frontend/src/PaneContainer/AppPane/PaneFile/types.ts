import {Status} from "../types";

export interface IPanelFile {
    status: Status
    dataFiles: IDataFile[]
    // eslint-disable-next-line no-unused-vars
    onSetDataFile: (dataFile: IDataFile) => void
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
