// Function to read the data from the user's local storage  
const getAuth = async () => {
  const raw = localStorage.getItem("employee");
  if (!raw) {
    return {};
  }
  let employee;
  try {
    employee = JSON.parse(raw);
  } catch {
    return {};
  }
  if (employee && employee.employee_token) {
    const decodedToken = await decodeTokenPayload(employee.employee_token);
    employee.employee_role = decodedToken.employee_role;
    employee.employee_id = decodedToken.employee_id;
    employee.employee_first_name = decodedToken.employee_first_name;
    return employee;
  } else {
    return {};
  }
};

/** Sync JWT for API calls before AuthContext has hydrated from getAuth(). */
function getStoredEmployeeToken() {
  try {
    const raw = localStorage.getItem("employee");
    if (!raw) return null;
    const data = JSON.parse(raw);
    const t = data?.employee_token;
    return typeof t === "string" && t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

// Function to decode the payload from the token
// The purpose of this code is to take a JWT token, extract its payload, decode it from Base64Url encoding, and then convert the decoded payload into a JavaScript object for further use and manipulation
const decodeTokenPayload = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export default getAuth;
export { getStoredEmployeeToken };