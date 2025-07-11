import axios from 'axios';

const API_BASE = 'https://cakesstorebackend-production.up.railway.app/products'; 

// GET all products
export const getAllProducts = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

// DELETE product by ID
export const deleteProductById = async (productId) => {
  const response = await axios.delete(`${API_BASE}/${productId}`);
  return response.data;
};

// ADD new product
export const createProduct = async (productData) => {
  const response = await axios.post(API_BASE, productData);
  return response.data;
};

// UPDATE product (if needed)
export const updateProductById = async (productId, updatedData) => {
  const response = await axios.put(`${API_BASE}/${productId}`, updatedData);
  return response.data;
};

export const getProductById = async (id) => {
   const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};