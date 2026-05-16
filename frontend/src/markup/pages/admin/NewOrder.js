import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Table } from "react-bootstrap";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import customerService from "../../../services/customer.service";
import serviceService from "../../../services/service.service";
import orderService from "../../../services/order.service";
import { useAuth } from "../../../Contexts/AuthContext";
import { getStoredEmployeeToken } from "../../../util/auth";

const SEARCH_PLACEHOLDER =
  "Search for a customer using first name, last name, email address of phone number";

function customerMatchesQuery(customer, queryLower) {
  if (!queryLower) return true;
  const parts = [
    customer.customer_first_name,
    customer.customer_last_name,
    customer.customer_email,
    customer.customer_phone_number,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase());
  return parts.some((p) => p.includes(queryLower));
}

function NewOrder() {
  const navigate = useNavigate();
  const { employee } = useAuth();
  const contextToken =
    typeof employee?.employee_token === "string"
      ? employee.employee_token.trim()
      : "";
  const token = contextToken || getStoredEmployeeToken();

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customersError, setCustomersError] = useState(null);
  const [customersLoaded, setCustomersLoaded] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState({});
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const employeeIdRaw = employee?.employee_id;
  const employeeId =
    employeeIdRaw != null && String(employeeIdRaw).trim() !== ""
      ? Number(employeeIdRaw)
      : null;
  const hasEmployeeSession =
    Number.isFinite(employeeId) && employeeId >= 1;

  useEffect(() => {
    if (!token) {
      setCustomersError("Please log in to create an order.");
      setCustomersLoaded(true);
      return;
    }
    setCustomersLoaded(false);
    customerService
      .getAllCustomers(token)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setCustomersError(
            data.message || data.error || "Could not load customers.",
          );
          setCustomers([]);
          return;
        }
        setCustomers(Array.isArray(data.data) ? data.data : []);
        setCustomersError(null);
      })
      .catch(() => {
        setCustomersError("Could not load customers.");
        setCustomers([]);
      })
      .finally(() => setCustomersLoaded(true));
  }, [token]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return customers.filter((c) => customerMatchesQuery(c, q));
  }, [customers, searchQuery]);

  const loadVehicles = useCallback((customerId) => {
    setVehiclesLoading(true);
    customerService
      .getCustomerVehicles(customerId)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setVehicles([]);
          return;
        }
        setVehicles(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => setVehicles([]))
      .finally(() => setVehiclesLoading(false));
  }, []);

  const loadServices = useCallback(() => {
    setServicesLoading(true);
    serviceService
      .getAllServices()
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setServices([]);
          return;
        }
        setServices(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, []);

  const selectCustomer = (c) => {
    setSelectedCustomer(c);
    setSelectedVehicle(null);
    setSelectedServiceIds({});
    setAdditionalRequest("");
    setOrderPrice("");
    setSubmitError("");
    setStep(2);
    loadVehicles(c.customer_id);
  };

  const selectVehicle = (v) => {
    setSelectedVehicle(v);
    setSelectedServiceIds({});
    setAdditionalRequest("");
    setOrderPrice("");
    setSubmitError("");
    setStep(3);
    loadServices();
  };

  const clearCustomer = () => {
    setSelectedCustomer(null);
    setSelectedVehicle(null);
    setVehicles([]);
    setServices([]);
    setSelectedServiceIds({});
    setStep(1);
  };

  const clearVehicle = () => {
    setSelectedVehicle(null);
    setSelectedServiceIds({});
    setSubmitError("");
    setStep(2);
  };

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!hasEmployeeSession) {
      setSubmitError("Employee session is missing. Please log in again.");
      return;
    }
    const ids = Object.keys(selectedServiceIds)
      .filter((k) => selectedServiceIds[k])
      .map((k) => parseInt(k, 10));
    if (ids.length === 0) {
      setSubmitError("Select at least one service.");
      return;
    }
    const priceNum = parseInt(orderPrice, 10);
    const order_total_price =
      Number.isFinite(priceNum) && priceNum >= 0 ? priceNum : 0;
    setSubmitting(true);
    orderService
      .createOrder({
        employee_id: employeeId,
        customer_id: selectedCustomer.customer_id,
        vehicle_id: selectedVehicle.vehicle_id,
        service_ids: ids,
        additional_request: additionalRequest,
        order_total_price,
        notes_for_internal_use: "",
        notes_for_customer: "",
      })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setSubmitError(
            data.error || data.message || "Could not create order.",
          );
          return;
        }
        navigate("/admin/orders");
      })
      .catch(() => setSubmitError("Could not create order."))
      .finally(() => setSubmitting(false));
  };

  const activeLabel =
    selectedCustomer &&
    Number(
      selectedCustomer.active_customer_status ?? selectedCustomer.active,
    ) === 1
      ? "Yes"
      : "No";

  const customerFullName = selectedCustomer
    ? [selectedCustomer.customer_first_name, selectedCustomer.customer_last_name]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <section className="contact-section new-order-section">
            <div className="auto-container inner-padding">
              <div className="contact-title">
                <h2>Create a new order</h2>
              </div>

              {step >= 2 && selectedCustomer && (
                <div className="external-container selected-customer mb-4">
                  <div
                    className="form-close"
                    role="button"
                    tabIndex={0}
                    onClick={clearCustomer}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        clearCustomer();
                      }
                    }}
                    aria-label="Remove customer from order"
                  >
                    &times;
                  </div>
                  <h3>{customerFullName}</h3>
                  <div className="text">
                    <p>
                      <span>Email: </span>
                      {selectedCustomer.customer_email}
                    </p>
                    <p>
                      <span>Phone Number: </span>
                      {selectedCustomer.customer_phone_number}
                    </p>
                    <p>
                      <span>Active Customer: </span>
                      {activeLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger text-decoration-none"
                    onClick={() => {}}
                  >
                    Edit customer info.{" "}
                    <i className="fas fa-edit" aria-hidden="true" />
                  </button>
                </div>
              )}

              {step === 1 && (
                <>
                  <Form.Group className="mb-3 new-order-search-wrap">
                    <Form.Control
                      type="search"
                      placeholder={SEARCH_PLACEHOLDER}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search customers"
                      disabled={!customersLoaded || !!customersError}
                    />
                    <span
                      className="new-order-search-icon"
                      aria-hidden="true"
                    >
                      <i className="fas fa-search" />
                    </span>
                  </Form.Group>
                  <div className="mb-4">
                    <Link
                      to="/admin/add-customer"
                      className="theme-btn btn-style-one d-inline-block"
                    >
                      <span>ADD NEW CUSTOMER</span>
                    </Link>
                  </div>
                  {!customersLoaded && (
                    <p className="text-muted">Loading customers…</p>
                  )}
                  {customersError && (
                    <div className="alert alert-danger" role="alert">
                      {customersError}
                    </div>
                  )}
                  {customersLoaded && !customersError && (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center text-muted py-4"
                            >
                              {customers.length === 0
                                ? "No customers found."
                                : "No customers match your search."}
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((c) => (
                            <tr key={c.customer_id}>
                              <td>{c.customer_first_name}</td>
                              <td>{c.customer_last_name}</td>
                              <td>{c.customer_email}</td>
                              <td>{c.customer_phone_number}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  title="Select customer"
                                  aria-label={`Select ${c.customer_first_name} ${c.customer_last_name}`}
                                  onClick={() => selectCustomer(c)}
                                >
                                  <i
                                    className="fas fa-hand-pointer"
                                    aria-hidden="true"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  )}
                </>
              )}

              {step === 2 && selectedCustomer && (
                <div className="vehicles-to-choose">
                  <h3 className="sec-title mb-3">Choose a vehicle</h3>
                  {vehiclesLoading && (
                    <p className="text-muted">Loading vehicles…</p>
                  )}
                  {!vehiclesLoading && vehicles.length === 0 && (
                    <div className="alert alert-light border" role="status">
                      No vehicles for this customer.{" "}
                      <Link
                        to={`/admin/customers/${selectedCustomer.customer_id}`}
                      >
                        Add a vehicle on the customer profile
                      </Link>
                      .
                    </div>
                  )}
                  {!vehiclesLoading && vehicles.length > 0 && (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Make</th>
                          <th>Model</th>
                          <th>Tag</th>
                          <th>Serial</th>
                          <th>Color</th>
                          <th>Mileage</th>
                          <th>Choose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((v) => (
                          <tr key={v.vehicle_id}>
                            <td>{v.vehicle_year}</td>
                            <td>{v.vehicle_make}</td>
                            <td>{v.vehicle_model}</td>
                            <td>{v.vehicle_tag}</td>
                            <td>{v.vehicle_serial}</td>
                            <td>{v.vehicle_color}</td>
                            <td>{v.vehicle_mileage}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-link p-0"
                                title="Select vehicle"
                                aria-label={`Select ${v.vehicle_make} ${v.vehicle_model}`}
                                onClick={() => selectVehicle(v)}
                              >
                                <i
                                  className="fas fa-hand-pointer"
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              )}

              {step === 3 && selectedCustomer && selectedVehicle && (
                <>
                  <div className="external-container selected-customer mb-4">
                    <div
                      className="form-close"
                      role="button"
                      tabIndex={0}
                      onClick={clearVehicle}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          clearVehicle();
                        }
                      }}
                      aria-label="Remove vehicle from order"
                    >
                      &times;
                    </div>
                    <h3>
                      {selectedVehicle.vehicle_make}{" "}
                      {selectedVehicle.vehicle_model}
                    </h3>
                    <div className="text">
                      <p>
                        <span>Vehicle color: </span>
                        {selectedVehicle.vehicle_color}
                      </p>
                      <p>
                        <span>Vehicle tag: </span>
                        {selectedVehicle.vehicle_tag}
                      </p>
                      <p>
                        <span>Vehicle year: </span>
                        {selectedVehicle.vehicle_year}
                      </p>
                      <p>
                        <span>Vehicle mileage: </span>
                        {selectedVehicle.vehicle_mileage}
                      </p>
                      <p>
                        <span>Vehicle serial: </span>
                        {selectedVehicle.vehicle_serial}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-danger text-decoration-none"
                      onClick={() => {}}
                    >
                      Edit vehicle info{" "}
                      <i className="fas fa-edit" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="sec-title mb-3">
                    <h3>Choose service</h3>
                  </div>
                  {servicesLoading && (
                    <p className="text-muted">Loading services…</p>
                  )}
                  {!servicesLoading && services.length === 0 && (
                    <p className="text-muted mb-4">
                      No services available. Add services under Admin → Services.
                    </p>
                  )}
                  <div className="services-wrapper mb-4">
                    {!servicesLoading &&
                      services.map((s) => (
                        <div
                          className="service-item checkbox-holder clearfix"
                          key={s.service_id}
                        >
                          <label className="d-flex align-items-start justify-content-between gap-3 w-100 mb-0">
                            <span>
                              <strong>{s.service_name}</strong>
                              {s.service_description && (
                                <span className="d-block text-muted small mt-1">
                                  {s.service_description}
                                </span>
                              )}
                            </span>
                            <input
                              type="checkbox"
                              checked={!!selectedServiceIds[s.service_id]}
                              onChange={() => toggleService(s.service_id)}
                              aria-label={s.service_name}
                            />
                          </label>
                        </div>
                      ))}
                  </div>

                  <form onSubmit={handleSubmitOrder}>
                    <div className="contact-title mb-3">
                      <h3>Additional requests</h3>
                    </div>
                    {submitError && (
                      <div className="validation-error mb-3" role="alert">
                        {submitError}
                      </div>
                    )}
                    <div className="form-group">
                      <textarea
                        rows={5}
                        className="form-control"
                        placeholder="Service description"
                        value={additionalRequest}
                        onChange={(e) => setAdditionalRequest(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Price"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="theme-btn btn-style-one"
                        disabled={!hasEmployeeSession || submitting}
                        data-loading-text="Please wait..."
                      >
                        <span>
                          {submitting ? "PLEASE WAIT..." : "SUBMIT ORDER"}
                        </span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default NewOrder;
