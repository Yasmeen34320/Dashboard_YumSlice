import axios from 'axios';

const API_URL = 'http://localhost:1000/admins';

export const fetchAdmins = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createAdmin = async (email, password) => {
  const { data } = await axios.post(API_URL, { email, password });
  return data;
};

export const deleteAdmin = async (uid) => {
  await axios.delete(`${API_URL}/${uid}`);
};
