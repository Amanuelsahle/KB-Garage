import React, { useState, useEffect, useCallback } from "react";
import { Table, Button } from "react-bootstrap";
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";
import { getStoredEmployeeToken } from "../../../../util/auth";
import { useNavigate } from "react-router-dom";

const EmployeesList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);

  const { employee } = useAuth();
  const contextToken =
    typeof employee?.employee_token === "string"
      ? employee.employee_token.trim()
      : "";
  const token = contextToken || getStoredEmployeeToken();

  const loadEmployees = useCallback(() => {
    if (!token) {
      setApiError(true);
      setApiErrorMessage("Please log in to view employees.");
      return Promise.resolve();
    }
    setApiError(false);
    setApiErrorMessage(null);
    return employeeService.getAllEmployees(token).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(true);
        if (res.status === 401) {
          setApiErrorMessage("Please login again");
        } else if (res.status === 403) {
          setApiErrorMessage("You are not authorized to view this page");
        } else {
          setApiErrorMessage("Please try again later");
        }
        setEmployees([]);
        return;
      }
      setEmployees(Array.isArray(data.data) ? data.data : []);
    });
  }, [token]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

console.log(employee)
  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="contact-section">
            <div className="auto-container">
              <div className="contact-title">
                <h2>Employees</h2>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Active</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Added Date</th>
                    <th>Role</th>
                    <th>Edit/Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.employee_id} className={`${emp.active_employee ? "" : "table-danger"}`}>
                        <td>{emp.active_employee ? "Yes" : "No"}</td>
                        <td>{emp.employee_first_name}</td>
                        <td>{emp.employee_last_name}</td>
                        <td>{emp.employee_email}</td>
                        <td>{emp.employee_phone}</td>
                        <td>
                          {format(
                            new Date(emp.added_date),
                            "MM - dd - yyyy | HH:mm",
                          )}
                        </td>
                        <td>{emp.company_role_name}</td>
                        <td>
                          <div className="admin-row-actions d-flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => navigate(`/admin/employee/edit/${emp.employee_id}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline-danger"
                              size="sm"

                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </section>

        </>
      )}
    </>
  );
};

export default EmployeesList;
