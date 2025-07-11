import axios from 'axios';

const BASE_URL = 'https://cakesstorebackend-production.up.railway.app/reviews'; 

export const fetchReviews = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

export const deleteReview = async (reviewId) => {
  await axios.delete(`${BASE_URL}/${reviewId}`);
};
