import authServer from "../serviceAuth/authServer";
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

    static async GetProjectById(id: number | string) {
        return await instance.get<Project[]>(
            `/project/filter?field=id&val=${id}`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }

    static async GetProjectByUserId(id: number | string) {
      return await instance.get<Project[]>(
          `/project/filter?field=User_id&val=${id}`, 
          {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
      );
    }

    static async PostProject(id: string | null, name: string | null, desc: string | null) {
        return await instance.post<Project>(
          'project',
          { Name: name, Description: desc, UserId: id},
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${authServer.getToken()}`,
            },
          },
        );
    }
}