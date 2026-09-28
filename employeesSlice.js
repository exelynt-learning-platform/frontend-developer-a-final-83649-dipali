import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../api';
export const adapter = createEntityAdapter();
export const fetchEmployees = createAsyncThunk('employees/fetchAll', () => api.getEmployees());
export const searchEmployee = createAsyncThunk('employees/search', async (id, { rejectWithValue }) => {
  try { return await api.getEmployee(id); }
  catch (e) { return rejectWithValue(e.status === 404 ? 'NOT_FOUND' : e.message); }
});
export const addEmployee = createAsyncThunk('employees/add', (d) => api.createEmployee(d));
export const editEmployee = createAsyncThunk('employees/edit', ({ id, ...d }) => api.updateEmployee(id, d));
export const removeEmployee = createAsyncThunk('employees/remove', async (id) => { await api.deleteEmployee(id); return id; });

const idle = { status: 'idle', result: null, error: null };
const initialState = adapter.getInitialState({
  loading: false, saving: false, error: null, saveError: null, search: idle });
const slice = createSlice({ name: 'employees', initialState,
  reducers: {
    clearSearch: (s) => { s.search = idle; },
    clearSaveError: (s) => { s.saveError = null; } },
  extraReducers: (b) => b
    .addCase(fetchEmployees.pending, (s) => { s.loading = true; s.error = null; })
    .addCase(fetchEmployees.fulfilled, (s, a) => { s.loading = false; adapter.setAll(s, a.payload); })
    .addCase(fetchEmployees.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
    .addCase(searchEmployee.pending, (s) => { s.search = { status: 'loading', result: null, error: null }; })
    .addCase(searchEmployee.fulfilled, (s, a) => { s.search = { status: 'found', result: a.payload, error: null }; })
    .addCase(searchEmployee.rejected, (s, a) => {
      s.search = a.payload === 'NOT_FOUND'
        ? { status: 'notFound', result: null, error: null }
        : { status: 'error', result: null, error: a.payload || a.error.message }; })
    .addCase(addEmployee.pending, (s) => { s.saving = true; s.saveError = null; })
    .addCase(addEmployee.fulfilled, (s, a) => { s.saving = false; adapter.addOne(s, a.payload); })
    .addCase(addEmployee.rejected, (s, a) => { s.saving = false; s.saveError = a.error.message; })
    .addCase(editEmployee.pending, (s) => { s.saving = true; s.saveError = null; })
    .addCase(editEmployee.fulfilled, (s, a) => { s.saving = false; adapter.upsertOne(s, a.payload);
      if (s.search.result?.id === a.payload.id) s.search.result = a.payload; })
    .addCase(editEmployee.rejected, (s, a) => { s.saving = false; s.saveError = a.error.message; })
    .addCase(removeEmployee.fulfilled, (s, a) => { adapter.removeOne(s, a.payload);
      if (s.search.result?.id === a.payload) s.search = idle; })
    .addCase(removeEmployee.rejected, (s, a) => { s.error = a.error.message; }) });
export const { clearSearch, clearSaveError } = slice.actions;
export const { selectAll: selectAllEmployees } = adapter.getSelectors((s) => s.employees);
export default slice.reducer;
