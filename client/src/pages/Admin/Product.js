import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../../styles/products.css";
import ReactPaginate from "react-paginate";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(1); // Initialize with 1 instead of 0
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 9; // Set your desired products per page

  const getAllProducts = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product?page=${page}&limit=${productsPerPage}`
      );
      setProducts(data.products);
      setTotalProducts(data.totalCount);
      // Calculate total pages and ensure it's an integer
      const calculatedPages = Math.ceil(data.totalCount / productsPerPage);
      setPageCount(calculatedPages || 1); // Fallback to 1 if calculation fails
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    getAllProducts(data.selected + 1); // +1 because pages are 1-indexed in API
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products List</h1>
          <div className="d-flex justify-content-between mb-3">
            <p>Total Products: {totalProducts}</p>
            <p>Page {currentPage + 1} of {pageCount}</p>
          </div>
          <div className="row">
            {products?.map((p) => (
              <div key={p._id} className="col-md-4 mb-4">
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div className="card product-card">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top product-image"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title product-title">{p.name}</h5>
                      <p className="card-text product-description">
                        {p.description.substring(0, 50)}...
                      </p>
                      <button className="btn btn-primary w-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              forcePage={currentPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;