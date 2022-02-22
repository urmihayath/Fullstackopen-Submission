import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);

  return response.data;
};

export default { getAll, create, setToken };
