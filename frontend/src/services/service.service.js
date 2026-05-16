const api_url = process.env.REACT_APP_API_URL;

// add service function
const addService = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/services`, requestOptions);
  return response;
};

const getAllServices = async () => {
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(`${api_url}/api/services`, requestOptions);
  return response;
};

const serviceService = {
  addService,
  getAllServices,
};
export default serviceService;
