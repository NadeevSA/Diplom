import axios, { AxiosInstance } from 'axios';
import { createSlice,createSelector,PayloadAction,createAsyncThunk,} from "@reduxjs/toolkit";

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const fetchProducts = createAsyncThunk<CounterState>(
    "products/fetchProducts", async (_, thunkAPI) => {
    const response = await axios.get(`url`);
    return response.data.value;
});

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
    });
    builder.addCase(
       fetchProducts.fulfilled, (state, { payload }) => {
          state.value += 2;
    });
    builder.addCase(
      fetchProducts.rejected,(state, action) => {
          state.value += 3;
    });
 }
})
export const selectProducts = createSelector(
    (state: { value: number }) => ({
        value: state.value
    }), (state) =>  state
  );
export default counterSlice.reducer;

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
