// Import react
import React from "react";
// Import the Routes and Route components from react-router
import { Routes, Route } from "react-router";
// Import the page components
import Home from "./markup/pages/Home";
import Login from "./markup/pages/Login";
import AddEmployee from "./markup/pages/admin/AddEmployee";
import Unauthorized from "./markup/pages/Unauthorized";
// Import the Orders and Customers components
import Orders from "./markup/pages/admin/Orders";
import NewOrder from "./markup/pages/admin/NewOrder";
import Customers from "./markup/pages/admin/Customers";
// Import the Employees component
import Employees from "./markup/pages/admin/Employees";

// Import the css files
import "./assets/template_assets/css/bootstrap.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/responsive.css";
import "./assets/template_assets/css/color.css";

// Import the custom css file
import "./assets/styles/custom.css";

// Import the Header component
import Header from "./markup/components/Header/Header";
// Import the Footer component
import Footer from "./markup/components/Footer/Footer";

// Import the PrivateAuthRoute component
import PrivateAuthRoute from "./markup/components/Auth/PrivateAuthRoute";
// Import the Add Customer component
import AddCustomer from "./markup/pages/admin/AddCustomer";
// Import the Services component
import Services from "./markup/pages/admin/Services";
// Import the Customer profile page
import CustomerProfile from "./markup/pages/admin/CustomerProfile";
// Import the Customer Editor page
import CustomerEditor from "./markup/pages/admin/CustomerEditor";
// Import the Employee Editor page
import EmployeeEditor from "./markup/pages/admin/EmployeeEditor";
// Import the dashboard page
import Dashboard from "./markup/pages/admin/Dashboard";
// Import the about page
import About from "./markup/pages/About";
// Import the contact page
import Contact from "./markup/pages/Contact";
// Import the services page
import ServicesPage from "./markup/pages/ServicesPage";
// Import the single service page
import SingleService from "./markup/pages/SingleService";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<SingleService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* // Add the Dashboard Route  */}
        <Route
          path="/admin"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Dashboard />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Orders Route  */}
        <Route
          path="/admin/orders"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Orders />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/order"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <NewOrder />
            </PrivateAuthRoute>
          }
        />
        {/* Customer profile — register before the customers list route */}
        <Route
          path="/admin/customers/:customerId"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <CustomerProfile />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Customers Route  */}
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Employees Route  */}
        <Route path="/admin/employees" element={<Employees />} />
        <Route
          path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddEmployee />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <PrivateAuthRoute roles={[3, 2]}>
              <AddCustomer />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Edit Customer Route  */}
        <Route
          path="/admin/customer/edit/:customerId"
          element={
            <PrivateAuthRoute roles={[3, 2]}>
              <CustomerEditor />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Edit Employee Route  */}
        <Route
          path="/admin/employee/edit/:employeeId"
          element={
            <PrivateAuthRoute roles={[3, 2]}>
              <EmployeeEditor />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Services Route  */}
        <Route
          path="/admin/services"
          element={
            <PrivateAuthRoute roles={[3, 2]}>
              <Services />
            </PrivateAuthRoute>
          }
        />
        {/* 
          Customers (/admin/customers) - managers and admins
          Add customer (/admin/add-customer) - managers and admins
          Orders (/admin/orders) - Can be accessed by all employees
          Add employee (/admin/add-employee) - admins only 
            - Admin: 3 
            - Manager: 2 
            - Employee: 1 
        */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
