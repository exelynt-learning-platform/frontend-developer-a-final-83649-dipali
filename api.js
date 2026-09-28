const BASE = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1';
async function req(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) {
    const err = new Error(res.status === 404 ? 'Not found' : `Request failed (${res.status})`);
    err.status = res.status; throw err;
  }
  return res.json();
}
export const api = {
  getCountries: () => req('/country'),
  getEmployees: () => req('/employee'),
  getEmployee: (id) => req(`/employee/${encodeURIComponent(id)}`),
  createEmployee: (d) => req('/employee', { method: 'POST', body: JSON.stringify(d) }),
  updateEmployee: (id, d) => req(`/employee/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  deleteEmployee: (id) => req(`/employee/${id}`, { method: 'DELETE' }),
};
