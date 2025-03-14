import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../../styles/products.css"; // Custom CSS for additional styling
import ReactPaginate from "react-paginate";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(0);

  const getAllProducts = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product?page=${page}`
      );
      setProducts(data.products);
      setPageCount(data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    getAllProducts(data.selected + 1);
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
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
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
        </div>
      </div>
    </Layout>
  );
};

export default Products;
