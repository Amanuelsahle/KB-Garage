import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeeService from "../../../../services/employee.service";

function EditEmployee() {
    const [employee_email, setEmail] = useState("");
    const [employee_first_name, setFirstName] = useState("");
    const [employee_last_name, setLastName] = useState("");
    const [employee_phone, setPhoneNumber] = useState("");
    const [active_employee, setActiveEmployeeStatus] = useState(1);
    const [company_role_id, setCompany_role_id] = useState(1);

    // Errors
    const [firstNameRequired, setFirstNameRequired] = useState("");
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");

    const { employeeId } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch employee details
        const fetchEmployee = async () => {
            try {
                const response = await employeeService.getEmployeeById(employeeId);
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    const employee = data.data;
                    setEmail(employee.employee_email || "");
                    setFirstName(employee.employee_first_name || "");
                    setLastName(employee.employee_last_name || "");
                    setPhoneNumber(employee.employee_phone || "");
                    setActiveEmployeeStatus(
                        employee.active_employee !== undefined
                            ? employee.active_employee
                            : 1
                    );
                    setCompany_role_id(employee.company_role_id || 1);
                } else {
                    setServerError("Failed to fetch employee data");
                }
            } catch (err) {
                setServerError("Failed to fetch employee data");
            }
        };
        if (employeeId) {
            fetchEmployee();
        }
    }, [employeeId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;
        if (!employee_first_name) {
            setFirstNameRequired("First name is required");
            valid = false;
        } else {
            setFirstNameRequired("");
        }

        if (!valid) return;

        const formData = {
            employee_first_name,
            employee_last_name,
            employee_phone,
            active_employee,
            company_role_id,
        };

        employeeService
            .updateEmployeeInfo(employeeId, formData)
            .then((response) => response.json())
            .then((data) => {
                const errText = data.error || data.message;
                if (data.status !== "success") {
                    setServerError(errText || "Failed to update employee");
                } else {
                    setSuccess(true);
                    setServerError("");
                    setTimeout(() => {
                        navigate(`/admin/employees`);
                    }, 2000);
                }
            })
            .catch((error) => {
                setServerError(error.message || "Failed to update employee");
            });
    };

    return (
        <section className="contact-section">
            <div className="auto-container">
                <div className="contact-title">
                    <h2>Edit Employee</h2>
                </div>
                <div className="row clearfix">
                    <div className="form-column col-lg-7">
                        <div className="inner-column">
                            <div className="contact-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="row clearfix">
                                        <div className="form-group col-md-12">
                                            {serverError && (
                                                <div className="validation-error" role="alert">
                                                    {serverError}
                                                </div>
                                            )}
                                            {success && (
                                                <div className="validation-success" role="alert" style={{ color: "green", marginBottom: "15px" }}>
                                                    Employee updated successfully!
                                                </div>
                                            )}
                                            <h6>Employee Email</h6>
                                            <input
                                                type="email"
                                                name="employee_email"
                                                value={employee_email}
                                                readOnly
                                                disabled
                                                style={{ backgroundColor: "#f5f5f5" }}
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <h6>First Name</h6>
                                            <input
                                                type="text"
                                                name="employee_first_name"
                                                value={employee_first_name}
                                                onChange={(event) => setFirstName(event.target.value)}
                                                required
                                            />
                                            {firstNameRequired && (
                                                <div className="validation-error" role="alert">
                                                    {firstNameRequired}
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group col-md-12">
                                            <h6>Last Name</h6>
                                            <input
                                                type="text"
                                                name="employee_last_name"
                                                value={employee_last_name}
                                                onChange={(event) => setLastName(event.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <h6>Phone Number</h6>
                                            <input
                                                type="text"
                                                name="employee_phone"
                                                value={employee_phone}
                                                onChange={(event) => setPhoneNumber(event.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <h6>Employee Role</h6>
                                            <select
                                                name="employee_role"
                                                value={company_role_id}
                                                onChange={(event) => setCompany_role_id(event.target.value)}
                                                className="custom-select-box"
                                            >
                                                <option value="1">Employee</option>
                                                <option value="2">Manager</option>
                                                <option value="3">Admin</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <label htmlFor="active_employee" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                                <input
                                                    type="checkbox"
                                                    name="active_employee"
                                                    id="active_employee"
                                                    checked={active_employee === 1} // Evaluates to true if 1, false if 0
                                                    onChange={(event) => setActiveEmployeeStatus(event.target.checked ? 1 : 0)}
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        cursor: "pointer",
                                                        accentColor: "#55b317", // Match your brand color
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color: active_employee === 1 ? "#55b317" : "#cc0000", // Color changes based on status
                                                        cursor: "pointer",
                                                        margin: 0,
                                                        userSelect: "none",
                                                    }}
                                                >
                                                    {active_employee === 1 ? "Active" : "Inactive"}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <button type="submit" className="theme-btn btn-style-one">Update Customer</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditEmployee;