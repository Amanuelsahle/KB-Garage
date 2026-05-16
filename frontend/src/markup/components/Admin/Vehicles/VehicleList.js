import React from "react";

function VehicleList({ vehicles }) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="vehicles-wrapper inner-padding">
        <p className="text-muted mb-0">No vehicle found.</p>
      </div>
    );
  }

  return (
    <div className="vehicles-wrapper inner-padding">
      <ul className="list-unstyled mb-0 customer-vehicle-summary-list">
        {vehicles.map((v) => (
          <li
            key={v.vehicle_id}
            className="py-3 border-bottom customer-vehicle-summary-item"
          >
            <strong>
              {v.vehicle_year} {v.vehicle_make} {v.vehicle_model}
            </strong>
            <span className="text-muted"> — {v.vehicle_color}</span>
            <div className="small text-muted mt-1">
              Type: {v.vehicle_type} · Mileage: {v.vehicle_mileage} · Tag:{" "}
              {v.vehicle_tag} · Serial: {v.vehicle_serial}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VehicleList;
