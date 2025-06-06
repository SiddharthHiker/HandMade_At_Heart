import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/v1/product/product-category/${params.slug}`
        );
        setProducts(data?.products || []);
        setCategory(data?.category);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) fetchProductsByCategory();
  }, [params?.slug]);

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-3">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4">
        {/* Category Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">{category?.name}</h2>
          <p className="text-muted">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="row g-4">
            {products.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={`/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top p-3"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted">
                      {product.description.substring(0, 60)}...
                    </p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h5 text-primary">${product.price}</span>
                        {product.quantity > 0 ? (
                          <span className="badge bg-success">In Stock</span>
                        ) : (
                          <span className="badge bg-danger">Out of Stock</span>
                        )}
                      </div>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          <i className="bi bi-eye me-2"></i>View Details
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          disabled={product.quantity <= 0}
                        >
                          <i className="bi bi-cart-plus me-2"></i>Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h5 className="text-muted">No products found in this category</h5>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;