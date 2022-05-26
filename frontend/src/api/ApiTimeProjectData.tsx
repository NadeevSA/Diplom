import axios from "axios";
import authServer from "../ServiceAuth/authServer";

const instance = axios.create({
    baseURL: "http://localhost:8084"
});

export interface TimeProjectData {
    projectId: string,
    author: string,
    dataId: string,
    duration: number,
}

export default class ApiTimeProjectData {
    static async getAll() {
        return await instance.get<TimeProjectData[]>(
            `/time_project_data/filter?field=project_id&val=2`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
}