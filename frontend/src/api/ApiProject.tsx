import authServer from "../ServiceAuth/authServer";
import { instance } from "./axios";

export interface Project {
    ID: number,
    id: string,
    Name: string,
    UserId: number,
    Description: string,
    Author: string,
}

export default class ApiProject {
    static async GetAllProject() {
        return await instance.get<Project[]>(
          'project',
          {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
    static async getProjectById(id: number | string) {
        return await instance.get<Project[]>(
            `/project/filter?field=id&val=${id}`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
}