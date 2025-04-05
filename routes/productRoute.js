import express from "express";
import { isAdmin, requiresSignIn } from "./../middlewares/authMiddleware.js";
import {
  createProductController,
  getAllProductController,
  singleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController
} from "../controllers/productController.js";
import formidable from "express-formidable";

// Router Object
const router = express.Router();

// Router
// Create Product
router.post(
  "/create-product",
  requiresSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Get All Product
router.get("/get-product", getAllProductController);

// Single Product
router.get("/single-product/:slug", singleProductController);

// get photo
router.get("/product-photo/:pid", productPhotoController);

// Delete Product
router.delete("/product-delete/:pid", deleteProductController);

// Update Product
router.put(
  "/update-product/:pid",
  requiresSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Filter Product
router.post('/product-filters',productFilterController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

// Search Product 
router.get('/search/:keyword',searchProductController);

router.get('/related-product/:pid/:cid',realtedProductController)

export default router;
