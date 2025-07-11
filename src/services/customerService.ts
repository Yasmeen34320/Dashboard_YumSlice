import axios from 'axios';

const API = axios.create({ baseURL: 'https://cakesstorebackend-production.up.railway.app' });

// Get email verification status using Axios instance
export const getEmailVerificationStatus = async (uid: string): Promise<boolean> => {
    const res = await API.get(`/firebase/verify-status/${uid}`);
    return res.data.emailVerified;
};

// Get all users
export const getAllUsers = async () => {
    const response = await API.get('/users');
    return response.data.data;
};

// Get user order stats
export const getUserOrderStats = async (userId: string) => {
    const response = await API.get(`/users/orderStats/${userId}`);
    return response.data.data;
};

export const deleteUserById = async (id) => {
  return await API.delete(`/users/${id}`);
};
