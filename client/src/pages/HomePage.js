import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio, Drawer, Spin, Button, Badge, message } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { 
  FilterOutlined, 
  RedoOutlined, 
  ShoppingCartOutlined, 
  EyeOutlined,
  CloseOutlined 
} from "@ant-design/icons";
import "../styles/homePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const filterTimeout = React.useRef(null);

  const API_URL = process.env.REACT_APP_API;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 992) {
        setMobileFiltersOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get all categories
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
    }
  }, [API_URL]);

  // Get total count
  const getTotal = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.error("Error fetching product count:", error);
      message.error("Failed to load product count");
    }
  }, [API_URL]);

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, [getAllCategory, getTotal]);

  // Get products
  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
    }
  }, [API_URL, page]);

  // Load more products
  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(prev => {
        // Ensure no duplicates by checking IDs
        const newProducts = data?.products.filter(
          newProd => !prev.some(existingProd => existingProd._id === newProd._id)
        );
        return [...prev, ...newProducts];
      });
    } catch (error) {
      console.error("Error loading more products:", error);
      setLoading(false);
      message.error("Failed to load more products");
    }
  }, [API_URL, page]);

  useEffect(() => {
    if (page === 1) {
      getAllProducts();
    } else {
      loadMore();
    }
  }, [page, getAllProducts, loadMore]);

  // Filter by category
  const handleFilter = useCallback((value, id) => {
    setChecked(prev => {
      let all = [...prev];
      if (value) {
        all.push(id);
      } else {
        all = all.filter((c) => c !== id);
      }
      return all;
    });
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) {
      if (page === 1) {
        getAllProducts();
      }
    }
  }, [checked.length, radio.length, getAllProducts, page]);

  // Get filtered products with debounce
  const filterProduct = useCallback(async () => {
    try {
      if (filterTimeout.current) clearTimeout(filterTimeout.current);
      
      filterTimeout.current = setTimeout(async () => {
        setLoading(true);
        const { data } = await axios.post(`${API_URL}/api/v1/product/product-filters`, {
          checked,
          radio,
        });
        setLoading(false);
        setProducts(data?.products || []);
      }, 300);
    } catch (error) {
      console.error("Error filtering products:", error);
      setLoading(false);
      message.error("Failed to apply filters");
    }
  }, [API_URL, checked, radio]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio, filterProduct]);

  // Calculate active filter count for badge
  const activeFilterCount = useMemo(() => {
    return checked.length + (radio.length ? 1 : 0);
  }, [checked, radio]);

  // Filter sidebar content
  const renderFilters = () => (
    <div className="filter-section p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0 text-primary">
          <FilterOutlined className="me-2" />
          Filter Products
        </h4>
        <div>
          <Button
            type="text"
            icon={<RedoOutlined />}
            onClick={() => {
              setChecked([]);
              setRadio([]);
              setPage(1);
            }}
            size="small"
            className="me-1"
          >
            Reset
          </Button>
          {windowWidth < 992 && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileFiltersOpen(false)}
              size="small"
            />
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="filter-group mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="filter-group-title m-0 d-flex align-items-center">
            <span className="filter-count-badge me-2">
              {checked.length}
            </span>
            Categories
          </h5>
          {checked.length > 0 && (
            <Button
              type="link"
              size="small"
              onClick={() => setChecked([])}
              className="p-0"
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="category-filters">
          {categories?.map((c) => (
            <div key={`category-${c._id}`} className="filter-item">
              <Checkbox
                checked={checked.includes(c._id)}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                className="custom-checkbox"
              >
                <span className="ms-2">{c.name}</span>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-group">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="filter-group-title m-0 d-flex align-items-center">
            <span className="filter-count-badge me-2">
              {radio.length ? 1 : 0}
            </span>
            Price Range
          </h5>
          {radio.length > 0 && (
            <Button
              type="link"
              size="small"
              onClick={() => setRadio([])}
              className="p-0"
            >
              Clear all
            </Button>
          )}
        </div>
        <div className="price-filters">
          <Radio.Group
            onChange={(e) => setRadio(e.target.value)}
            value={radio}
            className="w-100"
          >
            {Prices?.map((p, index) => (
              <div key={`price-${index}`} className="filter-item">
                <Radio
                  value={p.array}
                  className={`price-radio ${radio === p.array ? 'price-radio-active' : ''}`}
                >
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <span>{p.name}</span>
                    <span className="price-range">
                      {p.array[0] === 0
                        ? `Under $${p.array[1]}`
                        : p.array[1] === 1000000
                        ? `Over $${p.array[0]}`
                        : `$${p.array[0]} - $${p.array[1]}`}
                    </span>
                  </div>
                </Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className="container-fluid home-container">
        {/* Filter Toggle Button - Visible on all screens */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h2 className="products-title m-0">All Products</h2>
          <Badge count={activeFilterCount} offset={[10, 0]}>
            <Button
              type={sidebarCollapsed || mobileFiltersOpen ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={() => {
                if (windowWidth < 992) {
                  setMobileFiltersOpen(!mobileFiltersOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              size="large"
              className="filter-toggle-btn"
            >
              {windowWidth < 992 
                ? (mobileFiltersOpen ? 'Hide Filters' : 'Show Filters')
                : (sidebarCollapsed ? 'Show Filters' : 'Hide Filters')}
            </Button>
          </Badge>
        </div>

        <div className="row g-3">
          {/* Desktop Filters Section - Can be toggled */}
          {windowWidth >= 992 && !sidebarCollapsed && (
            <div className="col-lg-3 col-md-4 filters-column">
              <div className="shadow-sm rounded-3 bg-white h-100 sticky-top" style={{ top: '80px' }}>
                {renderFilters()}
              </div>
            </div>
          )}

          {/* Mobile Filters Drawer */}
          {windowWidth < 992 && (
            <Drawer
              title="Filters"
              placement="left"
              width={300}
              onClose={() => setMobileFiltersOpen(false)}
              open={mobileFiltersOpen}
              className="filter-drawer"
              closable={false}
              extra={
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setMobileFiltersOpen(false)}
                  type="text"
                />
              }
            >
              {renderFilters()}
            </Drawer>
          )}

          {/* Products Section - Adjusts based on sidebar state */}
          <div className={`${windowWidth >= 992 ? (sidebarCollapsed ? 'col-12' : 'col-lg-9 col-md-8') : 'col-12'}`}>
            <div className="products-header mb-4">
              <p className="text-muted">{total} products available</p>
            </div>

            {loading && products.length === 0 ? (
              <div className="text-center py-5">
                <Spin size="large" />
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
                  {products?.map((p) => (
                    <div className="col" key={`product-${p._id}-${p.slug}`}>
                      <div className="card h-100 product-card shadow-sm border-0">
                        <div className="product-image-container">
                          <img
                            src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
                            className={`card-img-top product-image ${loadedImages[p._id] ? '' : 'image-loading'}`}
                            alt={p.name}
                            loading="lazy"
                            onLoad={() => setLoadedImages(prev => ({...prev, [p._id]: true}))}
                          />
                          <div className="product-badge">{p?.category?.name}</div>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title product-name">{p.name}</h5>
                          <p className="card-text product-description text-muted">
                            {p.description.substring(0, 60)}...
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="product-price m-0 text-primary">
                              ${p.price}
                            </h5>
                            <div className="product-rating text-warning">
                              ★★★★☆
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-white border-0">
                          <div className="d-grid gap-2">
                            <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              onClick={() => navigate(`/product/${p.slug}`)}
                            >
                              View Details
                            </Button>
                            <Button
                              icon={<ShoppingCartOutlined />}
                              onClick={() => {
                                // Add to cart functionality
                                message.success(`${p.name} added to cart`);
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {products.length > 0 && products.length < total && (
                  <div className="text-center mt-4">
                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      onClick={() => setPage(page + 1)}
                    >
                      {loading ? "Loading..." : "Load More Products"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;