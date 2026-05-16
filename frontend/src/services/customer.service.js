import { getStoredEmployeeToken } from "../util/auth";

const api_url = process.env.REACT_APP_API_URL;
function resolveEmployeeToken(explicit) {
  if (typeof explicit === "string" && explicit.trim().length > 0) {
    return explicit.trim();
  }
  return getStoredEmployeeToken();
}

// A function to send post request to create a new customer
const createCustomer = async (formData, loggedInEmployeeToken) => {
  const token = resolveEmployeeToken(loggedInEmployeeToken);
  if (!token) {
    return new Response(
      JSON.stringify({ status: "fail", message: "No token provided" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(formData),
  };
  console.log(requestOptions);
  const response = await fetch(`${api_url}/api/customer`, requestOptions);
  return response;
};

// A function to send get request to get all customers
const getAllCustomers = async (loggedInEmployeeToken) => {
  const token = resolveEmployeeToken(loggedInEmployeeToken);
  if (!token) {
    return new Response(
      JSON.stringify({ status: "fail", message: "No token provided" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  const requestOptions = {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/customers`, requestOptions);
  return response;
};

const getCustomerById = async (customerId) => {
  const response = await fetch(`${api_url}/api/customers/${customerId}`, {
    method: "GET",
  });
  return response;
};

const getCustomerVehicles = async (customerId) => {
  const response = await fetch(
    `${api_url}/api/customers/${customerId}/vehicles`,
    { method: "GET" },
  );
  return response;
};

const addCustomerVehicle = async (customerId, formData) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(
    `${api_url}/api/customers/${customerId}/vehicles`,
    requestOptions,
  );
  return response;
};

const updateCustomerStatus = async (
  customerId,
  active_customer_status,
  loggedInEmployeeToken,
) => {
  const token = resolveEmployeeToken(loggedInEmployeeToken);
  if (!token) {
    return new Response(
      JSON.stringify({ status: "fail", message: "No token provided" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ active_customer_status }),
  };
  return fetch(`${api_url}/api/customers/${customerId}`, requestOptions);
};

const deleteCustomer = async (customerId, loggedInEmployeeToken) => {
  const token = resolveEmployeeToken(loggedInEmployeeToken);
  if (!token) {
    return new Response(
      JSON.stringify({ status: "fail", message: "No token provided" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  return fetch(`${api_url}/api/customers/${customerId}`, requestOptions);
};

const updateCustomer = async (customerId, formData) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  return fetch(`${api_url}/api/customer/edit/${customerId}`, requestOptions);
};

const customerService = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerVehicles,
  addCustomerVehicle,
  updateCustomerStatus,
  deleteCustomer,
  updateCustomer,
};
export default customerService;
