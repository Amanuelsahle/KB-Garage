import React from 'react';
import EditCustomer from '../../components/Admin/EditCustomer/EditCustomer';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';

function CustomerEditor() {
    return (
        <div className="container-fluid admin-pages">
            <div className="row">
                <div className="col-md-3 admin-left-side">
                    <AdminMenu />
                </div>
                <div className="col-md-9 admin-right-side">
                    <EditCustomer />
                </div>
            </div>
        </div>
    );
}

export default CustomerEditor;
