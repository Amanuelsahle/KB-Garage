import React, { useState, useEffect, useRef } from "react";
import serviceService from "../../../../services/service.service";

const LIST_REFRESH_DELAY_MS = 2000;

function AddService({ onServiceAdded }) {
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current != null) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);
  const [service_name, setServiceName] = useState("");
  const [service_description, setServiceDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    if (!service_name.trim()) {
      setNameError("Service name is required");
      valid = false;
    } else {
      setNameError("");
    }
    if (!service_description.trim()) {
      setDescriptionError("Service description is required");
      valid = false;
    } else {
      setDescriptionError("");
    }
    if (!valid) {
      setServerError("");
      return;
    }
    setServerError("");
    const formData = {
      service_name: service_name.trim(),
      service_description: service_description.trim(),
    };
    serviceService
      .addService(formData)
      .then((response) => response.json())
      .then((data) => {
        const errText = data.error || data.message;
        if (errText) {
          setServerError(errText);
          setSuccess(false);
        } else {
          setSuccess(true);
          setServiceName("");
          setServiceDescription("");
          if (typeof onServiceAdded === "function") {
            if (refreshTimerRef.current != null) {
              clearTimeout(refreshTimerRef.current);
            }
            refreshTimerRef.current = setTimeout(() => {
              refreshTimerRef.current = null;
              onServiceAdded();
            }, LIST_REFRESH_DELAY_MS);
          }
        }
      })
      .catch((error) => {
        setServerError(error.message || error.toString());
        setSuccess(false);
      });
  };

  return (
    <section className="contact-section services-add-service-section">
      <div className="auto-container">
        <div className="external-container add-service-form-card inner-padding">
          <div className="contact-title">
            <h2>Add a new service</h2>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              {serverError && (
                <div className="validation-error mb-3" role="alert">
                  {serverError}
                </div>
              )}
              {success && (
                <div className="text-success mb-3" role="status">
                  Service added successfully.
                </div>
              )}
              <div className="form-group">
                <input
                  type="text"
                  name="service_name"
                  value={service_name}
                  onChange={(e) => {
                    setServiceName(e.target.value);
                    setNameError("");
                    setServerError("");
                  }}
                  placeholder="Service name"
                  autoComplete="off"
                />
                {nameError && (
                  <div className="validation-error mt-1" role="alert">
                    {nameError}
                  </div>
                )}
              </div>
              <div className="form-group">
                <textarea
                  name="service_description"
                  value={service_description}
                  onChange={(e) => {
                    setServiceDescription(e.target.value);
                    setDescriptionError("");
                    setServerError("");
                  }}
                  placeholder="Service description"
                  rows={6}
                />
                {descriptionError && (
                  <div className="validation-error mt-1" role="alert">
                    {descriptionError}
                  </div>
                )}
              </div>
              <div className="form-group">
                <button
                  className="theme-btn btn-style-one"
                  type="submit"
                  data-loading-text="Please wait..."
                >
                  <span>ADD SERVICE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddService;
