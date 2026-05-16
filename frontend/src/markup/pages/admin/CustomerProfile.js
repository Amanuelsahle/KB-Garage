import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import VehicleList from "../../components/Admin/Vehicles/VehicleList";
import AddVehicles from "../../components/Admin/Vehicles/AddVehicles";
import customerService from "../../../services/customer.service";
import { useNavigate } from "react-router-dom";

function CustomerProfile() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const loadProfile = useCallback(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    Promise.all([
      customerService.getCustomerById(customerId),
      customerService.getCustomerVehicles(customerId),
    ])
      .then(async ([cRes, vRes]) => {
        const cData = await cRes.json().catch(() => ({}));
        const vData = await vRes.json().catch(() => ({}));
        if (!cRes.ok) {
          setCustomer(null);
          setVehicles([]);
          setLoadError(
            cData.error || cData.message || "Could not load customer.",
          );
          return;
        }
        setCustomer(cData.data || null);
        if (!vRes.ok) {
          setVehicles([]);
        } else {
          setVehicles(Array.isArray(vData.data) ? vData.data : []);
        }
        setLoadError(null);
      })
      .catch(() => {
        setLoadError("Something went wrong. Please try again.");
        setCustomer(null);
        setVehicles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [customerId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const firstName = customer?.customer_first_name || "";
  const lastName = customer?.customer_last_name || "";
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Customer";
  const activeLabel =
    Number(customer?.active_customer_status) === 1 ? "Yes" : "No";

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <div className="inner-padding customer-profile-page">
            <p className="mb-4">
              <Link
                to="/admin/customers"
                className="customer-profile-back-link"
              >
                ← Back to customers
              </Link>
            </p>

            {loading && (
              <p className="text-muted" role="status">
                Loading customer…
              </p>
            )}

            {!loading && loadError && (
              <div className="alert alert-danger" role="alert">
                {loadError}
              </div>
            )}

            {!loading && customer && !loadError && (
              <div className="customer-profile-timeline">
                <article className="customer-profile-node">
                  <div className="customer-profile-badge" aria-hidden="true">
                    Info
                  </div>
                  <div className="customer-profile-node-body">
                    <h2 className="customer-profile-customer-title">
                      Customer: {fullName}
                    </h2>
                    <ul className="list-unstyled customer-profile-info-list">
                      <li>
                        <span className="customer-profile-label">Email:</span>{" "}
                        {customer.customer_email}
                      </li>
                      <li>
                        <span className="customer-profile-label">
                          Phone Number:
                        </span>{" "}
                        {customer.customer_phone_number}
                      </li>
                      <li>
                        <span className="customer-profile-label">
                          Active Customer:
                        </span>{" "}
                        {activeLabel}
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="btn btn-link customer-profile-edit-link p-0 text-decoration-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/customer/edit/${customer.customer_id}`);
                      }}
                    >
                      Edit customer info{" "}
                      <i className="fas fa-edit" aria-hidden="true" />
                    </button>
                  </div>
                </article>

                <article className="customer-profile-node">
                  <div className="customer-profile-badge" aria-hidden="true">
                    Cars
                  </div>
                  <div className="customer-profile-node-body">
                    <h3 className="customer-profile-section-title">
                      Vehicles of {firstName || fullName}
                    </h3>
                    <VehicleList vehicles={vehicles} />
                    <button
                      type="button"
                      className="theme-btn btn-style-one mt-3"
                      onClick={() => setShowAddVehicle(true)}
                    >
                      <span>ADD NEW VEHICLE</span>
                    </button>
                  </div>
                </article>
                {showAddVehicle && customer && !loading && (
                  <AddVehicles
                    customerId={customerId}
                    onClose={() => setShowAddVehicle(false)}
                    onVehicleAdded={() => {
                      loadProfile();
                      setShowAddVehicle(false);
                    }}
                  />
                )}
                <article className="customer-profile-node customer-profile-node-last">
                  <div className="customer-profile-badge" aria-hidden="true">
                    Orders
                  </div>
                  <div className="customer-profile-node-body">
                    <h3 className="customer-profile-section-title">
                      Orders of {firstName || fullName}
                    </h3>
                    <div className="vehicles-wrapper inner-padding">
                      <p className="text-muted mb-0">
                        Orders will be displayed here
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
