import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { Table, Spin, message } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/auth/getAll-Users");
      if (data?.success) {
        setUsers(data.users);
      } else {
        message.error(data?.message || "Failed to fetch users");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => address || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span style={{ fontWeight: role === 1 ? "bold" : "normal" }}>
          {role === 1 ? "Admin" : "User"}
        </span>
      ),
      filters: [
        { text: "Admin", value: 1 },
        { text: "User", value: 0 },
      ],
      onFilter: (value, record) => record.role === value,
    },
  ];

  return (
    <Layout title="Dashboard - All Users">
      <div style={{ 
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px"
      }}>
        <div style={{ 
          display: "flex", 
          gap: "20px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <div style={{ 
            flex: "0 0 250px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "15px"
          }}>
            <AdminMenu />
          </div>
          
          <div style={{ 
            flex: 1,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "20px"
          }}>
            <h1 style={{ 
              fontSize: "24px",
              marginBottom: "20px",
              color: "#333",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px"
            }}>
              All Users
            </h1>
            
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                scroll={{ x: true }}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} users`,
                }}
                style={{
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              />
            </Spin>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;