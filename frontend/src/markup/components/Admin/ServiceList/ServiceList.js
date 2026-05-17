import React, { useState, useEffect, useCallback } from "react";
import serviceService from "../../../../services/service.service";
import { Spinner } from "react-bootstrap";

function ServiceList({ listVersion = 0 }) {
  const [services, setServices] = useState([]);
  const [listError, setListError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(() => {
    setLoading(true);
    serviceService
      .getAllServices()
      .then((res) => {
        if (!res.ok) {
          setListError("Could not load services. Please try again later.");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setServices(data.data);
          setListError(null);
        } else {
          setServices([]);
        }
      })
      .catch(() => {
        setListError("Could not load services. Please try again later.");
        setServices([]);
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices, listVersion]);
  return (
    <div>
      <div className="sec-title services-admin-sec-title">
        <h2>Services we provide</h2>
      </div>
      <p className="services-admin-intro-text">
        Below you will find a list of all the services currently available at
        the garage. Use the form at the bottom of the page to add a new service.
      </p>
      {loading ? (
        <div className="text-center py-5">
          <span className="visually-hidden">Loading...</span>
          <Spinner animation="border" role="status" style={{ color: "blue" }} />
        </div>
      ) : ("")}
      {listError && (
        <p className="text-danger mb-3" role="alert">
          {listError}
        </p>
      )}
      <div className="services-wrapper">
        {services.length === 0 && !listError ? (
          <p className="text-muted">No services added yet.</p>
        ) : (
          services.map((s) => (
            <div className="service-item clearfix" key={s.service_id}>
              <div className="edit-delete">
                <span
                  className="text-danger"
                  title="Edit"
                  aria-label="Edit (coming soon)"
                >
                  <i className="fas fa-edit" aria-hidden="true" />
                </span>
                <span title="Delete" aria-label="Delete (coming soon)">
                  <i className="fas fa-trash-alt" aria-hidden="true" />
                </span>
              </div>
              <h3>{s.service_name}</h3>
              <p className="text">{s.service_description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ServiceList;
