import { instance } from "./axios";

export interface ProjectConfigData {
    DataId: string,
    ProjectConfigId: string,
}

export default class ApiProjectConfigData {
  static async PostProjectConfigData(Data: number | null, ProjectConfig: number | null) {
    return instance.post<ProjectConfigData>(
      'project_data',
      { DataId: Data, ProjectConfigId: ProjectConfig},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}