import authServer from "../serviceAuth/authServer";
import { instance } from "./axios";

export interface ProjectConfig {
    ID: number
    id: string
    BuildCommand: string
    Name: string
    RunFile: string
    ProjectFile: string
}

export default class ApiProjectConfig {
    
    static async getAllProjectConfigs() {
        return await instance.get<ProjectConfig[]>(
            `project_config`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }

    static async deleteProjectConfig(projectId: number) {
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
}