import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminMenu.css";

function AdminMenu(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div className="admin-menu">
        <button className="admin-menu-toggle d-md-none" onClick={toggleMenu}>
          <span className="toggle-icon">☰</span>
          <span className="toggle-text">Admin Menu</span>
        </button>
        <h2>Admin Menu</h2>
      </div>
      <div className={`list-group admin-menu-list ${isOpen ? "open" : ""}`}>
        <Link to="/admin" className="list-group-item" onClick={closeMenu}>
          Dashboard
        </Link>
        <Link
          to="/admin/orders"
          className="list-group-item"
          onClick={closeMenu}
        >
          Orders
        </Link>
        <Link to="/admin/order" className="list-group-item" onClick={closeMenu}>
          New order
        </Link>
        <Link
          to="/admin/add-employee"
          className="list-group-item"
          onClick={closeMenu}
        >
          Add employee
        </Link>
        <Link
          to="/admin/employees"
          className="list-group-item"
          onClick={closeMenu}
        >
          Employees
        </Link>
        <Link
          to="/admin/add-customer"
          className="list-group-item"
          onClick={closeMenu}
        >
          Add customer
        </Link>
        <Link
          to="/admin/customers"
          className="list-group-item"
          onClick={closeMenu}
        >
          Customers
        </Link>
        <Link
          to="/admin/services"
          className="list-group-item"
          onClick={closeMenu}
        >
          Services
        </Link>
      </div>
    </div>
  );
}

export default AdminMenu;
