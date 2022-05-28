import authServer from "../ServiceAuth/authServer";
import { instance } from "./axios";

export interface Data {
    ID: number,
    File: File,
    Label: string,
    FileName: string,
}

export default class ApiTimeProjectData {
    static async getAllData() {
        return await instance.get<Data[]>(
            `data`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
    static async getDataById(id: number) {
        return await instance.get<Data[]>(
            `/data/filter?field=id&val=${id}`, 
            {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
        );
    }
}