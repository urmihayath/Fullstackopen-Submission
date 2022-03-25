import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (dataObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, dataObject, config);

  return res.data;
};
const exports = { getAll, create, setToken };

export default exports;
