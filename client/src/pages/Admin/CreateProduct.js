import React, { useState, useEffect, useCallback } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API;

  // Get all categories
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting category");
    }
  }, [API_URL]);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.post(
        `${API_URL}/api/v1/product/create-product`,
        productData
      );

      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/product");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Something went wrong while creating the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Create Product</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    {/* Category Selection */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <Select
                        variant="outlined"  
                        placeholder="Select a category"
                        size="large"
                        showSearch
                        className="w-100"
                        onChange={(value) => setCategory(value)}
                      >
                        {categories?.map((c) => (
                          <Option key={c._id} value={c._id}>
                            {c.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-3">
                      <label className="form-label">Product Image</label>
                      <div className="border rounded p-3 text-center">
                        <label className="btn btn-outline-primary w-100">
                          {photo ? photo.name : "Upload Photo"}
                          <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            hidden
                          />
                        </label>
                      </div>
                    </div>

                    {/* Preview Image */}
                    {photo && (
                      <div className="mb-3 text-center">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="product_photo"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    {/* Product Fields */}
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        value={name}
                        placeholder="Enter product name"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        value={description}
                        placeholder="Enter product description"
                        className="form-control"
                        rows="3"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          value={price}
                          placeholder="Enter product price"
                          className="form-control"
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          value={quantity}
                          placeholder="Enter product quantity"
                          className="form-control"
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Shipping Selection */}
                    <div className="mb-3">
                      <label className="form-label">Shipping</label>
                      <Select
                        variant="outlined"  
                        placeholder="Select Shipping"
                        size="large"
                        showSearch
                        className="w-100"
                        onChange={(value) => setShipping(value)}
                      >
                        <Option value="0">No</Option>
                        <Option value="1">Yes</Option>
                      </Select>
                    </div>

                    {/* Create Product Button */}
                    <div className="mb-3">
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleCreate}
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "CREATE PRODUCT"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;