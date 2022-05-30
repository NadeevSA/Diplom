import authServer from "../serviceAuth/authServer";
import { instance } from "./axios";

export interface Data {
    ID: number,
    id: string,
    Label: string,
    FileName: string,
}

export default class ApiData {
    static async getAllData() {
        return await instance.get<Data[]>(
            `data`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
    static async getDataById(id: number | string) {
        return await instance.get<Data[]>(
            `/data/filter?field=id&val=${id}`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
    static async getDataContentById(id: number | string) {
      return await instance.get<string>(
          `/data/content?id=${id}`, 
          {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
      );
  }
    static async getDataByUserEmail(email: string) {
      return await instance.get<Data[]>(
          `/data/filter?field=author&val=${email}`, 
          {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
      );
    }
    static async postData(file: File | null, desc: string | null) {
        return instance.post<Data>(
          'data',
          { File: file, Label: desc},
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authServer.getToken()}`,
            },
          },
        );
    }
    static async deleteData(dataId: number) {
      return instance.delete(
          'data',
          {
              headers: {
                  'Content-Type': 'application/json',
                  Accept: '*/*',
                  Authorization: `Bearer ${authServer.getToken()}`,
              },
              data: {
                  Ids: [dataId]
              },
          },
      );
    } 
}