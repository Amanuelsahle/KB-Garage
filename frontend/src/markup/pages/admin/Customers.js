import React from "react";
// Import the admin menu component
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
// Import the CustomerList component
import CustomerList from "../../components/Admin/CustomerList/CustomerList";
const Customers = () => {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <CustomerList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
