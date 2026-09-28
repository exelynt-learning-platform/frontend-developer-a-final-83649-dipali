import { configureStore } from '@reduxjs/toolkit';
import employees from './employeesSlice';
import countries from './countriesSlice';
export const makeStore = (preloadedState) => configureStore({ reducer: { employees, countries }, preloadedState });
export const store = makeStore();
