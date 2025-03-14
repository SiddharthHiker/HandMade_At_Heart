import express from "express";
import { isAdmin, requiresSignIn } from "./../middlewares/authMiddleware.js";
import {
  createProductController,
  getAllProductController,
  singleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
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

export default router;
