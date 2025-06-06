import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaShoppingCart, FaHome, FaMapMarkerAlt, FaChevronLeft } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import "../styles/CartStyles.css";


const CartPage = () => {
  const [auth] = useAuth(); // Removed setAuth since it's unused
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Total price calculation with quantity
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total = total + (item.price * (item.quantity || 1));
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
      return "$0.00";
    }
  };

  // Update quantity function
  const updateQuantity = (pid, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      let updatedCart = cart.map(item =>
        item._id === pid ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = cart.filter((item) => item._id !== pid);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
    }
  };

  // Get payment gateway token 
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post("/api/v1/product/braintree/payment", { // Removed unused data destructuring
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container py-4">
        {/* Breadcrumb and Title */}
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/" className="text-decoration-none">
                    <FaHome className="me-1" /> Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Shopping Cart
                </li>
              </ol>
            </nav>
            <h2 className="fw-bold mb-0">Your Shopping Cart</h2>
          </div>
        </div>

        {cart?.length > 0 ? (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-semibold">
                      {cart.reduce((acc, item) => acc + (item.quantity || 1), 0)} Item{cart.reduce((acc, item) => acc + (item.quantity || 1), 0) > 1 ? 's' : ''} in Cart
                    </h5>
                    {auth?.token ? (
                      <span className="text-muted small">Welcome back, {auth.user.name}</span>
                    ) : (
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate("/login", { state: "/cart" })}
                      >
                        Login to Checkout
                      </button>
                    )}
                  </div>
                </div>
                <div className="card-body p-0">
                  {cart?.map((p) => (
                    <div key={p._id} className="row p-3 border-bottom align-items-center">
                      <div className="col-md-2 col-4">
                        <div 
                          className="bg-light rounded p-2 d-flex align-items-center justify-content-center" 
                          style={{ height: "100px", cursor: "pointer" }}
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="img-fluid"
                            alt={p.name}
                            style={{ maxHeight: "90px", objectFit: "contain" }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-8">
                        <h6 className="mb-1 fw-semibold">{p.name}</h6>
                        <p className="text-muted small mb-1">
                          {p.description.substring(0, 50)}...
                        </p>
                        <p className="mb-0 text-primary fw-bold">
                          {p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </div>
                      <div className="col-md-3 col-6 mt-2 mt-md-0">
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm p-1"
                            onClick={() => updateQuantity(p._id, (p.quantity || 1) - 1)}
                          >
                            <AiOutlineMinus size={14} />
                          </button>
                          <div className="mx-2 px-3 py-1 border rounded text-center" style={{ minWidth: "40px" }}>
                            {p.quantity || 1}
                          </div>
                          <button
                            className="btn btn-outline-secondary btn-sm p-1"
                            onClick={() => updateQuantity(p._id, (p.quantity || 1) + 1)}
                          >
                            <AiOutlinePlus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="col-md-3 col-6 text-md-end mt-2 mt-md-0">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeCartItem(p._id)}
                        >
                          <FaTrash className="me-1" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">{totalPrice()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Tax</span>
                    <span className="text-muted">Calculated at checkout</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Estimated Total</span>
                    <span className="fw-bold text-primary">{totalPrice()}</span>
                  </div>

                  {auth?.user?.address ? (
                    <>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                          <FaMapMarkerAlt className="me-2 text-primary" />
                          <h6 className="mb-0 fw-semibold">Delivery Address</h6>
                        </div>
                        <div className="p-3 bg-light rounded">
                          <p className="mb-0 small">{auth?.user?.address}</p>
                        </div>
                        <button
                          className="btn btn-link p-0 mt-2 small"
                          onClick={() => navigate("/dashboard/user/profile")}
                        >
                          Update Address
                        </button>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary py-2"
                          onClick={() => navigate("/checkout")}
                        >
                          Proceed to Checkout
                        </button>
                        
                        {clientToken && (
                          <div className="mt-3">
                            <DropIn
                              options={{
                                authorization: clientToken,
                                paypal: {
                                  flow: 'vault'
                                }
                              }}
                              onInstance={instance => setInstance(instance)}
                            />
                            <button 
                              className="btn btn-success w-100 mt-2"
                              onClick={handlePayment} 
                              disabled={loading || !instance || !auth?.user?.address}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Processing...
                                </>
                              ) : "Pay Securely"}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="d-grid gap-2">
                      {auth?.token ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate("/dashboard/user/profile")}
                        >
                          Add Delivery Address
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate("/login", { state: "/cart" })}
                        >
                          Login to Checkout
                        </button>
                      )}
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/")}
                    >
                      <FaChevronLeft className="me-2" /> Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="card-body">
                  <div className="mx-auto mb-4" style={{ width: "100px", height: "100px" }}>
                    <FaShoppingCart className="w-100 h-100 text-muted" />
                  </div>
                  <h3 className="mb-3 fw-semibold">Your cart is empty</h3>
                  <p className="text-muted mb-4">
                    Looks like you haven't added anything to your cart yet
                  </p>
                  <button
                    className="btn btn-primary px-4"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;