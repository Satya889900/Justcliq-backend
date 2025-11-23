export const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings) || ratings.length === 0) return 0;
  const totalRating = ratings.reduce((sum, current) => sum + current.rating, 0);
  return parseFloat((totalRating / ratings.length).toFixed(1));
};
