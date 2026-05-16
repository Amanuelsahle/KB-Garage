import React, { useState } from "react";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import AddService from "../../components/Admin/AddService/AddService";
import ServiceList from "../../components/Admin/ServiceList/ServiceList";

function Services() {
  const [listVersion, setListVersion] = useState(0);

  return (
    <div className="container-fluid admin-pages">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <div className="services-admin-page inner-padding">
            <ServiceList listVersion={listVersion} />
          </div>
          <AddService
            onServiceAdded={() => setListVersion((v) => v + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default Services;
