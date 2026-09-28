import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../api';
export const fetchCountries = createAsyncThunk('countries/fetch', () => api.getCountries(),
  { condition: (_, { getState }) => getState().countries.items.length === 0 }); // avoid refetching
const slice = createSlice({ name: 'countries', initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => b
    .addCase(fetchCountries.pending, (s) => { s.loading = true; s.error = null; })
    .addCase(fetchCountries.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
    .addCase(fetchCountries.rejected, (s, a) => { s.loading = false; s.error = a.error.message; }) });
export default slice.reducer;
