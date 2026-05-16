import React, { useState } from "react";
import customerService from "../../../../services/customer.service";

const initialForm = {
  vehicle_year: "",
  vehicle_make: "",
  vehicle_model: "",
  vehicle_type: "",
  vehicle_mileage: "",
  vehicle_tag: "",
  vehicle_serial: "",
  vehicle_color: "",
};

function AddVehicles({ customerId, onClose, onVehicleAdded }) {
  const [form, setForm] = useState(initialForm);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");
    setSubmitting(true);
    customerService
      .addCustomerVehicle(customerId, {
        vehicle_year: form.vehicle_year,
        vehicle_make: form.vehicle_make,
        vehicle_model: form.vehicle_model,
        vehicle_type: form.vehicle_type,
        vehicle_mileage: form.vehicle_mileage,
        vehicle_tag: form.vehicle_tag,
        vehicle_serial: form.vehicle_serial,
        vehicle_color: form.vehicle_color,
      })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setServerError(data.error || data.message || "Could not add vehicle");
          return;
        }
        setForm(initialForm);
        if (typeof onVehicleAdded === "function") {
          onVehicleAdded();
        }
      })
      .catch(() => {
        setServerError("Could not add vehicle. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section className="contact-section customer-profile-add-vehicle-section">
      <div className="auto-container">
        <div className="external-container add-vehicle-form-card inner-padding">
          <div
            className="form-close"
            role="button"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
            aria-label="Close add vehicle form"
          >
            &times;
          </div>
          <div className="contact-title">
            <h2>Add a new vehicle</h2>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              {serverError && (
                <div className="validation-error mb-3" role="alert">
                  {serverError}
                </div>
              )}
              <div className="form-group">
                <input
                  type="number"
                  name="vehicle_year"
                  value={form.vehicle_year}
                  onChange={(e) => setField("vehicle_year", e.target.value)}
                  placeholder="Vehicle year"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="vehicle_make"
                  value={form.vehicle_make}
                  onChange={(e) => setField("vehicle_make", e.target.value)}
                  placeholder="Vehicle make"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="vehicle_model"
                  value={form.vehicle_model}
                  onChange={(e) => setField("vehicle_model", e.target.value)}
                  placeholder="Vehicle model"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={(e) => setField("vehicle_type", e.target.value)}
                  placeholder="Vehicle type"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="vehicle_mileage"
                  value={form.vehicle_mileage}
                  onChange={(e) => setField("vehicle_mileage", e.target.value)}
                  placeholder="Vehicle mileage"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="vehicle_tag"
                  value={form.vehicle_tag}
                  onChange={(e) => setField("vehicle_tag", e.target.value)}
                  placeholder="Vehicle tag"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="vehicle_serial"
                  value={form.vehicle_serial}
                  onChange={(e) => setField("vehicle_serial", e.target.value)}
                  placeholder="Vehicle serial"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="vehicle_color"
                  value={form.vehicle_color}
                  onChange={(e) => setField("vehicle_color", e.target.value)}
                  placeholder="Vehicle color"
                  required
                />
              </div>
              <div className="form-group">
                <button
                  className="theme-btn btn-style-one"
                  type="submit"
                  disabled={submitting}
                  data-loading-text="Please wait..."
                >
                  <span>{submitting ? "PLEASE WAIT..." : "ADD VEHICLE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddVehicles;
