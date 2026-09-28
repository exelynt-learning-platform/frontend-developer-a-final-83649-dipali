import { vi } from 'vitest';
import { makeStore } from '../store';
import { api } from '../api';
import { fetchEmployees, addEmployee, editEmployee, removeEmployee, searchEmployee, selectAllEmployees } from '../store/employeesSlice';
vi.mock('../api');
const e1 = { id: '1', name: 'Asha', email: 'a@x.com' };
describe('employees slice', () => {
  it('loads employees', async () => {
    api.getEmployees.mockResolvedValue([e1]); const s = makeStore();
    await s.dispatch(fetchEmployees());
    expect(selectAllEmployees(s.getState())).toEqual([e1]);
  });
  it('sets error on failure', async () => {
    api.getEmployees.mockRejectedValue(new Error('boom')); const s = makeStore();
    await s.dispatch(fetchEmployees());
    expect(s.getState().employees.error).toBe('boom');
  });
  it('adds, edits, deletes', async () => {
    const s = makeStore();
    api.createEmployee.mockResolvedValue(e1); await s.dispatch(addEmployee(e1));
    api.updateEmployee.mockResolvedValue({ ...e1, name: 'B' }); await s.dispatch(editEmployee({ ...e1, name: 'B' }));
    expect(selectAllEmployees(s.getState())[0].name).toBe('B');
    api.deleteEmployee.mockResolvedValue({}); await s.dispatch(removeEmployee('1'));
    expect(selectAllEmployees(s.getState())).toHaveLength(0);
  });
  it('flags not found on 404', async () => {
    api.getEmployee.mockRejectedValue(Object.assign(new Error('x'), { status: 404 })); const s = makeStore();
    await s.dispatch(searchEmployee('99'));
    expect(s.getState().employees.search.status).toBe('notFound');
  });
});
