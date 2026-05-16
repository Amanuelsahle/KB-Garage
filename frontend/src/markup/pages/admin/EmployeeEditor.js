import React from 'react';
import EditEmployee from '../../components/Admin/EditEmployee/EditEmployee';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';

function EmployeeEditor() {
    return (
        <div className="container-fluid admin-pages">
            <div className="row">
                <div className="col-md-3 admin-left-side">
                    <AdminMenu />
                </div>
                <div className="col-md-9 admin-right-side">
                    <EditEmployee />
                </div>
            </div>
        </div>
    );
}

export default EmployeeEditor;