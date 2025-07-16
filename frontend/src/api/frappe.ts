import axios from 'axios';

const frappe = axios.create({
  baseURL: 'http://library.local:8000/api',
  withCredentials: true,
});

export const getBooks = () =>
  frappe.get('/resource/Book');

export const login = (usr: string, pwd: string) =>
  frappe.post(
    '/method/login',
    new URLSearchParams({ usr, pwd }), // send as form-urlencoded
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );


export const logout = () =>
  frappe.post('/method/logout');

export const getCurrentUser = () =>
  frappe.get('/method/frappe.auth.get_logged_user');

