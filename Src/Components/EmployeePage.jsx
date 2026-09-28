import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../store/countriesSlice';
import { addEmployee, clearSaveError, clearSearch, editEmployee, fetchEmployees,
  removeEmployee, searchEmployee, selectAllEmployees } from '../store/employeesSlice';
import SearchBar from './SearchBar';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';
import ConfirmDialog from './ConfirmDialog';

// Smart component: owns state + business logic
export default function EmployeePage() {
  const dispatch = useDispatch();
  const employees = useSelector(selectAllEmployees);
  const { loading, error, saving, saveError, search } = useSelector((s) => s.employees);
  const countries = useSelector((s) => s.countries.items);
  const [formFor, setFormFor] = useState(null);   // null | {} (new) | employee (edit)
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { dispatch(fetchEmployees()); dispatch(fetchCountries()); }, [dispatch]);

  const countryName = useCallback((v) => {
    const c = countries.find((x) => String(x.id) === String(v) || x.name === v);
    return c ? c.name : v || '-';
  }, [countries]);
  const onSearch = useCallback((id) => dispatch(searchEmployee(id)), [dispatch]);
  const onClear = useCallback(() => dispatch(clearSearch()), [dispatch]);
  const onEdit = useCallback((e) => { dispatch(clearSaveError()); setFormFor(e); }, [dispatch]);
  const onDelete = useCallback((e) => setToDelete(e), []);

  const visible = useMemo(() => search.status === 'found' ? [search.result]
    : search.status === 'idle' ? employees : [], [search, employees]);

  const save = async (values) => {
    const res = await dispatch(values.id ? editEmployee(values) : addEmployee(values));
    if (!res.error) setFormFor(null);
  };
  const confirmDelete = async () => { await dispatch(removeEmployee(toDelete.id)); setToDelete(null); };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 m-0">Employees</h1>
        <button className="btn btn-success" onClick={() => { dispatch(clearSaveError()); setFormFor({}); }}>Add employee</button>
      </div>
      <div className="mb-3"><SearchBar onSearch={onSearch} onClear={onClear} /></div>

      {loading && <div className="text-center py-5"><div className="spinner-border" role="status" /><span className="visually-hidden">Loading</span></div>}
      {error && <div className="alert alert-danger" role="alert">{error} <button className="btn btn-sm btn-link" onClick={() => dispatch(fetchEmployees())}>Retry</button></div>}
      {search.status === 'loading' && <p>Searching…</p>}
      {search.status === 'notFound' && <div className="alert alert-warning" role="alert">No employee found with that ID.</div>}
      {search.status === 'error' && <div className="alert alert-danger" role="alert">{search.error}</div>}
      {!loading && !error && search.status === 'idle' && employees.length === 0 &&
        <p className="text-muted text-center py-5">No employees yet. Add your first employee.</p>}
      {visible.length > 0 && <EmployeeTable employees={visible} countryName={countryName} onEdit={onEdit} onDelete={onDelete} />}

      {formFor && <EmployeeForm initial={formFor.id ? formFor : null} countries={countries} saving={saving}
        error={saveError} onSubmit={save} onCancel={() => setFormFor(null)} />}
      {toDelete && <ConfirmDialog message={`Delete ${toDelete.name}? This cannot be undone.`}
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />}
    </div>);
}
