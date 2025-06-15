import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart"; // Add this import
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Add this import for notifications

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart(); // Get cart context
  const navigate = useNavigate();

  // Add to cart function
  const addToCart = (product) => {
    try {
      // Check if product already exists in cart
      const existingItem = cart.find((item) => item._id === product._id);
      
      if (existingItem) {
        // If exists, update quantity
        const updatedCart = cart.map((item) =>
          item._id === product._id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        // If new, add to cart with quantity 1
        const newCart = [...cart, { ...product, quantity: 1 }];
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
      toast.success("Item added to cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> $ {p.price}</p>
                  <button 
                    className="btn btn-primary ms-1" 
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button 
                    className="btn btn-secondary ms-1"
                    onClick={() => addToCart(p)} // Add onClick handler
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;