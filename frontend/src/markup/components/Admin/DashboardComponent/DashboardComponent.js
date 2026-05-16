import React from "react";
import { Link } from "react-router-dom";

function DashboardComponent() {
    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="contact-title">
                        <h2>Admin Dashboard</h2>
                        <div
                            className="text"
                            style={{
                                fontSize: "16px",
                                marginTop: "20px",
                                color: "#777",
                                lineHeight: "1.8",
                            }}
                        >
                            Bring to the table win-win survival strategies to ensure proactive
                            domination. At the end of the day, going forward, a new normal that
                            has evolved from generation X is on the runway heading towards a
                            streamlined cloud solution.
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* All Orders */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>OPEN FOR ALL</h5>
                        <h2>All Orders</h2>
                        <Link to="/admin/orders" className="read-more">
                            LIST OF ORDERS +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-power"></span>
                        </div>
                    </div>
                </div>

                {/* New Orders */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>OPEN FOR LEADS</h5>
                        <h2>New Orders</h2>
                        <Link to="/admin/order" className="read-more">
                            ADD ORDER +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-power"></span>
                        </div>
                    </div>
                </div>

                {/* Employees */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>OPEN FOR ADMINS</h5>
                        <h2>Employees</h2>
                        <Link to="/admin/employees" className="read-more">
                            LIST OF EMPLOYEES +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-gearbox"></span>
                        </div>
                    </div>
                </div>

                {/* Add Employee */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>OPEN FOR ADMINS</h5>
                        <h2>Add Employee</h2>
                        <Link to="/admin/add-employee" className="read-more">
                            READ MORE +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-tire"></span>
                        </div>
                    </div>
                </div>

                {/* Engine Service & Repair */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>SERVICE AND REPAIRS</h5>
                        <h2>Engine Service & Repair</h2>
                        <Link to="/admin/services" className="read-more">
                            READ MORE +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-car-engine"></span>
                        </div>
                    </div>
                </div>

                {/* Tyre & Wheels */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>SERVICE AND REPAIRS</h5>
                        <h2>Tyre & Wheels</h2>
                        <Link to="/admin/services" className="read-more">
                            READ MORE +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-tire"></span>
                        </div>
                    </div>
                </div>

                {/* Denting & Painting */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>SERVICE AND REPAIRS</h5>
                        <h2>Denting & Painting</h2>
                        <Link to="/admin/services" className="read-more">
                            READ MORE +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-spray-gun"></span>
                        </div>
                    </div>
                </div>

                {/* Engine Service & Repair (Repeated) */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>SERVICE AND REPAIRS</h5>
                        <h2>Engine Service & Repair</h2>
                        <Link to="/admin/services" className="read-more">
                            READ MORE +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-car-engine"></span>
                        </div>
                    </div>
                </div>

                {/* Tyre & Wheels (Repeated) */}
                <div className="col-lg-4 col-md-6 service-block-one">
                    <div className="inner-box hvr-float-shadow">
                        <h5>SERVICE AND REPAIRS</h5>
                        <h2>Tyre & Wheels</h2>
                        <Link to="/admin/services" className="read-more">
                            READ MORE +
                        </Link>
                        <div className="icon">
                            <span className="flaticon-tire"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardComponent;
