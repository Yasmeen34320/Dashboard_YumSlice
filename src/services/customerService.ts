import axios from 'axios';

export const getEmailVerificationStatus = async (uid: string): Promise<boolean> => {
    const res = await axios.get(`http://localhost:1000/firebase/verify-status/${uid}`);
    return res.data.emailVerified;
};


const API = axios.create({ baseURL: 'http://localhost:1000' });

export const getAllUsers = async () => {
    const response = await API.get('/users');
    return response.data.data;
};


export const getUserOrderStats = async (userId: string) => {
    const response = await axios.get(`http://localhost:1000/users/orderStats/${userId}`);
    return response.data.data;
};