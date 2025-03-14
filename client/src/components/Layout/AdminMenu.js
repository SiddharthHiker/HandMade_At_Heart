import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/adminMenu.css"; // Custom CSS for additional styling

const AdminMenu = () => {
  return (
    <div className="admin-menu">
      <div className="text-center">
        <div className="list-group">
          <h4 className="admin-menu-title">Admin Panel</h4>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action admin-menu-item"
            activeClassName="active"
          >
            <i className="fas fa-plus-circle me-2"></i>
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action admin-menu-item"
            activeClassName="active"
          >
            <i className="fas fa-box me-2"></i>
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/product"
            className="list-group-item list-group-item-action admin-menu-item"
            activeClassName="active"
          >
            <i className="fas fa-shopping-bag me-2"></i>
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action admin-menu-item"
            activeClassName="active"
          >
            <i className="fas fa-users me-2"></i>
            Users
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;