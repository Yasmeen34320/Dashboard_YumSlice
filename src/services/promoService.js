import axios from 'axios';

const BASE_URL = 'https://cakesstorebackend-production.up.railway.app/promocodes'; 

// Get all promo codes
export const getAllPromoCodes = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

// Create a new promo code
export const createPromoCode = async (promo) => {
  const res = await axios.post(BASE_URL, promo);
  return res.data;
};

// Update a promo code by ID
export const updatePromoCode = async (id, updatedData) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updatedData);
  return res.data;
};

// Delete a promo code by ID
export const deletePromoCode = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
