import { memo } from 'react';
function EmployeeTable({ employees, countryName, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Country</th><th className="text-end">Actions</th></tr></thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td><td>{e.name}</td><td>{e.email}</td><td>{e.mobile}</td>
              <td>{countryName(e.country)}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(e)}
                  aria-label={`Edit ${e.name}`}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(e)}
                  aria-label={`Delete ${e.name}`}>Delete</button>
              </td>
            </tr>))}
        </tbody>
      </table>
    </div>);
}
export default memo(EmployeeTable);
