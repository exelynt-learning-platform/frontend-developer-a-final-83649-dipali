import { memo, useState } from 'react';
function SearchBar({ onSearch, onClear }) {
  const [id, setId] = useState('');
  const submit = (e) => { e.preventDefault(); if (id.trim()) onSearch(id.trim()); };
  return (
    <form className="d-flex gap-2" onSubmit={submit} role="search">
      <input className="form-control" placeholder="Search employee by ID" aria-label="Employee ID"
        value={id} onChange={(e) => setId(e.target.value)} />
      <button className="btn btn-primary" type="submit">Search</button>
      <button className="btn btn-outline-secondary" type="button"
        onClick={() => { setId(''); onClear(); }}>Clear</button>
    </form>);
}
export default memo(SearchBar);
