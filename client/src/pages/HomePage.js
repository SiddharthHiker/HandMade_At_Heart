import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { 
  Checkbox, 
  Radio, 
  Drawer, 
  Spin, 
  Button, 
  Badge, 
  message, 
  Card, 
  Tag, 
  Space, 
  Divider,
  Skeleton 
} from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { 
  FilterOutlined, 
  RedoOutlined, 
  ShoppingCartOutlined, 
  EyeOutlined,
  CloseOutlined,
  StarFilled,
  FireFilled
} from "@ant-design/icons";
import "../styles/homePage.css";
import toast, { Toaster } from "react-hot-toast";

const { Meta } = Card;

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
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

  // Get products with price normalization
  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      // Normalize prices to numbers
      const normalizedProducts = data.products.map(product => ({
        ...product,
        price: Number(product.price) || 0
      }));
      setProducts(normalizedProducts);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
    }
  }, [API_URL, page]);

  // Load more products with price normalization
  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(prev => {
        const newProducts = data?.products
          .filter(newProd => !prev.some(existingProd => existingProd._id === newProd._id))
          .map(product => ({
            ...product,
            price: Number(product.price) || 0
          }));
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
        // Normalize prices in filtered products
        const normalizedProducts = (data?.products || []).map(product => ({
          ...product,
          price: Number(product.price) || 0
        }));
        setProducts(normalizedProducts);
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
      {/* Global Toaster Configuration */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#4bb543',
            color: '#fff',
            minWidth: '250px',
            fontSize: '16px',
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
        }}
      />
      
      <div className="container-fluid home-container px-lg-4">
        {/* Page Header with Filter Toggle */}
        <div className="d-flex justify-content-between align-items-center mb-4 py-3 border-bottom">
          <div>
            <h1 className="mb-1">Shop Products</h1>
            <p className="text-muted mb-0">{total} products available</p>
          </div>
          <Badge count={activeFilterCount} size="small" offset={[-5, 10]}>
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
                ? (mobileFiltersOpen ? 'Hide Filters' : 'Filters')
                : (sidebarCollapsed ? 'Show Filters' : 'Hide Filters')}
            </Button>
          </Badge>
        </div>

        <div className="row g-4">
          {/* Desktop Filters Section */}
          {windowWidth >= 992 && !sidebarCollapsed && (
            <div className="col-lg-3 col-md-4 filters-column">
              <div className="shadow-sm rounded-3 bg-white h-100 sticky-top" style={{ top: '100px' }}>
                {renderFilters()}
              </div>
            </div>
          )}

          {/* Mobile Filters Drawer */}
          {windowWidth < 992 && (
            <Drawer
              title={
                <div className="d-flex justify-content-between align-items-center">
                  <span>Filters</span>
                  <Badge count={activeFilterCount} size="small">
                    <Button
                      type="text"
                      icon={<RedoOutlined />}
                      onClick={() => {
                        setChecked([]);
                        setRadio([]);
                      }}
                      size="small"
                    />
                  </Badge>
                </div>
              }
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

          {/* Products Section */}
          <div className={`${windowWidth >= 992 ? (sidebarCollapsed ? 'col-12' : 'col-lg-9 col-md-8') : 'col-12'}`}>
            {loading && products.length === 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
                {[...Array(6)].map((_, i) => (
                  <div className="col" key={`skeleton-${i}`}>
                    <Card className="h-100">
                      <Skeleton.Image active style={{ width: '100%', height: '200px' }} />
                      <Card.Meta
                        title={<Skeleton.Input active size="small" />}
                        description={
                          <>
                            <Skeleton paragraph={{ rows: 2 }} active />
                            <Skeleton.Button active size="small" />
                          </>
                        }
                      />
                      <div className="p-3">
                        <Skeleton.Button active block />
                        <Skeleton.Button active block className="mt-2" />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {products.length === 0 && !loading ? (
                  <div className="text-center py-5">
                    <img
                      src="/images/no-products.svg"
                      alt="No products found"
                      style={{ maxWidth: '300px', opacity: 0.7 }}
                      className="mb-4"
                    />
                    <h4>No products found</h4>
                    <p className="text-muted">Try adjusting your filters or search terms</p>
                    <Button
                      type="primary"
                      onClick={() => {
                        setChecked([]);
                        setRadio([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
                      {products?.map((p) => (
                        <div className="col" key={`product-${p._id}-${p.slug}`}>
                          <Card
                            hoverable
                            className="h-100 product-card"
                            cover={
                              <div className="product-image-container">
                                <img
                                  src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
                                  alt={p.name}
                                  loading="lazy"
                                  className={`product-image ${loadedImages[p._id] ? 'loaded' : 'loading'}`}
                                  onLoad={() => setLoadedImages(prev => ({...prev, [p._id]: true}))}
                                />
                                {p?.category?.name && (
                                  <Tag color="blue" className="product-badge">
                                    {p.category.name}
                                  </Tag>
                                )}
                                {p?.trending && (
                                  <Tag 
                                    icon={<FireFilled />} 
                                    color="orange" 
                                    className="product-trending-badge"
                                  >
                                    Trending
                                  </Tag>
                                )}
                              </div>
                            }
                            actions={[
                              <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => navigate(`/product/${p.slug}`)}
                                block
                              >
                                View Details
                              </Button>,
                               <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => {
                                  const existingIndex = cart.findIndex(item => item._id === p._id);
                                  let updatedCart = [...cart];

                                  if (existingIndex > -1) {
                                    const existingItem = updatedCart[existingIndex];
                                    updatedCart[existingIndex] = {
                                      ...existingItem,
                                      quantity: (existingItem.quantity || 1) + 1,
                                    };
                                    toast('Increased quantity in cart');
                                  } else {
                                    updatedCart.push({ ...p, quantity: 1 });
                                    toast.success('Added to cart');
                                  }

                                  setCart(updatedCart);
                                  localStorage.setItem("cart", JSON.stringify(updatedCart));
                                }}
                                block
                              >
                                Add to Cart
                              </Button>
                            ]}
                          >
                            <Meta
                              title={p.name}
                              description={
                                <>
                                  <div className="text-truncate-2 mb-2" style={{ height: '40px' }}>
                                    {p.description}
                                  </div>
                                  <Divider className="my-2" />
                                  <Space className="w-100 justify-content-between">
                                    <span className="text-primary fw-bold">
                                      ${Number(p.price).toFixed(2)}
                                    </span>
                                    <span className="text-warning">
                                      <StarFilled /> {p.rating || '4.5'}
                                    </span>
                                  </Space>
                                </>
                              }
                            />
                          </Card>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {products.length > 0 && products.length < total && (
                      <div className="text-center mt-5">
                        <Button
                          type="primary"
                          size="large"
                          loading={loading}
                          onClick={() => setPage(page + 1)}
                          style={{ minWidth: '200px' }}
                        >
                          {loading ? "Loading..." : "Load More"}
                        </Button>
                      </div>
                    )}
                  </>
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