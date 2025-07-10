import axios from 'axios';

const API_URL = 'http://localhost:1000/orders';

export const fetchOrders = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

export const deleteOrder = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateOrderStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/orderStatus/${id}`, { orderStatus: status });
  return res.data.data;
};
