import authServer from "../serviceAuth/authServer";
import { instance } from "./axios";

export interface TimeProjectData {
    ProjectId: number,
    Author: string,
    DataId: number,
    Duration: number,
    DataName: string,
    ViewId: string,
    ViewDuration: string,
}

export default class ApiTimeProjectData {
    static async getAllDataByProjectId(id: number) {
        return await instance.get<TimeProjectData[]>(
            `/time_project_data/filter?field=project_id&val=${id}`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
    static async getAllProjectByDataId(id: number) {
        return await instance.get<TimeProjectData[]>(
            `/time_project_data/filter?field=data_id&val=${id}`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
}