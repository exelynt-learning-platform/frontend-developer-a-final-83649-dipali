import { useState } from 'react';
import { validate } from './validate';
const EMPTY = { name: '', email: '', mobile: '', country: '', state: '', district: '' };
const TOP = [['name', 'Name'], ['email', 'Email'], ['mobile', 'Mobile']];
const BOTTOM = [['state', 'State'], ['district', 'District']];

export default function EmployeeForm({ initial, countries, saving, error, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...(initial || {}) }); // pre-populated on edit
  const [touched, setTouched] = useState({});
  const errors = validate(values);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const show = (k) => touched[k] && errors[k];
  const submit = (e) => {
    e.preventDefault();
    setTouched({ name: 1, email: 1, mobile: 1, country: 1, state: 1, district: 1 });
    if (Object.keys(errors).length === 0) onSubmit(values);
  };
  const text = ([k, label]) => (
    <div className="mb-3" key={k}>
      <label htmlFor={k} className="form-label">{label}</label>
      <input id={k} className={`form-control ${show(k) ? 'is-invalid' : ''}`} value={values[k]}
        onChange={set(k)} onBlur={blur(k)} />
      {show(k) && <div className="invalid-feedback">{errors[k]}</div>}
    </div>);
  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,.5)', overflowY: 'auto' }} role="dialog" aria-modal="true">
      <div className="modal-dialog"><form className="modal-content" onSubmit={submit} noValidate>
        <div className="modal-header"><h5 className="modal-title">{initial ? 'Edit employee' : 'Add employee'}</h5></div>
        <div className="modal-body">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {TOP.map(text)}
          <div className="mb-3">
            <label htmlFor="country" className="form-label">Country</label>
            <select id="country" className={`form-select ${show('country') ? 'is-invalid' : ''}`}
              value={values.country} onChange={set('country')} onBlur={blur('country')}>
              <option value="">Select country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {show('country') && <div className="invalid-feedback">{errors.country}</div>}
          </div>
          {BOTTOM.map(text)}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form></div>
    </div>);
}
