import axios, { AxiosInstance } from 'axios';
import { createSlice,createSelector,PayloadAction,createAsyncThunk,} from "@reduxjs/toolkit";
import { store, RootState } from '../../store'
import authServer from '../../ServiceAuth/authServer';
import { ProjectConfig } from '../../PaneContainer/AppPane/types';

export interface CounterState {
  value: number
  name: string;
}

export interface Project {
  id: string,
  Name: string,
  UserId: number,
  Description: string,
}

const initialState: CounterState = {
  value: 0,
  name: "",
}

const instance = axios.create({
  baseURL: "http://localhost:8084"
});

export const fetchProducts = createAsyncThunk<string>(
    "", async (_, thunkAPI) => {
    const response = await instance.get(`user`);
    console.log("name " + response.data[0].Name)
    return response.data[0].Name;
});

export const PostProject1 = (name: string | null) => createAsyncThunk<Project>(
  "project", async (_, thunkAPI) => {
    const { data } = await instance.post<Project>(
      'project',
      { Name: name, UserId: 1, Description: "desc"},
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    console.log("Post", data);
    return data;
});

export async function PostProject(id: string | null, name: string | null, desc: string | null) {
  const { data } = await instance.post<Project>(
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
  console.log("Post", data);
  return data;
}

export interface Data {
  ID: string,
  File: File,
  Label: string,
}

export interface ProjectConfigData {
  DataId: string,
  ProjectConfigId: string,
}

export function PostData(file: File | null, desc: string | null) {
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

export function PostProjectConfigData(Data: string | null, ProjectConfig: number | null) {
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

export async function GetProject() {
  const { data } = await instance.get<Project>(
    'project',
    {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
  );
  console.log("Get", data);
  return data;
}

export async function getUsers() {
  const { data } = await instance.get<Project>(
    'user',
    {headers: {Authorization : `Bearer ${authServer.getToken()}`}},
  );
  console.log("Get", data);
  return data;
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
        state.value += 1;
        state.name = "pending";
    });
    builder.addCase(
       fetchProducts.fulfilled, (state, { payload }) => {
          state.value = 200;
          state.name = payload;
          console.log("200 " + payload);
    });
    builder.addCase(
      fetchProducts.rejected,(state, action) => {
          state.value += 3;
          state.name = "rejected"
    });
 }
})

export const selectProducts = createSelector(
    (state: RootState) => ({
        name: state.counter.name,
        currentState: state.counter.value
    }), (state) =>  state
);

export default counterSlice.reducer;

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
