import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug]);

  // Get product
  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/single-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load similar products");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        {/* Main Product Section */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="border rounded-3 p-3 bg-white shadow-sm">
              <img
                src={`/api/v1/product/product-photo/${product._id}`}
                className="img-fluid rounded-3"
                alt={product.name}
                style={{ maxHeight: "500px", objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <h2 className="fw-bold mb-3">{product.name}</h2>
              
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-primary me-2">{product?.category?.name}</span>
                <div className="text-warning">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`bi ${i < 4 ? 'bi-star-fill' : 'bi-star'}`}></i>
                  ))}
                </div>
              </div>
              
              <h3 className="text-danger mb-4">${product.price}</h3>
              
              <p className="text-muted mb-4">{product.description}</p>
              
              <div className="d-flex gap-3">
                <button className="btn btn-primary px-4 py-2 flex-grow-1">
                  <i className="bi bi-cart-plus me-2"></i>Add to Cart
                </button>
                <button className="btn btn-outline-secondary px-4 py-2">
                  <i className="bi bi-heart me-2"></i>Wishlist
                </button>
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3">Product Details</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <span className="text-muted">Category:</span> {product?.category?.name}
                  </li>
                  <li className="mb-2">
                    <span className="text-muted">Availability:</span> In Stock
                  </li>
                  <li className="mb-2">
                    <span className="text-muted">Shipping:</span> Free shipping
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-5 pt-4">
          <h3 className="fw-bold mb-4">Similar Products</h3>
          
          {relatedProducts.length < 1 ? (
            <div className="alert alert-info">No similar products found</div>
          ) : (
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div key={p._id} className="col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <div className="position-relative overflow-hidden" style={{ height: "200px" }}>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top p-3"
                        alt={p.name}
                        style={{ objectFit: "contain", height: "100%" }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <button className="btn btn-sm btn-light rounded-circle">
                          <i className="bi bi-heart"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{p.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        {p.description.substring(0, 60)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="text-danger mb-0">${p.price}</h6>
                        <div className="text-warning small">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star"></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;