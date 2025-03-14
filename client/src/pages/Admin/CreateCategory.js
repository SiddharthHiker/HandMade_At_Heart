import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal, Spin, Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // Fetch all categories
  const getAllCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Create Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/category/create-category`,
        { name }
      );
      if (data.success) {
        toast.success(`${name} created successfully`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  // Handle Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedName.trim()) {
      toast.error("Updated name is required");
      return;
    }
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} updated successfully`);
        setVisible(false);
        setSelected(null);
        setUpdatedName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  // Handle Delete Category
  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/category/delete-category/${categoryId}`
      );
      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setVisible(true);
              setUpdatedName(record.name);
              setSelected(record);
            }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout title="Dashboard - Manage Categories">
      <div className="container-fluid p-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Manage Categories</h4>
              </div>
              <div className="card-body">
                {/* Create Category Form */}
                <div className="mb-4">
                  <CategoryForm
                    handleSubmit={handleSubmit}
                    value={name}
                    setValue={setName}
                  />
                </div>

                {/* Category List */}
                {loading ? (
                  <Spin size="large" className="d-block mx-auto my-3" />
                ) : (
                  <Table
                    dataSource={categories}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    locale={{
                      emptyText: (
                        <span className="text-muted">No categories found</span>
                      ),
                    }}
                  />
                )}
              </div>
            </div>

            {/* Edit Modal */}
            <Modal
              title="Edit Category"
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;