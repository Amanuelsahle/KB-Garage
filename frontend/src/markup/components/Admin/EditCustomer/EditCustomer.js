import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../../../services/customer.service";


function EditCustomer() {
    const [customer_email, setEmail] = useState("");
    const [customer_first_name, setFirstName] = useState("");
    const [customer_last_name, setLastName] = useState("");
    const [customer_phone_number, setPhoneNumber] = useState("");
    const [active_customer_status, setActiveCustomerStatus] = useState(1);

    // Errors
    const [firstNameRequired, setFirstNameRequired] = useState("");
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");

    const { customerId } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch customer details
        const fetchCustomer = async () => {
            try {
                const response = await customerService.getCustomerById(customerId);
                if (response.ok) {
                    const data = await response.json();
                    const customer = data.data;
                    setEmail(customer.customer_email || "");
                    setFirstName(customer.customer_first_name || "");
                    setLastName(customer.customer_last_name || "");
                    setPhoneNumber(customer.customer_phone_number || "");
                    setActiveCustomerStatus(
                        customer.active_customer_status !== undefined
                            ? customer.active_customer_status
                            : 1
                    );
                } else {
                    setServerError("Failed to fetch customer data");
                }
            } catch (err) {
                setServerError("Failed to fetch customer data");
            }
        };
        if (customerId) {
            fetchCustomer();
        }
    }, [customerId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;
        if (!customer_first_name) {
            setFirstNameRequired("First name is required");
            valid = false;
        } else {
            setFirstNameRequired("");
        }

        if (!valid) return;

        const formData = {
            customer_first_name,
            customer_last_name,
            customer_phone_number,
            active_customer_status,
        };

        customerService
            .updateCustomer(customerId, formData)
            .then((response) => response.json())
            .then((data) => {
                const errText = data.error || data.message;
                if (data.status !== "success") {
                    setServerError(errText || "Failed to update customer");
                } else {
                    setSuccess(true);
                    setServerError("");
                    setTimeout(() => {
                        navigate(`/admin/customers/${customerId}`);
                    }, 2000);
                }
            })
            .catch((error) => {
                setServerError(error.message || "Failed to update customer");
            });
    };

    return (
        <section className="contact-section">
            <div className="auto-container">
                <div className="contact-title">
                    <h2>Edit Customer</h2>
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
                                                    Customer updated successfully!
                                                </div>
                                            )}
                                            <h6>Customer Email</h6>
                                            <input
                                                type="email"
                                                name="customer_email"
                                                value={customer_email}
                                                readOnly
                                                disabled
                                                style={{ backgroundColor: "#f5f5f5" }}
                                            />
                                        </div>
                                        <div className="form-group col-md-12">
                                            <h6>First Name</h6>
                                            <input
                                                type="text"
                                                name="customer_first_name"
                                                value={customer_first_name}
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
                                                name="customer_last_name"
                                                value={customer_last_name}
                                                onChange={(event) => setLastName(event.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group col-md-12">
                                            <h6>Phone Number</h6>
                                            <input
                                                type="text"
                                                name="customer_phone_number"
                                                value={customer_phone_number}
                                                onChange={(event) => setPhoneNumber(event.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group col-md-12">
                                            <h6>Active Status</h6>
                                            <div style={{ display: "flex", alignItems: "center", height: "50px" }}>
                                                <input
                                                    type="checkbox"
                                                    name="active_customer_status"
                                                    id="active_customer_status"
                                                    checked={active_customer_status === 1} // Evaluates to true if 1, false if 0
                                                    onChange={(event) => setActiveCustomerStatus(event.target.checked ? 1 : 0)}
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        cursor: "pointer",
                                                        marginRight: "10px"
                                                    }}
                                                />
                                                <label
                                                    htmlFor="active_customer_status"
                                                    style={{ cursor: "pointer", margin: 0, userSelect: "none" }}
                                                >
                                                    {active_customer_status === 1 ? "Active" : "Inactive"}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-12 mt-3">
                                            <button
                                                className="theme-btn btn-style-one"
                                                type="submit"
                                                data-loading-text="Please wait..."
                                            >
                                                <span>UPDATE CUSTOMER</span>
                                            </button>
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

export default EditCustomer;
