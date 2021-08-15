export default fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};
