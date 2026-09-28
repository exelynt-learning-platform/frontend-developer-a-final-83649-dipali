export function validate(v) {
  const e = {};
  const req = (k, label, max) => {
    const val = (v[k] ?? '').toString().trim();
    if (!val) e[k] = `${label} is required`;
    else if (val.length > max) e[k] = `${label} must be at most ${max} characters`;
    return val;
  };
  const name = req('name', 'Name', 50);
  if (!e.name && name.length < 2) e.name = 'Name must be at least 2 characters';
  const email = req('email', 'Email', 100);
  if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
  const mobile = req('mobile', 'Mobile', 15);
  if (!e.mobile && !/^\+?\d{7,15}$/.test(mobile)) e.mobile = 'Mobile must be 7-15 digits';
  if (!v.country) e.country = 'Country is required';
  req('state', 'State', 50); req('district', 'District', 50);
  return e;
}
