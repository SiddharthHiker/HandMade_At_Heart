import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/updateProduct.css"; 
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  // Get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/single-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch product details");
    }
  };

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line
  }, []);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/product");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await axios.delete(
        `/api/v1/product/product-delete/${id}`
      );

      if (data?.success) {
        toast.success("Product Deleted Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card shadow-sm p-4">
              <h2 className="text-center mb-4">Update Product</h2>
              <div className="m-1">
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
                    value={category}
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
                <div className="mb-3 text-center">
                  {photo ? (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  ) : (
                    id && (
                      <img
                        src={`/api/v1/product/product-photo/${id}`}
                        alt="product_photo"
                        className="img-fluid rounded"
                        style={{ maxHeight: "200px" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image+Available";
                        }}
                      />
                    )
                  )}
                </div>

                {/* Product Fields */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
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
                    value={shipping ? "Yes" : "No"}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    UPDATE PRODUCT
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    DELETE PRODUCT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;