import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '../store';
import { api } from '../api';
import EmployeePage from '../components/EmployeePage';
import EmployeeForm from '../components/EmployeeForm';
import { validate } from '../components/validate';
vi.mock('../api');

describe('validate', () => {
  it('flags required, email, length', () => {
    const e = validate({ name: '', email: 'bad', mobile: '12', country: '', state: '', district: '' });
    expect(e.name).toMatch(/required/); expect(e.email).toMatch(/valid/); expect(e.mobile).toBeTruthy();
    expect(validate({ name: 'Asha', email: 'a@x.com', mobile: '9876543210', country: '1', state: 'KA', district: 'BLR' })).toEqual({});
  });
});
describe('EmployeeForm', () => {
  it('shows errors and blocks submit when invalid', async () => {
    const onSubmit = vi.fn();
    render(<EmployeeForm countries={[]} onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it('pre-populates when editing', () => {
    render(<EmployeeForm initial={{ id: '1', name: 'Asha', email: 'a@x.com', mobile: '9876543210', country: '1', state: 's', district: 'd' }}
      countries={[{ id: '1', name: 'India' }]} onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText('Name')).toHaveValue('Asha');
  });
});
describe('EmployeePage', () => {
  beforeEach(() => {
    api.getCountries.mockResolvedValue([{ id: '1', name: 'India' }]);
    api.getEmployees.mockResolvedValue([{ id: '1', name: 'Asha', email: 'a@x.com', mobile: '9876543210', country: '1' }]);
  });
  const setup = () => render(<Provider store={makeStore()}><EmployeePage /></Provider>);
  it('lists employees with country name', async () => {
    setup(); expect(await screen.findByText('Asha')).toBeInTheDocument();
    expect(await screen.findByText('India')).toBeInTheDocument();
  });
  it('shows message when search finds nothing', async () => {
    api.getEmployee.mockRejectedValue(Object.assign(new Error('nf'), { status: 404 }));
    setup(); await screen.findByText('Asha');
    await userEvent.type(screen.getByLabelText('Employee ID'), '99');
    await userEvent.click(screen.getByText('Search'));
    expect(await screen.findByText(/No employee found/)).toBeInTheDocument();
  });
  it('confirms before deleting', async () => {
    api.deleteEmployee.mockResolvedValue({});
    setup(); await screen.findByText('Asha');
    await userEvent.click(screen.getByLabelText('Delete Asha'));
    expect(screen.getByText(/Delete Asha\?/)).toBeInTheDocument();
    await userEvent.click(screen.getAllByText('Delete').pop());
    expect(api.deleteEmployee).toHaveBeenCalledWith('1');
  });
});
