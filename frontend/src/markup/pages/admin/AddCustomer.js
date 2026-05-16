import React from 'react';
import AddCustomerForm from '../../components/Admin/AddCustomer/AddCustomerForm';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';

function AddCustomer() {
    return (
        <div className="container-fluid admin-pages">
            <div className="row">
                <div className="col-md-3 admin-left-side">
                    <AdminMenu />
                </div>
                <div className="col-md-9 admin-right-side">
                    <AddCustomerForm />
                </div>
            </div>
        </div>
    );
}

export default AddCustomer;