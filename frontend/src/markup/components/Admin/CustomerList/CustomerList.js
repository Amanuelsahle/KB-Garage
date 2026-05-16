import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Form, Button, Modal } from "react-bootstrap";
// Import the auth hook
import { useAuth } from "../../../../Contexts/AuthContext";
// Import the date-fns library
import { format, isValid } from "date-fns"; // To properly format the date on the table
import customerService from "../../../../services/customer.service";
import { getStoredEmployeeToken } from "../../../../util/auth";

const PAGE_SIZE = 10;

const SEARCH_PLACEHOLDER =
  "Search for a customer using first name, last name, email address of phone number";

function formatAddedDate(raw) {
  if (raw == null || raw === "") {
    return "—";
  }
  const d = raw instanceof Date ? raw : new Date(raw);
  return isValid(d) ? format(d, "MM - dd - yyyy | HH:mm") : "—";
}

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

function CustomerList() {
  const navigate = useNavigate();
  // Create all the states we need to store the data
  // Create the customers state to store the customers data
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  // A state to serve as a flag to show the error message
  const [apiError, setApiError] = useState(false);
  // A state to store the error message
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [editActive, setEditActive] = useState("1");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  // To get the logged in employee token
  const { employee } = useAuth();
  const contextToken =
    typeof employee?.employee_token === "string"
      ? employee.employee_token.trim()
      : "";
  const token = contextToken || getStoredEmployeeToken();

  const loadCustomers = useCallback(() => {
    if (!token) {
      return Promise.resolve();
    }
    setApiError(false);
    setApiErrorMessage(null);
    return customerService.getAllCustomers(token).then(async (res) => {
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
        setCustomers([]);
        return;
      }
      if (Array.isArray(data?.data)) {
        setCustomers(data.data);
      }
      console.log(data.data);
    });
  }, [token]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const openEditCustomer = (customer, e) => {
    e.stopPropagation();
    setActionError(null);
    setModalError(null);
    setEditCustomer(customer);
    const active =
      customer.active ?? customer.active_customer_status ?? 0;
    setEditActive(Number(active) === 1 ? "1" : "0");
  };

  const closeCustomerModal = () => {
    if (!saving) setEditCustomer(null);
  };

  const saveCustomerStatus = () => {
    if (!editCustomer || !token) return;
    setSaving(true);
    setModalError(null);
    customerService
      .updateCustomerStatus(
        editCustomer.customer_id,
        Number(editActive),
        token,
      )
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setModalError(data.error || data.message || "Update failed");
          return;
        }
        setCustomers((prev) =>
          prev.map((c) =>
            Number(c.customer_id) === Number(editCustomer.customer_id)
              ? { ...c, active_customer_status: Number(editActive), active: Number(editActive) }
              : c,
          ),
        );
        setEditCustomer(null);
      })
      .catch(() => setModalError("Update failed"))
      .finally(() => setSaving(false));
  };

  const handleDeleteCustomer = (customer, e) => {
    e.stopPropagation();
    if (!token) return;
    const ok = window.confirm(
      `Mark ${customer.customer_first_name} ${customer.customer_last_name} as inactive? They will stay in the list with Active = No.`,
    );
    if (!ok) return;
    setActionError(null);
    customerService.deleteCustomer(customer.customer_id, token).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(data.error || data.message || "Delete failed");
        return;
      }
      setCustomers((prev) =>
        prev.map((c) =>
          Number(c.customer_id) === Number(customer.customer_id)
            ? {
              ...c,
              active_customer_status: 0,
              active: 0,
            }
            : c,
        ),
      );
    });
  };

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => customerMatchesQuery(c, q));
  }, [customers, searchQuery]);

  const lastPageIndex = Math.max(
    0,
    Math.ceil(filteredCustomers.length / PAGE_SIZE) - 1,
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, lastPageIndex));
  }, [lastPageIndex]);

  const pagedCustomers = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredCustomers, currentPage]);

  const showPagination = filteredCustomers.length > PAGE_SIZE;
  const rangeStart =
    filteredCustomers.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const rangeEnd = Math.min(
    (currentPage + 1) * PAGE_SIZE,
    filteredCustomers.length,
  );

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
                <h2>Customers</h2>
              </div>
              {actionError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {actionError}
                </div>
              )}
              <Form.Group className="mb-4" controlId="customerSearch">
                <Form.Control
                  type="search"
                  className="form-control"
                  placeholder={SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search customers"
                />
              </Form.Group>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>

                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Added Date</th>
                    <th>Active</th>
                    <th>Edit/Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
                        {customers.length === 0
                          ? "No customers yet."
                          : "No customers match your search."}
                      </td>
                    </tr>
                  ) : (
                    pagedCustomers.map((customer) => (
                      <tr
                        key={customer.customer_id}


                        className={`customer-table-row-profile-link ${Number(customer.active ?? customer.active_customer_status) === 1
                          ? ""
                          : "table-danger"
                          }`}
                        onClick={() =>
                          navigate(`/admin/customers/${customer.customer_id}`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(
                              `/admin/customers/${customer.customer_id}`,
                            );
                          }
                        }}
                        tabIndex={0}
                        role="link"
                        aria-label={`View profile for ${customer.customer_first_name} ${customer.customer_last_name}`}
                      >
                        <td>{customer.customer_id}</td>
                        <td>{customer.customer_first_name}</td>
                        <td>{customer.customer_last_name}</td>
                        <td>{customer.customer_email}</td>
                        <td>{customer.customer_phone_number}</td>
                        <td>
                          {formatAddedDate(
                            customer.customer_added_date ??
                            customer.added_date,
                          )}
                        </td>
                        <td>
                          {Number(
                            customer.active ??
                            customer.active_customer_status,
                          ) === 1
                            ? "Yes"
                            : "No"}
                        </td>
                        <td
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <div className="admin-row-actions d-flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline-secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/customer/edit/${customer.customer_id}`);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) =>
                                handleDeleteCustomer(customer, e)
                              }
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
              {showPagination && (
                <div className="customer-list-pagination mt-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <span className="text-muted small">
                    Showing {rangeStart}–{rangeEnd} of {filteredCustomers.length}
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      type="button"
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(0)}
                    >
                      First
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      type="button"
                      disabled={currentPage === 0}
                      onClick={() =>
                        setCurrentPage((p) => Math.max(0, p - 1))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      type="button"
                      disabled={currentPage >= lastPageIndex}
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(lastPageIndex, p + 1),
                        )
                      }
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      type="button"
                      disabled={currentPage >= lastPageIndex}
                      onClick={() => setCurrentPage(lastPageIndex)}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <Modal show={!!editCustomer} onHide={closeCustomerModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit customer status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editCustomer && (
                <>
                  <p className="mb-2">
                    <strong>
                      {editCustomer.customer_first_name}{" "}
                      {editCustomer.customer_last_name}
                    </strong>
                    <br />
                    <span className="text-muted small">
                      {editCustomer.customer_email}
                    </span>
                  </p>
                  <Form.Group className="mb-0" controlId="customerActiveStatus">
                    <Form.Label>Active customer</Form.Label>
                    <Form.Select
                      value={editActive}
                      onChange={(e) => setEditActive(e.target.value)}
                      disabled={saving}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </Form.Select>
                  </Form.Group>
                  {modalError && (
                    <p className="text-danger small mt-2 mb-0">{modalError}</p>
                  )}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={closeCustomerModal}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveCustomerStatus}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default CustomerList;
