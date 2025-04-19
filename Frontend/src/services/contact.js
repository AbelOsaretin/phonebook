import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
  console.log("effect");
  const request = axios.get(baseUrl);
  console.log("Get All Contact Promise Fulfilled");
  return request.then((response) => {
    console.log(response.data);
    return response.data;
  });
};

const addContact = (newPersonObj) => {
  const request = axios.post(baseUrl, newPersonObj);
  console.log("Add Contact Promise Fulfilled");
  return request.then((response) => response.data);
};

const deleteContact = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updateContactNumber = (id, newPersonObj) => {
  const request = axios.put(`${baseUrl}/${id}`, newPersonObj);
  return request.then((response) => response.data);
};

export default { getAll, addContact, deleteContact, updateContactNumber };
