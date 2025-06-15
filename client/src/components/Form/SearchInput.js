import React, { useEffect, useState, useCallback } from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  const [, setValues] = useSearch(); // Only destructure setValues
  const navigate = useNavigate();
  const [localKeyword, setLocalKeyword] = useState("");
  const debouncedKeyword = useDebounce(localKeyword, 500);

  const handleSearch = useCallback(async (keyword) => {
    try {
      const { data } = await axios.get(`/api/v1/product/search/${keyword}`);
      setValues((prevValues) => ({ ...prevValues, keyword, results: data }));
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  }, [navigate, setValues]);

  useEffect(() => {
    if (debouncedKeyword) {
      handleSearch(debouncedKeyword);
    } else {
      setValues((prevValues) => ({ ...prevValues, results: [] }));
    }
  }, [debouncedKeyword, handleSearch, setValues]);

  const handleChange = (e) => {
    setLocalKeyword(e.target.value);
    setValues((prevValues) => ({ ...prevValues, keyword: e.target.value }));
  };

  return (
    <div className="d-flex align-items-center" style={{ width: "250px" }}>
      <div className="position-relative w-100">
        <input
          className="form-control border-end-0 border rounded-pill py-1"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          value={localKeyword}
          onChange={handleChange}
          style={{ 
            paddingLeft: "35px",
            fontSize: "0.9rem",
            height: "38px"
          }}
        />
        <FaSearch 
          className="position-absolute top-50 translate-middle-y text-muted"
          style={{ left: "15px", zIndex: 10 }}
        />
      </div>
    </div>
  );
};

export default SearchInput;