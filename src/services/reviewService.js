import axios from 'axios';

const BASE_URL = 'http://localhost:1000/reviews'; 

export const fetchReviews = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

export const deleteReview = async (reviewId) => {
  await axios.delete(`${BASE_URL}/${reviewId}`);
};
